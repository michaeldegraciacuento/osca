<?php

namespace App\Http\Controllers;

use App\Models\SeniorCitizenFeedback;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class FeedbackController extends Controller
{
    /**
     * Display a listing of all feedback (Admin only).
     */
    public function index(): Response
    {
        $feedback = SeniorCitizenFeedback::with('user')
            ->latest()
            ->paginate(20);

        // Calculate statistics
        $stats = [
            'total' => SeniorCitizenFeedback::count(),
            'today' => SeniorCitizenFeedback::whereDate('created_at', today())->count(),
            'this_week' => SeniorCitizenFeedback::whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()])->count(),
            'this_month' => SeniorCitizenFeedback::whereMonth('created_at', now()->month)->whereYear('created_at', now()->year)->count(),
            'average_rating' => round(SeniorCitizenFeedback::avg('rating'), 1),
            'by_category' => SeniorCitizenFeedback::selectRaw('category, COUNT(*) as count')
                ->groupBy('category')
                ->pluck('count', 'category')
                ->toArray(),
            'by_rating' => SeniorCitizenFeedback::selectRaw('rating, COUNT(*) as count')
                ->groupBy('rating')
                ->orderBy('rating', 'desc')
                ->pluck('count', 'rating')
                ->toArray(),
        ];

        return Inertia::render('feedback/Index', [
            'feedback' => $feedback,
            'stats' => $stats,
        ]);
    }

    /**
     * Store a newly created feedback.
     */
    public function store(Request $request)
    {
        $user = Auth::user();

        // Check if user already submitted feedback today
        $todayFeedback = SeniorCitizenFeedback::where('user_id', $user->id)
            ->whereDate('created_at', today())
            ->exists();

        if ($todayFeedback) {
            return back()->with('error', 'You have already submitted feedback today. Please try again tomorrow.');
        }

        $validated = $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'category' => 'required|string|in:Service Quality,Staff Assistance,Process,Facilities,Other',
            'message' => 'required|string|max:500',
        ]);

        SeniorCitizenFeedback::create([
            'user_id' => $user->id,
            'rating' => $validated['rating'],
            'category' => $validated['category'],
            'message' => $validated['message'],
        ]);

        return back()->with('success', 'Thank you for your feedback!');
    }

    /**
     * Check if user has submitted feedback today.
     */
    public function checkToday()
    {
        $user = Auth::user();

        $hasSubmittedToday = SeniorCitizenFeedback::where('user_id', $user->id)
            ->whereDate('created_at', today())
            ->exists();

        return response()->json([
            'has_submitted_today' => $hasSubmittedToday
        ]);
    }
}
