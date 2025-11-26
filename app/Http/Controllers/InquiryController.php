<?php

namespace App\Http\Controllers;

use App\Models\Inquiry;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;
use Inertia\Inertia;

class InquiryController extends Controller
{
    /**
     * Display a listing of inquiries (Admin).
     */
    public function index(Request $request)
    {
        $perPage = $request->get('per_page', 15);
        
        // Get all inquiries with pagination
        $inquiries = Inquiry::orderBy('submitted_at', 'desc')
            ->paginate($perPage);
        
        // Calculate statistics
        $stats = [
            'total' => Inquiry::count(),
            'today' => Inquiry::whereDate('submitted_at', Carbon::today('Asia/Manila'))->count(),
            'this_week' => Inquiry::whereBetween('submitted_at', [
                Carbon::now('Asia/Manila')->startOfWeek(),
                Carbon::now('Asia/Manila')->endOfWeek()
            ])->count(),
            'this_month' => Inquiry::whereMonth('submitted_at', Carbon::now('Asia/Manila')->month)
                ->whereYear('submitted_at', Carbon::now('Asia/Manila')->year)
                ->count(),
        ];
        
        return Inertia::render('admin/inquiries/Index', [
            'inquiries' => $inquiries,
            'stats' => $stats,
        ]);
    }

    /**
     * Store a new inquiry from the contact form.
     * Limit: Once per day per IP address.
     */
    public function store(Request $request)
    {
        // Validate input
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'message' => 'required|string|max:5000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Please fill in all fields correctly.',
                'errors' => $validator->errors()
            ], 422);
        }

        // Get user's IP address
        $ipAddress = $request->ip();

        // Check if this IP has already submitted today
        $today = Carbon::today('Asia/Manila');
        $existingInquiry = Inquiry::where('ip_address', $ipAddress)
            ->whereDate('submitted_at', $today)
            ->first();

        if ($existingInquiry) {
            return response()->json([
                'success' => false,
                'message' => 'You have already submitted an inquiry today. Please try again tomorrow.',
                'can_submit' => false,
            ], 429); // 429 Too Many Requests
        }

        // Create the inquiry
        $inquiry = Inquiry::create([
            'name' => $request->name,
            'email' => $request->email,
            'message' => $request->message,
            'ip_address' => $ipAddress,
            'submitted_at' => now('Asia/Manila'),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Thank you for your inquiry! We will get back to you soon.',
            'inquiry' => $inquiry,
        ], 201);
    }

    /**
     * Check if the current IP address can submit an inquiry today.
     */
    public function checkToday(Request $request)
    {
        $ipAddress = $request->ip();
        $today = Carbon::today('Asia/Manila');

        $existingInquiry = Inquiry::where('ip_address', $ipAddress)
            ->whereDate('submitted_at', $today)
            ->first();

        return response()->json([
            'can_submit' => !$existingInquiry,
            'message' => $existingInquiry 
                ? 'You have already submitted an inquiry today.' 
                : 'You can submit an inquiry.',
        ]);
    }
}
