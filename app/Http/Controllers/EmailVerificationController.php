<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class EmailVerificationController extends Controller
{
    /**
     * Handle email verification and password setup.
     */
    public function verifyAndLogin(Request $request)
    {
        $token = $request->get('token');
        
        if (!$token) {
            return redirect('/login')->with('error', 'Invalid verification link.');
        }

        // Find user by verification token
        $user = User::where('email_verification_token', $token)
            ->whereNull('email_verified_at')
            ->where('email_verification_sent_at', '>=', now()->subDay())
            ->first();

        if (!$user) {
            return redirect('/login')->with('error', 'Invalid or expired verification link.');
        }

        // If this is a GET request, show the password setup form
        if ($request->isMethod('get')) {
            return Inertia::render('auth/set-password', [
                'token' => $token,
                'email' => $user->email,
                'name' => $user->name,
            ]);
        }

        // Handle POST request - password setup
        $request->validate([
            'password' => 'required|string|min:8|confirmed',
            'token' => 'required|string',
        ]);

        // Verify token again
        if ($request->token !== $token) {
            return back()->withErrors(['token' => 'Invalid verification token.']);
        }

        // Update user password and verify email
        $user->update([
            'password' => Hash::make($request->password),
            'email_verified_at' => now(),
            'email_verification_token' => null,
            'email_verification_sent_at' => null,
        ]);

        // Log the user in
        Auth::login($user);

        return redirect('/dashboard')->with('success', 'Welcome! Your account has been verified and you are now logged in.');
    }
}
