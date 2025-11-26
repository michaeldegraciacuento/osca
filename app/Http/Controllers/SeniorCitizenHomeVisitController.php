<?php

namespace App\Http\Controllers;

use App\Models\SeniorCitizenHomeVisit;
use App\Models\SeniorCitizenRegistration;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use App\Mail\HomeVisitScheduledMail;

class SeniorCitizenHomeVisitController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->get('search');

        $query = SeniorCitizenHomeVisit::with('registration')
            ->when($search, function ($q) use ($search) {
                $q->where(function($inner) use ($search) {
                    $inner->whereHas('registration', function($r) use ($search) {
                        $r->where('registration_id', 'like', "%{$search}%")
                          ->orWhere('first_name', 'like', "%{$search}%")
                          ->orWhere('last_name', 'like', "%{$search}%")
                          ->orWhere('middle_name', 'like', "%{$search}%");
                    })->orWhere('notes', 'like', "%{$search}%");
                });
            })
            ->orderByDesc('scheduled_date')
            ->orderBy('time_slot');

        $visits = $query->paginate(15)->withQueryString()
            ->through(function (SeniorCitizenHomeVisit $v) {
                $registration = $v->registration;
                return [
                    'id' => $v->id,
                    'scheduled_date' => $v->scheduled_date?->format('Y-m-d'),
                    'time_slot' => $v->time_slot,
                    'status' => $v->status,
                    'notes' => $v->notes,
                    // nested object (preferred)
                    'registration' => $registration ? [
                        'registration_id' => $registration->registration_id,
                        'full_name' => $registration->full_name,
                    ] : null,
                    // root-level fallbacks (for legacy / safety)
                    'registration_id' => $registration?->registration_id,
                    'full_name' => $registration?->full_name,
                    // extra explicit names
                    'registration_code' => $registration?->registration_id,
                    'registration_full_name' => $registration?->full_name,
                ];
            });

        return Inertia::render('admin/SeniorCitizenHomeVisit/Index', [
            'visits' => $visits,
            'time_slots' => SeniorCitizenHomeVisit::TIME_SLOTS,
            'statuses' => SeniorCitizenHomeVisit::STATUSES,
            'filters' => ['search' => $search],
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'registration_id' => 'required|string', // human-readable code
            'scheduled_date' => 'required|date|after_or_equal:today',
            'time_slot' => 'required|in:' . implode(',', SeniorCitizenHomeVisit::TIME_SLOTS),
            'notes' => 'nullable|string|max:1000',
        ]);

        $registration = SeniorCitizenRegistration::where('registration_id', $request->registration_id)->first();

        if (!$registration) {
            return back()->withErrors(['registration_id' => 'Registration ID not found.'])->withInput();
        }

        // Check if a home visit already exists for this registration
        $existingVisit = SeniorCitizenHomeVisit::where('registration_id', $registration->id)
            ->whereIn('status', ['Scheduled', 'Re-Scheduled', 'In-Progress'])
            ->first();

        if ($existingVisit) {
            $message = "⚠️ VISIT ALREADY EXISTS!\n\n";
            $message .= "Registration ID: " . $registration->registration_id . "\n";
            $message .= "Name: " . $registration->full_name . "\n";
            $message .= "Current Status: " . $existingVisit->status . "\n";
            $message .= "Scheduled Date: " . $existingVisit->scheduled_date->format('F d, Y') . "\n";
            $message .= "Time Slot: " . $existingVisit->time_slot . "\n";
            $message .= "\n❌ Cannot create a new visit. Please update or cancel the existing visit first.";
            
            return back()->with('alert', $message)->withInput();
        }

        $visit = SeniorCitizenHomeVisit::create([
            'registration_id' => $registration->id, // numeric FK
            'scheduled_date' => $request->scheduled_date,
            'time_slot' => $request->time_slot,
            'status' => 'Scheduled',
            'notes' => $request->notes,
            'created_by' => Auth::id(),
            'updated_by' => Auth::id(),
        ]);

        // Send email notification to the senior citizen
        try {
            Mail::to($registration->email)->send(new HomeVisitScheduledMail($visit, $registration));
        } catch (\Exception $e) {
            // Log the error but don't fail the visit creation
            \Log::error('Failed to send home visit email: ' . $e->getMessage());
        }

        $message = "✅ VISIT SCHEDULED SUCCESSFULLY!\n\n";
        $message .= "Registration ID: " . $registration->registration_id . "\n";
        $message .= "Name: " . $registration->full_name . "\n";
        $message .= "Scheduled Date: " . date('F d, Y', strtotime($request->scheduled_date)) . "\n";
        $message .= "Time Slot: " . $request->time_slot . "\n";
        if ($request->notes) {
            $message .= "Notes: " . $request->notes . "\n";
        }
        $message .= "\n✓ Email notification sent to senior citizen";

        return back()->with('alert', $message);
    }

    public function updateStatus(Request $request, SeniorCitizenHomeVisit $visit)
    {
        $request->validate([
            'status' => 'required|in:' . implode(',', SeniorCitizenHomeVisit::STATUSES),
            'scheduled_date' => 'nullable|date|after_or_equal:today',
            'time_slot' => 'nullable|in:' . implode(',', SeniorCitizenHomeVisit::TIME_SLOTS),
            'notes' => 'nullable|string|max:1000',
        ]);

        if ($request->status === 'Re-Scheduled') {
            $request->validate([
                'scheduled_date' => 'required|date|after_or_equal:today',
                'time_slot' => 'required|in:' . implode(',', SeniorCitizenHomeVisit::TIME_SLOTS),
            ]);
            $visit->scheduled_date = $request->scheduled_date;
            $visit->time_slot = $request->time_slot;
        }

        $visit->status = $request->status;
        if ($request->filled('notes')) {
            $visit->notes = $request->notes;
        }
        $visit->updated_by = Auth::id();
        $visit->save();

        $message = "✅ VISIT UPDATED SUCCESSFULLY!\n\n";
        $message .= "Status: " . $request->status . "\n";
        if ($request->status === 'Re-Scheduled') {
            $message .= "New Date: " . date('F d, Y', strtotime($request->scheduled_date)) . "\n";
            $message .= "New Time: " . $request->time_slot . "\n";
        }
        if ($request->filled('notes')) {
            $message .= "Notes: " . $request->notes . "\n";
        }

        return back()->with('alert', $message);
    }

    public function destroy(SeniorCitizenHomeVisit $visit)
    {
        $regId = $visit->registration?->registration_id ?? 'N/A';
        $visit->delete();

        $message = "✅ VISIT DELETED!\n\n";
        $message .= "Home visit for " . $regId . " has been removed from the system.";

        return back()->with('alert', $message);
    }

    public function getCalendar()
    {
        // Get all scheduled visits for public calendar view
        $visits = SeniorCitizenHomeVisit::with('registration:id,registration_id,first_name,last_name,middle_name')
            ->whereIn('status', ['Scheduled', 'Re-Scheduled', 'In-Progress'])
            ->where('scheduled_date', '>=', now()->subMonths(1))
            ->where('scheduled_date', '<=', now()->addMonths(3))
            ->select('id', 'registration_id', 'scheduled_date', 'time_slot', 'status')
            ->orderBy('scheduled_date')
            ->orderBy('time_slot')
            ->get();

        return response()->json([
            'visits' => $visits->map(fn($v) => [
                'id' => $v->id,
                'scheduled_date' => $v->scheduled_date->format('Y-m-d'),
                'time_slot' => $v->time_slot,
                'status' => $v->status,
                'registration_id' => $v->registration?->registration_id,
                'full_name' => $v->registration?->full_name,
            ])
        ]);
    }
}
