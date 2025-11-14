<?php

namespace App\Http\Controllers;

use App\Models\SeniorCitizenRegistration;
use App\Models\SeniorCitizenMortuaryApplication;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use App\Mail\SeniorCitizenApprovedMail;
use App\Models\User;
use App\Mail\SeniorCitizenWelcomeMail;
use Illuminate\Support\Str;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Schema;
use Barryvdh\DomPDF\Facade\Pdf;

class SeniorCitizenController extends Controller
{
    /**
     * Show the senior citizen registration form.
     */
    public function create()
    {
        return Inertia::render('website/SeniorCitizenRegistration');
    }

    /**
     * Store the senior citizen registration.
     */
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

        DB::beginTransaction();

        try {
            // Handle file uploads
            $documentPaths = [];
            $documentFields = ['valid_id_front', 'valid_id_back', 'birth_certificate', 'proof_of_residency'];
            
            foreach ($documentFields as $field) {
                if ($request->hasFile($field)) {
                    $file = $request->file($field);
                    $filename = time() . '_' . $field . '.' . $file->getClientOriginalExtension();
                    $path = $file->storeAs('senior-citizen-documents/' . date('Y/m'), $filename, 'public');
                    $documentPaths[$field] = $path;
                }
            }

            // Create the registration record
            $registration = SeniorCitizenRegistration::create([
                // Personal Information
                'last_name' => $request->last_name,
                'first_name' => $request->first_name,
                'middle_name' => $request->middle_name,
                'suffix' => $request->suffix,
                'date_of_birth' => $request->date_of_birth,
                'place_of_birth' => $request->place_of_birth,
                'gender' => $request->gender,
                'civil_status' => $request->civil_status,
                
                // Contact Information
                'contact_number' => $request->contact_number,
                'email' => $request->email,
                
                // Address Information
                'house_number' => $request->house_number,
                'street' => $request->street,
                'barangay' => $request->barangay,
                'city' => $request->city,
                'province' => $request->province,
                'zip_code' => $request->zip_code,
                
                // Emergency Contact
                'emergency_contact_name' => $request->emergency_contact_name,
                'emergency_contact_relationship' => $request->emergency_contact_relationship,
                'emergency_contact_number' => $request->emergency_contact_number,
                'emergency_contact_address' => $request->emergency_contact_address,
                
                // Health Information
                'has_medical_conditions' => $request->boolean('has_medical_conditions'),
                'medical_conditions' => $request->medical_conditions,
                'current_medications' => $request->current_medications,
                'allergies' => $request->allergies,
                
                // Documents
                'valid_id_front' => $documentPaths['valid_id_front'] ?? null,
                'valid_id_back' => $documentPaths['valid_id_back'] ?? null,
                'birth_certificate' => $documentPaths['birth_certificate'] ?? null,
                'proof_of_residency' => $documentPaths['proof_of_residency'] ?? null,
                
                // Agreements
                'data_privacy_consent' => $request->boolean('data_privacy_consent'),
                'terms_conditions' => $request->boolean('terms_conditions'),
                
                // Status and User Link
                'status' => 'pending',
                'user_id' => null, // Will be set when approved
            ]);

            DB::commit();

            Log::info('Senior Citizen Registration submitted successfully', [
                'registration_id' => $registration->registration_id,
                'id' => $registration->id,
                'name' => $registration->full_name,
                'email' => $registration->email,
                'contact_number' => $registration->contact_number,
            ]);

            // Redirect to confirmation page instead of SweetAlert
            return redirect()->route('senior-citizen.confirmation', $registration->registration_id)->with([
                'success' => true,
                'message' => 'Registration submitted successfully!',
                'swal' => $this->buildSwal(
                    'success',
                    'Registration Submitted',
                    'Your application has been received and is now pending review.'
                ),
            ]);

        } catch (\Exception $e) {
            DB::rollback();

            // Clean up uploaded files if database save failed
            foreach ($documentPaths as $path) {
                Storage::disk('public')->delete($path);
            }

            Log::error('Senior Citizen Registration failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'request_data' => $request->except(['valid_id_front', 'valid_id_back', 'birth_certificate', 'proof_of_residency'])
            ]);

            return back()->with([
                'error' => true,
                'swal' => $this->buildSwal(
                    'error',
                    'Registration Failed',
                    'An error occurred. Please try again or contact support.'
                ),
            ])->withInput();
        }
    }

    /**
     * Show registration confirmation page.
     */
    public function confirmation(string $registrationId)
    {
        $registration = SeniorCitizenRegistration::where('registration_id', $registrationId)->firstOrFail();

        return Inertia::render('website/SeniorCitizenConfirmation', [
            'registration' => $registration
        ]);
    }

    /**
     * Check registration status by ID.
     */
    public function checkStatus(Request $request)
    {
        // Support both POST (body) and GET (route param)
        $registrationId = $request->input('registration_id') ?? $request->route('registrationId');

        if (!$registrationId) {
            return response()->json([
                'success' => false,
                'message' => 'Registration ID is required.'
            ], 422);
        }

        // Validate existence (silent fail if not found)
        $registration = SeniorCitizenRegistration::where('registration_id', $registrationId)->first();

        if (!$registration) {
            return response()->json([
                'success' => false,
                'message' => 'Registration ID not found.'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'registration' => [
                'id' => $registration->registration_id,
                'name' => $registration->full_name,
                'status' => $registration->status,
                'status_label' => $registration->status_label,
                'submitted_at' => $registration->created_at->format('M d, Y g:i A'),
                'reviewed_at' => $registration->reviewed_at?->format('M d, Y g:i A'),
                'notes' => $registration->notes,
            ]
        ]);
    }

    /**
     * Show all registrations (for admin).
     */
    public function index(Request $request)
    {
        $query = SeniorCitizenRegistration::query();

        // Search functionality
        if ($search = $request->get('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('registration_id', 'like', "%{$search}%")
                  ->orWhere('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhereRaw("CONCAT(first_name, ' ', last_name) like ?", ["%{$search}%"]);
            });
        }

        // Status filter
        if ($status = $request->get('status')) {
            $query->where('status', $status);
        }

        // Barangay filter
        if ($barangay = $request->get('barangay')) {
            $query->where('barangay', $barangay);
        }

        // Get registrations with pagination
        $registrations = $query->latest()
            ->paginate(15)
            ->withQueryString()
            ->through(fn ($registration) => [
                'id' => $registration->id,
                'registration_id' => $registration->registration_id,
                'full_name' => $registration->full_name,
                'email' => $registration->email,
                'contact_number' => $registration->contact_number,
                'age' => $registration->age,
                'gender' => $registration->gender,
                'barangay' => $registration->barangay,
                'status' => $registration->status,
                'status_label' => $registration->status_label,
                'status_badge' => $registration->status_badge,
                'created_at' => $registration->created_at->toISOString(),
                'reviewed_at' => $registration->reviewed_at?->toISOString(),
            ]);

        // Get unique barangays for filter dropdown
        $barangays = SeniorCitizenRegistration::distinct()
            ->pluck('barangay')
            ->filter()
            ->sort()
            ->values();

        // Get statistics
        $stats = [
            'total' => SeniorCitizenRegistration::count(),
            'pending' => SeniorCitizenRegistration::where('status', 'pending')->count(),
            'under_review' => SeniorCitizenRegistration::where('status', 'under_review')->count(),
            'approved' => SeniorCitizenRegistration::where('status', 'approved')->count(),
            'rejected' => SeniorCitizenRegistration::where('status', 'rejected')->count(),
        ];

        return Inertia::render('admin/SeniorCitizenRegistrations/Index', [
            'registrations' => $registrations,
            'filters' => $request->only(['search', 'status', 'barangay']),
            'barangays' => $barangays,
            'stats' => $stats,
        ]);
    }

    /**
     * Show a specific registration (for admin).
     */
    public function show(SeniorCitizenRegistration $registration)
    {
        // Load the reviewer relationship
        $registration->load('reviewer');
        
        // Format the registration data for the frontend
        $formattedRegistration = [
            'id' => $registration->id,
            'registration_id' => $registration->registration_id,
            'status' => $registration->status,
            'status_label' => $registration->status_label,
            
            // Personal Information
            'first_name' => $registration->first_name,
            'middle_name' => $registration->middle_name,
            'last_name' => $registration->last_name,
            'suffix' => $registration->suffix,
            'full_name' => $registration->full_name,
            'date_of_birth' => $registration->date_of_birth->toISOString(),
            'place_of_birth' => $registration->place_of_birth,
            'gender' => $registration->gender,
            'civil_status' => $registration->civil_status,
            'age' => $registration->age,
            
            // Contact Information
            'contact_number' => $registration->contact_number,
            'email' => $registration->email,
            
            // Address Information
            'house_number' => $registration->house_number,
            'street' => $registration->street,
            'barangay' => $registration->barangay,
            'city' => $registration->city,
            'province' => $registration->province,
            'zip_code' => $registration->zip_code,
            'full_address' => $registration->full_address,
            
            // Emergency Contact
            'emergency_contact_name' => $registration->emergency_contact_name,
            'emergency_contact_relationship' => $registration->emergency_contact_relationship,
            'emergency_contact_number' => $registration->emergency_contact_number,
            'emergency_contact_address' => $registration->emergency_contact_address,
            
            // Health Information
            'has_medical_conditions' => $registration->has_medical_conditions,
            'medical_conditions' => $registration->medical_conditions,
            'current_medications' => $registration->current_medications,
            'allergies' => $registration->allergies,
            
            // Documents
            'valid_id_front' => $registration->valid_id_front,
            'valid_id_back' => $registration->valid_id_back,
            'birth_certificate' => $registration->birth_certificate,
            'proof_of_residency' => $registration->proof_of_residency,
            
            // Agreements
            'data_privacy_consent' => $registration->data_privacy_consent,
            'terms_conditions' => $registration->terms_conditions,
            
            // Review Information
            'notes' => $registration->notes,
            'reviewed_at' => $registration->reviewed_at?->toISOString(),
            'reviewed_by' => $registration->reviewer ? [
                'id' => $registration->reviewer->id,
                'name' => $registration->reviewer->name,
            ] : null,
            
            // Timestamps
            'created_at' => $registration->created_at->toISOString(),
            'updated_at' => $registration->updated_at->toISOString(),
        ];

        return Inertia::render('admin/SeniorCitizenRegistrations/Show', [
            'registration' => $formattedRegistration
        ]);
    }

    /**
     * Show the form for editing a registration.
     */
    public function edit(SeniorCitizenRegistration $registration)
    {
        // Load relationships
        $registration->load('reviewer');
        
        // Format the registration data for the frontend (same as show)
        $formattedRegistration = [
            'id' => $registration->id,
            'registration_id' => $registration->registration_id,
            'status' => $registration->status,
            'status_label' => $registration->status_label,
            
            // Personal Information
            'first_name' => $registration->first_name,
            'middle_name' => $registration->middle_name,
            'last_name' => $registration->last_name,
            'suffix' => $registration->suffix,
            'full_name' => $registration->full_name,
            'date_of_birth' => $registration->date_of_birth->format('Y-m-d'),
            'place_of_birth' => $registration->place_of_birth,
            'gender' => $registration->gender,
            'civil_status' => $registration->civil_status,
            'age' => $registration->age,
            
            // Contact Information
            'contact_number' => $registration->contact_number,
            'email' => $registration->email,
            
            // Address Information
            'house_number' => $registration->house_number,
            'street' => $registration->street,
            'barangay' => $registration->barangay,
            'city' => $registration->city,
            'province' => $registration->province,
            'zip_code' => $registration->zip_code,
            'full_address' => $registration->full_address,
            
            // Emergency Contact
            'emergency_contact_name' => $registration->emergency_contact_name,
            'emergency_contact_relationship' => $registration->emergency_contact_relationship,
            'emergency_contact_number' => $registration->emergency_contact_number,
            'emergency_contact_address' => $registration->emergency_contact_address,
            
            // Health Information
            'has_medical_conditions' => $registration->has_medical_conditions,
            'medical_conditions' => $registration->medical_conditions,
            'current_medications' => $registration->current_medications,
            'allergies' => $registration->allergies,
            
            // Documents (file paths)
            'valid_id_front' => $registration->valid_id_front,
            'valid_id_back' => $registration->valid_id_back,
            'birth_certificate' => $registration->birth_certificate,
            'proof_of_residency' => $registration->proof_of_residency,
            
            // Agreements
            'data_privacy_consent' => $registration->data_privacy_consent,
            'terms_conditions' => $registration->terms_conditions,
            
            // Review Information
            'notes' => $registration->notes,
            'reviewed_at' => $registration->reviewed_at?->toISOString(),
            'reviewed_by' => $registration->reviewer ? [
                'id' => $registration->reviewer->id,
                'name' => $registration->reviewer->name,
            ] : null,
            
            // Timestamps
            'created_at' => $registration->created_at->toISOString(),
            'updated_at' => $registration->updated_at->toISOString(),
        ];

        return Inertia::render('admin/SeniorCitizenRegistrations/Edit', [
            'registration' => $formattedRegistration
        ]);
    }

    /**
     * Update the full registration data (from Edit page).
     */
    public function updateRegistration(Request $request, SeniorCitizenRegistration $registration)
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
            
            // Documents (optional - only if replacing)
            'valid_id_front' => 'nullable|file|mimes:jpeg,png,jpg,pdf|max:5120',
            'valid_id_back' => 'nullable|file|mimes:jpeg,png,jpg,pdf|max:5120',
            'birth_certificate' => 'nullable|file|mimes:jpeg,png,jpg,pdf|max:5120',
            'proof_of_residency' => 'nullable|file|mimes:jpeg,png,jpg,pdf|max:5120',
        ]);

        DB::beginTransaction();

        try {
            // Handle file uploads and replace old files
            $documentFields = ['valid_id_front', 'valid_id_back', 'birth_certificate', 'proof_of_residency'];
            $updateData = [];
            
            foreach ($documentFields as $field) {
                if ($request->hasFile($field)) {
                    // Delete old file if exists
                    if ($registration->$field) {
                        Storage::disk('public')->delete($registration->$field);
                    }
                    
                    // Upload new file
                    $file = $request->file($field);
                    $filename = time() . '_' . $field . '.' . $file->getClientOriginalExtension();
                    $path = $file->storeAs('senior-citizens/' . date('Y/m'), $filename, 'public');
                    $updateData[$field] = $path;
                }
            }

            // Update all fields
            $registration->update(array_merge([
                // Personal Information
                'last_name' => $request->last_name,
                'first_name' => $request->first_name,
                'middle_name' => $request->middle_name,
                'suffix' => $request->suffix,
                'date_of_birth' => $request->date_of_birth,
                'place_of_birth' => $request->place_of_birth,
                'gender' => $request->gender,
                'civil_status' => $request->civil_status,
                
                // Contact Information
                'contact_number' => $request->contact_number,
                'email' => $request->email,
                
                // Address Information
                'house_number' => $request->house_number,
                'street' => $request->street,
                'barangay' => $request->barangay,
                'city' => $request->city,
                'province' => $request->province,
                'zip_code' => $request->zip_code,
                
                // Emergency Contact
                'emergency_contact_name' => $request->emergency_contact_name,
                'emergency_contact_relationship' => $request->emergency_contact_relationship,
                'emergency_contact_number' => $request->emergency_contact_number,
                'emergency_contact_address' => $request->emergency_contact_address,
                
                // Health Information
                'has_medical_conditions' => $request->boolean('has_medical_conditions'),
                'medical_conditions' => $request->medical_conditions,
                'current_medications' => $request->current_medications,
                'allergies' => $request->allergies,
            ], $updateData));

            DB::commit();

            Log::info('Senior Citizen Registration updated', [
                'registration_id' => $registration->registration_id,
                'updated_by' => auth()->id(),
            ]);

            return redirect()->route('admin.senior-citizen-registrations.show', $registration->id)
                ->with('alert', "✅ Registration updated successfully!");

        } catch (\Exception $e) {
            DB::rollback();

            Log::error('Senior Citizen Registration update failed', [
                'registration_id' => $registration->registration_id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return back()->with('alert', "❌ Failed to update registration. Please try again.")
                ->withInput();
        }
    }

    /**
     * Update registration status and notes.
     */
    public function update(Request $request, SeniorCitizenRegistration $registration)
    {
        try {
            $request->validate([
                'status' => 'required|string|in:pending,under_review,approved,rejected',
                'notes' => 'nullable|string|max:1000',
            ]);

            if ($request->status === $registration->status && $request->notes === $registration->notes) {
                $msg = 'No changes detected. Status already ' . $registration->status . '.';
                return back()->with([
                    'success' => true,
                    'message' => $msg,
                    'swal' => $this->buildSwal('info', 'No Update', $msg),
                ]);
            }

            $creationResult = null;

            DB::transaction(function () use ($request, $registration, &$creationResult) {
                $locked = SeniorCitizenRegistration::query()
                    ->whereKey($registration->getKey())
                    ->lockForUpdate()
                    ->firstOrFail();

                $oldStatus = $locked->status;
                $newStatus = $request->status;

                $locked->status = $newStatus;
                $locked->notes = $request->notes;
                $locked->reviewed_at = now();
                $locked->reviewed_by = auth()->id();
                $locked->save();

                if ($oldStatus !== 'approved' && $newStatus === 'approved') {
                    if (!$locked->user_id) {
                        $creationResult = $this->createUserAccountAndNotify($locked);
                    } else {
                        $creationResult = [
                            'user_created' => false,
                            'existing_user' => true,
                            'user_id' => $locked->user_id,
                            'error' => null,
                            'skipped' => 'User already linked'
                        ];
                        Log::info('Skipped user creation (already linked)', [
                            'registration_id' => $locked->registration_id,
                            'user_id' => $locked->user_id,
                        ]);
                        $this->sendApprovalNotification($locked);
                    }

                    // Auto-create mortuary application if not already created
                    if (!$locked->mortuaryApplication) {
                        try {
                            $mortuaryApplication = SeniorCitizenMortuaryApplication::create([
                                'senior_citizen_registration_id' => $locked->id,
                                'status' => 'pending',
                            ]);

                            Log::info('Mortuary Application auto-created on approval', [
                                'registration_id' => $locked->registration_id,
                                'mortuary_application_id' => $mortuaryApplication->id,
                            ]);
                        } catch (\Exception $e) {
                            Log::error('Failed to auto-create mortuary application', [
                                'registration_id' => $locked->registration_id,
                                'error' => $e->getMessage(),
                            ]);
                        }
                    }
                }

                Log::info('Registration status updated', [
                    'registration_id' => $locked->registration_id,
                    'old_status' => $oldStatus,
                    'new_status' => $newStatus,
                    'updated_by' => auth()->user()->id,
                ]);

                $registration->setRawAttributes($locked->getAttributes(), true);
            });

            $successText = 'Registration status updated successfully.';
            if ($creationResult) {
                if ($creationResult['existing_user']) {
                    $successText .= ' Existing user linked.';
                } elseif ($creationResult['user_created']) {
                    $successText .= ' User account created and welcome email sent.';
                } else {
                    $successText .= ' (User account not created: ' . ($creationResult['error'] ?? ($creationResult['skipped'] ?? 'Unknown issue')) . ')';
                }
            }

            return back()->with([
                'success' => true,
                'message' => $successText,
                'swal' => $this->buildSwal(
                    $creationResult && !$creationResult['user_created'] && !$creationResult['existing_user'] ? 'warning' : 'success',
                    'Status Updated',
                    $successText
                ),
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return back()
                ->withErrors($e->errors())
                ->with([
                    'error' => true,
                    'message' => 'Validation failed.',
                    'swal' => $this->buildSwal(
                        'error',
                        'Validation Error',
                        implode(', ', $e->validator->errors()->all())
                    ),
                ]);
        } catch (\Exception $e) {
            Log::error('Failed to update Senior Citizen Registration status', [
                'registration_id' => $registration->registration_id ?? null,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return back()->with([
                'error' => true,
                'message' => 'Failed to update registration status. Please try again.',
                'swal' => $this->buildSwal(
                    'error',
                    'Update Failed',
                    'Could not update status. Please retry.'
                ),
            ]);
        }
    }

    /**
     * Build a SweetAlert payload.
     */
    private function buildSwal(string $icon, string $title, string $text): array
    {
        return [
            'icon' => $icon,
            'title' => $title,
            'text' => $text,
        ];
    }

    /**
     * Create user account and send welcome notification.
     * Returns array: [
     *   user_created (bool),
     *   existing_user (bool),
     *   user_id (int|null),
     *   error (string|null)
     * ]
     */
    private function createUserAccountAndNotify(SeniorCitizenRegistration $registration): array
    {
        // Idempotency guard: if already linked, return early
        if ($registration->user_id) {
            Log::info('createUserAccountAndNotify skipped (already linked)', [
                'registration_id' => $registration->registration_id,
                'user_id' => $registration->user_id,
            ]);
            return [
                'user_created' => false,
                'existing_user' => true,
                'user_id' => $registration->user_id,
                'error' => null,
                'skipped' => 'Already linked'
            ];
        }

        try {
            if (!$registration->email) {
                Log::warning('Approval user creation skipped - no email', [
                    'registration_id' => $registration->registration_id,
                ]);
                return [
                    'user_created' => false,
                    'existing_user' => false,
                    'user_id' => null,
                    'error' => 'No email provided'
                ];
            }

            // Existing user?
            $existingUser = User::where('email', $registration->email)->first();
            if ($existingUser) {
                // Link only if column exists
                $canLink = Schema::hasColumn('senior_citizen_registrations', 'user_id');
                if ($canLink) {
                    $registration->user_id = $existingUser->id;
                    $registration->save();
                } else {
                    Log::warning('Cannot link user_id - column missing on senior_citizen_registrations', [
                        'registration_id' => $registration->registration_id,
                        'user_id' => $existingUser->id,
                    ]);
                }

                $this->sendApprovalNotification($registration);

                Log::info('Linked existing user to registration', [
                    'registration_id' => $registration->registration_id,
                    'user_id' => $existingUser->id,
                    'email' => $registration->email,
                ]);

                return [
                    'user_created' => false,
                    'existing_user' => true,
                    'user_id' => $existingUser->id,
                    'error' => null
                ];
            }

            // Determine available columns on users table
            $hasTokenCol = Schema::hasColumn('users', 'email_verification_token');
            $hasTokenSentCol = Schema::hasColumn('users', 'email_verification_sent_at');
            $hasMfaEnabled = Schema::hasColumn('users', 'mfa_enabled');

            $loginToken = $hasTokenCol ? Str::random(64) : null;

            // Build attributes safely
            $attrs = [
                'name' => $registration->full_name,
                'email' => $registration->email,
                'password' => bcrypt(Str::random(32)),
                'email_verified_at' => null,
            ];
            if ($hasTokenCol) {
                $attrs['email_verification_token'] = $loginToken;
            }
            if ($hasTokenSentCol) {
                $attrs['email_verification_sent_at'] = now();
            }
            if ($hasMfaEnabled) {
                $attrs['mfa_enabled'] = false;
            }

            // Use forceFill to bypass fillable issues
            $user = (new User())->forceFill($attrs);
            $user->save();

            if (!$user->id) {
                Log::error('User creation failed (no ID returned)', [
                    'registration_id' => $registration->registration_id,
                    'email' => $registration->email,
                ]);
                return [
                    'user_created' => false,
                    'existing_user' => false,
                    'user_id' => null,
                    'error' => 'User model not persisted'
                ];
            }

            // Assign Senior Citizen role
            $seniorCitizenRole = Role::firstOrCreate(['name' => 'Senior Citizen']);
            $user->assignRole($seniorCitizenRole);

            // Link user only if column exists
            $canLink = Schema::hasColumn('senior_citizen_registrations', 'user_id');
            if ($canLink) {
                $registration->user_id = $user->id;
                $registration->save();
            } else {
                Log::warning('Cannot link user_id - column missing on senior_citizen_registrations', [
                    'registration_id' => $registration->registration_id,
                    'user_id' => $user->id,
                ]);
            }

            // Send email: welcome if token columns exist, otherwise approval email
            if ($loginToken && $hasTokenCol) {
                Mail::to($registration->email)->send(
                    new SeniorCitizenWelcomeMail($user, $registration, $loginToken)
                );
            } else {
                Log::info('Token columns missing on users; sending approval email instead of welcome', [
                    'registration_id' => $registration->registration_id,
                ]);
                $this->sendApprovalNotification($registration);
            }

            Log::info('Senior Citizen user account created', [
                'registration_id' => $registration->registration_id,
                'user_id' => $user->id,
                'email' => $registration->email,
            ]);

            return [
                'user_created' => true,
                
                'existing_user' => false,
                'user_id' => $user->id,
                'error' => null
            ];
        } catch (\Exception $e) {
            Log::error('Failed creating/linking user on approval', [
                'registration_id' => $registration->registration_id,
                'email' => $registration->email,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return [
                'user_created' => false,
                'existing_user' => false,
                'user_id' => null,
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Send approval notification email.
     */
    private function sendApprovalNotification(SeniorCitizenRegistration $registration): void
    {
        try {
            if ($registration->email) {
                Mail::to($registration->email)->send(new SeniorCitizenApprovedMail($registration));
                
                Log::info('Senior Citizen Registration approval email sent', [
                    'registration_id' => $registration->registration_id,
                    'email' => $registration->email,
                    'name' => $registration->full_name,
                ]);
            } else {
                Log::warning('Cannot send approval email - no email address provided', [
                    'registration_id' => $registration->registration_id,
                    'name' => $registration->full_name,
                ]);
            }
        } catch (\Exception $e) {
            Log::error('Failed to send approval email', [
                'registration_id' => $registration->registration_id,
                'email' => $registration->email,
                'error' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Download registration form as PDF.
     */
    public function downloadForm(SeniorCitizenRegistration $registration)
    {
        try {
            $pdf = Pdf::loadView('pdf.senior-citizen-registration-form', [
                'registration' => $registration
            ]);

            // Set paper size to Letter and orientation to portrait
            $pdf->setPaper('letter', 'portrait');

            $filename = 'senior-citizen-registration-form-' . $registration->registration_id . '.pdf';
            
            // Stream the PDF to open in new tab instead of downloading
            return $pdf->stream($filename);
        } catch (\Exception $e) {
            Log::error('PDF Generation Error: ' . $e->getMessage());
            return back()->with('error', 'Failed to generate PDF: ' . $e->getMessage());
        }
    }

    /**
     * Display the authenticated user's senior citizen registration.
     */
    public function myRegistration()
    {
        $user = auth()->user();
        
        // Get the user's senior citizen registration
        $registration = SeniorCitizenRegistration::where('user_id', $user->id)->first();
        
        if (!$registration) {
            return Inertia::render('my-registration/Show', [
                'registration' => null,
                'hasRegistration' => false,
            ]);
        }

        return Inertia::render('my-registration/Show', [
            'registration' => [
                'id' => $registration->id,
                'registration_id' => $registration->registration_id,
                'status' => $registration->status,
                'status_label' => ucwords(str_replace('_', ' ', $registration->status)),
                
                // Personal Information
                'last_name' => $registration->last_name,
                'first_name' => $registration->first_name,
                'middle_name' => $registration->middle_name,
                'suffix' => $registration->suffix,
                'full_name' => $registration->full_name,
                'date_of_birth' => $registration->date_of_birth->format('F d, Y'),
                'age' => $registration->date_of_birth->age,
                'place_of_birth' => $registration->place_of_birth,
                'gender' => $registration->gender,
                'civil_status' => $registration->civil_status,
                
                // Contact Information
                'contact_number' => $registration->contact_number,
                'email' => $registration->email,
                
                // Address Information
                'street_address' => $registration->street_address,
                'barangay' => $registration->barangay,
                'city' => $registration->city,
                'province' => $registration->province,
                'zip_code' => $registration->zip_code,
                'full_address' => $registration->full_address,
                
                // Additional Information
                'senior_citizen_id' => $registration->senior_citizen_id,
                'philhealth_number' => $registration->philhealth_number,
                'tin' => $registration->tin,
                'sss_gsis_number' => $registration->sss_gsis_number,
                
                // Emergency Contact
                'emergency_contact_name' => $registration->emergency_contact_name,
                'emergency_contact_relationship' => $registration->emergency_contact_relationship,
                'emergency_contact_number' => $registration->emergency_contact_number,
                'emergency_contact_address' => $registration->emergency_contact_address,
                
                // Health Information
                'health_conditions' => $registration->health_conditions,
                'medications' => $registration->medications,
                'mobility_status' => $registration->mobility_status,
                
                // Documents
                'photo' => $registration->photo,
                'valid_id_front' => $registration->valid_id_front,
                'valid_id_back' => $registration->valid_id_back,
                'proof_of_residency' => $registration->proof_of_residency,
                'birth_certificate' => $registration->birth_certificate,
                
                // Timestamps
                'created_at' => $registration->created_at->format('F d, Y h:i A'),
                'updated_at' => $registration->updated_at->format('F d, Y h:i A'),
            ],
            'hasRegistration' => true,
        ]);
    }
}
