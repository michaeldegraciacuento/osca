<?php

namespace App\Http\Controllers;

use App\Models\SeniorCitizenMortuaryApplication;
use App\Models\SeniorCitizenRegistration;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class SeniorCitizenMortuaryApplicationController extends Controller
{
    /**
     * Display a listing of mortuary applications.
     */
    public function index(Request $request)
    {
        $search = $request->get('search');
        $status = $request->get('status');

        $query = SeniorCitizenMortuaryApplication::with('registration:id,registration_id,first_name,last_name,middle_name')
            ->when($search, function ($q) use ($search) {
                $q->where(function($inner) use ($search) {
                    $inner->whereHas('registration', function($r) use ($search) {
                        $r->where('registration_id', 'like', "%{$search}%")
                          ->orWhere('first_name', 'like', "%{$search}%")
                          ->orWhere('last_name', 'like', "%{$search}%");
                    })->orWhere('notes', 'like', "%{$search}%");
                });
            })
            ->when($status, function ($q) use ($status) {
                $q->where('status', $status);
            })
            ->latest();

        $applications = $query->paginate(15)->withQueryString()
            ->through(function (SeniorCitizenMortuaryApplication $app) {
                $registration = $app->registration;
                return [
                    'id' => $app->id,
                    'registration' => [
                        'id' => $registration->id,
                        'registration_id' => $registration->registration_id,
                        'full_name' => $registration->full_name,
                    ],
                    'status' => $app->status,
                    'status_label' => $app->status_label,
                    'reviewed_at' => $app->reviewed_at?->toISOString(),
                    'created_at' => $app->created_at->toISOString(),
                ];
            });

        $stats = [
            'total' => SeniorCitizenMortuaryApplication::count(),
            'pending' => SeniorCitizenMortuaryApplication::where('status', 'pending')->count(),
            'under_review' => SeniorCitizenMortuaryApplication::where('status', 'under_review')->count(),
            'approved' => SeniorCitizenMortuaryApplication::where('status', 'approved')->count(),
            'rejected' => SeniorCitizenMortuaryApplication::where('status', 'rejected')->count(),
            'released' => SeniorCitizenMortuaryApplication::where('status', 'released')->count(),
        ];

        return Inertia::render('admin/SeniorCitizenMortuaryApplications/Index', [
            'applications' => $applications,
            'filters' => $request->only(['search', 'status']),
            'stats' => $stats,
        ]);
    }

    /**
     * Show the form for creating a new application.
     */
    public function create()
    {
        // Get approved senior citizens who don't have a mortuary application yet
        $availableRegistrations = SeniorCitizenRegistration::where('status', 'approved')
            ->whereDoesntHave('mortuaryApplication')
            ->get(['id', 'registration_id', 'first_name', 'last_name', 'middle_name']);

        return Inertia::render('admin/SeniorCitizenMortuaryApplications/Create', [
            'registrations' => $availableRegistrations->map(fn($reg) => [
                'id' => $reg->id,
                'registration_id' => $reg->registration_id,
                'full_name' => $reg->full_name,
            ]),
        ]);
    }

    /**
     * Store a newly created application.
     */
    public function store(Request $request)
    {
        $request->validate([
            'senior_citizen_registration_id' => 'required|exists:senior_citizen_registrations,id',
            
            // Documents
            'osca_id_original' => 'nullable|file|mimes:jpeg,png,jpg,pdf|max:5120',
            'brgy_residency_certificate' => 'nullable|file|mimes:jpeg,png,jpg,pdf|max:5120',
            'brgy_indigency' => 'nullable|file|mimes:jpeg,png,jpg,pdf|max:5120',
            'death_certificate' => 'nullable|file|mimes:jpeg,png,jpg,pdf|max:5120',
            'affidavit_of_next_of_kin' => 'nullable|file|mimes:jpeg,png,jpg,pdf|max:5120',
            'osca_certificate' => 'nullable|file|mimes:jpeg,png,jpg,pdf|max:5120',
            'marriage_contract' => 'nullable|file|mimes:jpeg,png,jpg,pdf|max:5120',
            'birth_certificate_of_children' => 'nullable|file|mimes:jpeg,png,jpg,pdf|max:5120',
            'valid_id_of_children' => 'nullable|file|mimes:jpeg,png,jpg,pdf|max:5120',
            'valid_id_of_claimants' => 'nullable|file|mimes:jpeg,png,jpg,pdf|max:5120',
            'waiver_authority_to_claim' => 'nullable|file|mimes:jpeg,png,jpg,pdf|max:5120',
            
            'notes' => 'nullable|string|max:1000',
        ]);

        DB::beginTransaction();

        try {
            // Handle file uploads
            $documentPaths = [];
            $documentFields = [
                'osca_id_original',
                'brgy_residency_certificate',
                'brgy_indigency',
                'death_certificate',
                'affidavit_of_next_of_kin',
                'osca_certificate',
                'marriage_contract',
                'birth_certificate_of_children',
                'valid_id_of_children',
                'valid_id_of_claimants',
                'waiver_authority_to_claim',
            ];
            
            foreach ($documentFields as $field) {
                if ($request->hasFile($field)) {
                    $file = $request->file($field);
                    $filename = time() . '_' . $field . '.' . $file->getClientOriginalExtension();
                    $path = $file->storeAs('mortuary-documents/' . date('Y/m'), $filename, 'public');
                    $documentPaths[$field] = $path;
                }
            }

            // Create the application
            $application = SeniorCitizenMortuaryApplication::create([
                'senior_citizen_registration_id' => $request->senior_citizen_registration_id,
                ...$documentPaths,
                'notes' => $request->notes,
                'status' => 'pending',
            ]);

            DB::commit();

            Log::info('Mortuary Application created', [
                'application_id' => $application->id,
                'registration_id' => $application->senior_citizen_registration_id,
            ]);

            return redirect()->route('admin.senior-citizen-mortuary-applications.index')
                ->with('alert', "✅ Mortuary application created successfully!");

        } catch (\Exception $e) {
            DB::rollback();

            // Clean up uploaded files if database save failed
            foreach ($documentPaths as $path) {
                Storage::disk('public')->delete($path);
            }

            Log::error('Mortuary Application creation failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return back()->with('alert', "❌ Failed to create mortuary application. Please try again.")
                ->withInput();
        }
    }

    /**
     * Display the specified application.
     */
    public function show(SeniorCitizenMortuaryApplication $application)
    {
        $application->load(['registration', 'reviewer']);

        return Inertia::render('admin/SeniorCitizenMortuaryApplications/Show', [
            'application' => [
                'id' => $application->id,
                'registration' => [
                    'id' => $application->registration->id,
                    'registration_id' => $application->registration->registration_id,
                    'full_name' => $application->registration->full_name,
                ],
                'osca_id_original' => $application->osca_id_original,
                'brgy_residency_certificate' => $application->brgy_residency_certificate,
                'brgy_indigency' => $application->brgy_indigency,
                'death_certificate' => $application->death_certificate,
                'affidavit_of_next_of_kin' => $application->affidavit_of_next_of_kin,
                'osca_certificate' => $application->osca_certificate,
                'marriage_contract' => $application->marriage_contract,
                'birth_certificate_of_children' => $application->birth_certificate_of_children,
                'valid_id_of_children' => $application->valid_id_of_children,
                'valid_id_of_claimants' => $application->valid_id_of_claimants,
                'waiver_authority_to_claim' => $application->waiver_authority_to_claim,
                'status' => $application->status,
                'status_label' => $application->status_label,
                'notes' => $application->notes,
                'reviewed_at' => $application->reviewed_at?->toISOString(),
                'reviewed_by' => $application->reviewer ? [
                    'id' => $application->reviewer->id,
                    'name' => $application->reviewer->name,
                ] : null,
                'created_at' => $application->created_at->toISOString(),
                'updated_at' => $application->updated_at->toISOString(),
            ],
        ]);
    }

    /**
     * Show the form for editing the application.
     */
    public function edit(SeniorCitizenMortuaryApplication $application)
    {
        $application->load('registration', 'reviewer');

        return Inertia::render('admin/SeniorCitizenMortuaryApplications/Edit', [
            'application' => [
                'id' => $application->id,
                'registration' => [
                    'id' => $application->registration->id,
                    'registration_id' => $application->registration->registration_id,
                    'full_name' => $application->registration->full_name,
                ],
                'osca_id_original' => $application->osca_id_original,
                'brgy_residency_certificate' => $application->brgy_residency_certificate,
                'brgy_indigency' => $application->brgy_indigency,
                'death_certificate' => $application->death_certificate,
                'affidavit_of_next_of_kin' => $application->affidavit_of_next_of_kin,
                'osca_certificate' => $application->osca_certificate,
                'marriage_contract' => $application->marriage_contract,
                'birth_certificate_of_children' => $application->birth_certificate_of_children,
                'valid_id_of_children' => $application->valid_id_of_children,
                'valid_id_of_claimants' => $application->valid_id_of_claimants,
                'waiver_authority_to_claim' => $application->waiver_authority_to_claim,
                'status' => $application->status,
                'status_label' => $application->status_label,
                'notes' => $application->notes,
                'reviewed_at' => $application->reviewed_at?->format('M d, Y h:i A'),
                'reviewed_by' => $application->reviewer ? [
                    'id' => $application->reviewer->id,
                    'name' => $application->reviewer->name,
                ] : null,
                'created_at' => $application->created_at->format('M d, Y h:i A'),
            ],
        ]);
    }

    /**
     * Update the application documents.
     */
    public function update(Request $request, SeniorCitizenMortuaryApplication $application)
    {
        $request->validate([
            // Documents
            'osca_id_original' => 'nullable|file|mimes:jpeg,png,jpg,pdf|max:5120',
            'brgy_residency_certificate' => 'nullable|file|mimes:jpeg,png,jpg,pdf|max:5120',
            'brgy_indigency' => 'nullable|file|mimes:jpeg,png,jpg,pdf|max:5120',
            'death_certificate' => 'nullable|file|mimes:jpeg,png,jpg,pdf|max:5120',
            'affidavit_of_next_of_kin' => 'nullable|file|mimes:jpeg,png,jpg,pdf|max:5120',
            'osca_certificate' => 'nullable|file|mimes:jpeg,png,jpg,pdf|max:5120',
            'marriage_contract' => 'nullable|file|mimes:jpeg,png,jpg,pdf|max:5120',
            'birth_certificate_of_children' => 'nullable|file|mimes:jpeg,png,jpg,pdf|max:5120',
            'valid_id_of_children' => 'nullable|file|mimes:jpeg,png,jpg,pdf|max:5120',
            'valid_id_of_claimants' => 'nullable|file|mimes:jpeg,png,jpg,pdf|max:5120',
            'waiver_authority_to_claim' => 'nullable|file|mimes:jpeg,png,jpg,pdf|max:5120',
            
            'status' => 'required|in:pending,under_review,approved,rejected,released',
            'notes' => 'nullable|string|max:1000',
        ]);

        DB::beginTransaction();

        try {
            // Handle file uploads and replace old files
            $documentFields = [
                'osca_id_original',
                'brgy_residency_certificate',
                'brgy_indigency',
                'death_certificate',
                'affidavit_of_next_of_kin',
                'osca_certificate',
                'marriage_contract',
                'birth_certificate_of_children',
                'valid_id_of_children',
                'valid_id_of_claimants',
                'waiver_authority_to_claim',
            ];
            
            $updateData = ['notes' => $request->notes];
            
            foreach ($documentFields as $field) {
                if ($request->hasFile($field)) {
                    // Delete old file if exists
                    if ($application->$field) {
                        Storage::disk('public')->delete($application->$field);
                    }
                    
                    // Upload new file
                    $file = $request->file($field);
                    $filename = time() . '_' . $field . '.' . $file->getClientOriginalExtension();
                    $path = $file->storeAs('mortuary-documents/' . date('Y/m'), $filename, 'public');
                    $updateData[$field] = $path;
                }
            }

            // Handle status change with reviewer tracking
            if ($request->status !== $application->status) {
                $updateData['status'] = $request->status;
                $updateData['reviewed_by'] = auth()->id();
                $updateData['reviewed_at'] = now();
            }

            // Update the application
            $application->update($updateData);

            DB::commit();

            Log::info('Mortuary Application updated', [
                'application_id' => $application->id,
                'registration_id' => $application->senior_citizen_registration_id,
                'updated_by' => auth()->id(),
                'status_changed' => $request->status !== $application->getOriginal('status'),
            ]);

            return redirect()->route('admin.senior-citizen-mortuary-applications.show', $application->id)
                ->with('alert', "✅ Mortuary application updated successfully!");

        } catch (\Exception $e) {
            DB::rollback();

            Log::error('Mortuary Application update failed', [
                'application_id' => $application->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return back()->with('alert', "❌ Failed to update mortuary application. Please try again.")
                ->withInput();
        }
    }

    /**
     * Update the status of the application.
     */
    public function updateStatus(Request $request, SeniorCitizenMortuaryApplication $application)
    {
        $request->validate([
            'status' => 'required|in:pending,under_review,approved,rejected,released',
            'notes' => 'nullable|string|max:1000',
        ]);

        $application->update([
            'status' => $request->status,
            'notes' => $request->notes,
            'reviewed_at' => now(),
            'reviewed_by' => auth()->id(),
        ]);

        Log::info('Mortuary Application status updated', [
            'application_id' => $application->id,
            'new_status' => $request->status,
            'updated_by' => auth()->id(),
        ]);

        $message = "✅ Application status updated to: " . strtoupper($request->status);

        return back()->with('alert', $message);
    }

    /**
     * Remove the specified application.
     */
    public function destroy(SeniorCitizenMortuaryApplication $application)
    {
        // Delete associated files
        $documentFields = [
            'osca_id_original',
            'brgy_residency_certificate',
            'brgy_indigency',
            'death_certificate',
            'affidavit_of_next_of_kin',
            'osca_certificate',
            'marriage_contract',
            'birth_certificate_of_children',
            'valid_id_of_children',
            'valid_id_of_claimants',
            'waiver_authority_to_claim',
        ];

        foreach ($documentFields as $field) {
            if ($application->$field) {
                Storage::disk('public')->delete($application->$field);
            }
        }

        $application->delete();

        Log::info('Mortuary Application deleted', [
            'application_id' => $application->id,
            'deleted_by' => auth()->id(),
        ]);

        return redirect()->route('admin.senior-citizen-mortuary-applications.index')
            ->with('alert', "✅ Mortuary application deleted successfully!");
    }

    /**
     * Display the user's own mortuary applications (for senior citizens).
     */
    public function myApplications()
    {
        $user = auth()->user();
        
        // Get the user's senior citizen registration
        $registration = SeniorCitizenRegistration::where('user_id', $user->id)->first();
        
        if (!$registration) {
            return Inertia::render('my-mortuary-applications/Index', [
                'applications' => [],
                'hasRegistration' => false,
                'registration' => null,
            ]);
        }

        // Get all mortuary applications for this registration
        $applications = SeniorCitizenMortuaryApplication::where('senior_citizen_registration_id', $registration->id)
            ->latest()
            ->get()
            ->map(function ($app) {
                return [
                    'id' => $app->id,
                    'status' => $app->status,
                    'status_label' => $app->status_label,
                    'status_badge' => $app->status_badge,
                    'notes' => $app->notes,
                    'reviewed_at' => $app->reviewed_at?->format('M d, Y'),
                    'created_at' => $app->created_at->format('M d, Y'),
                    // Document status
                    'osca_id_original' => $app->osca_id_original ? true : false,
                    'brgy_residency_certificate' => $app->brgy_residency_certificate ? true : false,
                    'brgy_indigency' => $app->brgy_indigency ? true : false,
                    'death_certificate' => $app->death_certificate ? true : false,
                    'affidavit_of_next_of_kin' => $app->affidavit_of_next_of_kin ? true : false,
                    'osca_certificate' => $app->osca_certificate ? true : false,
                    'marriage_contract' => $app->marriage_contract ? true : false,
                    'birth_certificate_of_children' => $app->birth_certificate_of_children ? true : false,
                    'valid_id_of_children' => $app->valid_id_of_children ? true : false,
                    'valid_id_of_claimants' => $app->valid_id_of_claimants ? true : false,
                    'waiver_authority_to_claim' => $app->waiver_authority_to_claim ? true : false,
                ];
            });

        return Inertia::render('my-mortuary-applications/Index', [
            'applications' => $applications,
            'hasRegistration' => true,
            'registration' => [
                'id' => $registration->id,
                'registration_id' => $registration->registration_id,
                'full_name' => $registration->full_name,
            ],
        ]);
    }

    /**
     * Display a specific mortuary application for the user.
     */
    public function myApplicationShow(SeniorCitizenMortuaryApplication $application)
    {
        $user = auth()->user();
        $registration = SeniorCitizenRegistration::where('user_id', $user->id)->first();

        // Verify that this application belongs to the user
        if (!$registration || $application->senior_citizen_registration_id !== $registration->id) {
            abort(403, 'Unauthorized access to this application.');
        }

        return Inertia::render('my-mortuary-applications/Show', [
            'application' => [
                'id' => $application->id,
                'status' => $application->status,
                'status_label' => $application->status_label,
                'status_badge' => $application->status_badge,
                'notes' => $application->notes,
                'reviewed_at' => $application->reviewed_at?->format('M d, Y h:i A'),
                'created_at' => $application->created_at->format('M d, Y h:i A'),
                // All document fields
                'osca_id_original' => $application->osca_id_original,
                'brgy_residency_certificate' => $application->brgy_residency_certificate,
                'brgy_indigency' => $application->brgy_indigency,
                'death_certificate' => $application->death_certificate,
                'affidavit_of_next_of_kin' => $application->affidavit_of_next_of_kin,
                'osca_certificate' => $application->osca_certificate,
                'marriage_contract' => $application->marriage_contract,
                'birth_certificate_of_children' => $application->birth_certificate_of_children,
                'valid_id_of_children' => $application->valid_id_of_children,
                'valid_id_of_claimants' => $application->valid_id_of_claimants,
                'waiver_authority_to_claim' => $application->waiver_authority_to_claim,
            ],
            'registration' => [
                'id' => $registration->id,
                'registration_id' => $registration->registration_id,
                'full_name' => $registration->full_name,
            ],
        ]);
    }

    /**
     * Create a new mortuary application for the user.
     */
    public function myApplicationStore(Request $request)
    {
        $user = auth()->user();
        $registration = SeniorCitizenRegistration::where('user_id', $user->id)->first();

        if (!$registration) {
            return back()->with('error', '⚠️ You must have a senior citizen registration first.');
        }

        // Check if user already has a pending or under review application
        $existingApplication = SeniorCitizenMortuaryApplication::where('senior_citizen_registration_id', $registration->id)
            ->whereIn('status', ['pending', 'under_review'])
            ->first();

        if ($existingApplication) {
            return back()->with('error', '⚠️ You already have a pending mortuary application.');
        }

        // Create new application
        $application = SeniorCitizenMortuaryApplication::create([
            'senior_citizen_registration_id' => $registration->id,
            'status' => 'pending',
        ]);

        Log::info('Mortuary Application created by user', [
            'application_id' => $application->id,
            'user_id' => $user->id,
            'registration_id' => $registration->id,
        ]);

        return redirect()->route('my-mortuary-applications.show', $application->id)
            ->with('alert', '✅ Mortuary application created successfully! Please upload the required documents.');
    }

    /**
     * Upload a document to the user's mortuary application.
     */
    public function uploadDocument(Request $request, SeniorCitizenMortuaryApplication $application)
    {
        $user = auth()->user();
        $registration = SeniorCitizenRegistration::where('user_id', $user->id)->first();

        // Verify ownership
        if (!$registration || $application->senior_citizen_registration_id !== $registration->id) {
            abort(403, 'Unauthorized access to this application.');
        }

        // Validate the document field and file
        $request->validate([
            'document_field' => 'required|string|in:osca_id_original,brgy_residency_certificate,brgy_indigency,death_certificate,affidavit_of_next_of_kin,osca_certificate,marriage_contract,birth_certificate_of_children,valid_id_of_children,valid_id_of_claimants,waiver_authority_to_claim',
            'file' => 'required|file|mimes:pdf,jpg,jpeg,png|max:5120', // 5MB max
        ]);

        $field = $request->document_field;

        // Delete old file if exists
        if ($application->$field) {
            Storage::disk('public')->delete($application->$field);
        }

        // Store new file
        $path = $request->file('file')->store('mortuary-applications', 'public');

        // Update application
        $application->update([
            $field => $path,
        ]);

        Log::info('Document uploaded to mortuary application', [
            'application_id' => $application->id,
            'user_id' => $user->id,
            'field' => $field,
        ]);

        return back()->with('alert', '✅ Document uploaded successfully!');
    }
}

