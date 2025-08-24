<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class SeniorCitizenController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            // Personal Information
            'last_name' => 'required|string|max:255',
            'first_name' => 'required|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'suffix' => 'nullable|string|max:10',
            'date_of_birth' => 'required|date|before:today',
            'place_of_birth' => 'nullable|string|max:255',
            'gender' => 'required|in:Male,Female',
            'civil_status' => 'required|in:Single,Married,Widowed,Divorced,Separated',
            
            // Contact Information
            'contact_number' => 'required|string|max:20',
            'email' => 'nullable|email|max:255',
            
            // Address Information
            'house_number' => 'required|string|max:50',
            'street' => 'required|string|max:255',
            'barangay' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'province' => 'required|string|max:255',
            'zip_code' => 'required|string|max:10',
            
            // Emergency Contact
            'emergency_contact_name' => 'required|string|max:255',
            'emergency_contact_relationship' => 'required|string|max:50',
            'emergency_contact_number' => 'required|string|max:20',
            'emergency_contact_address' => 'nullable|string|max:500',
            
            // Health Information
            'has_medical_conditions' => 'boolean',
            'medical_conditions' => 'nullable|string|max:1000',
            'current_medications' => 'nullable|string|max:1000',
            'allergies' => 'nullable|string|max:500',
            
            // Documents
            'valid_id_front' => 'required|file|mimes:jpeg,png,jpg,pdf|max:5120', // 5MB
            'valid_id_back' => 'required|file|mimes:jpeg,png,jpg,pdf|max:5120',
            'birth_certificate' => 'nullable|file|mimes:jpeg,png,jpg,pdf|max:5120',
            'proof_of_residency' => 'nullable|file|mimes:jpeg,png,jpg,pdf|max:5120',
            
            // Agreements
            'data_privacy_consent' => 'required|boolean|accepted',
            'terms_conditions' => 'required|boolean|accepted',
        ]);

        // Handle file uploads
        $documentPaths = [];
        $documentFields = ['valid_id_front', 'valid_id_back', 'birth_certificate', 'proof_of_residency'];
        
        foreach ($documentFields as $field) {
            if ($request->hasFile($field)) {
                $file = $request->file($field);
                $path = $file->store('senior-citizen-documents/' . date('Y/m'), 'public');
                $documentPaths[$field] = $path;
            }
        }

        // TODO: Save to database
        // For now, we'll just return a success response
        
        return redirect()->back()->with('success', 'Senior Citizen registration submitted successfully! We will review your application and contact you soon.');
    }
}
