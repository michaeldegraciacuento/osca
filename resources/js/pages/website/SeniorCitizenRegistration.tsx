import { useState, useEffect } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Swal from 'sweetalert2';

type SeniorCitizenFormData = Record<string, any> & {
    // Personal Information
    last_name: string;
    first_name: string;
    middle_name: string;
    suffix: string;
    date_of_birth: string;
    place_of_birth: string;
    gender: string;
    civil_status: string;
    
    // Contact Information
    contact_number: string;
    email: string;
    
    // Address Information
    house_number: string;
    street: string;
    barangay: string;
    city: string;
    province: string;
    zip_code: string;
    
    // Emergency Contact
    emergency_contact_name: string;
    emergency_contact_relationship: string;
    emergency_contact_number: string;
    emergency_contact_address: string;
    
    // Health Information
    has_medical_conditions: boolean;
    medical_conditions: string;
    current_medications: string;
    allergies: string;
    
    // Documents
    valid_id_front: File | null;
    valid_id_back: File | null;
    birth_certificate: File | null;
    proof_of_residency: File | null;
    
    // Agreements
    data_privacy_consent: boolean;
    terms_conditions: boolean;
}

const steps = [
    { id: 1, name: 'Personal Information', description: 'Basic personal details' },
    { id: 2, name: 'Contact & Address', description: 'Contact and address information' },
    { id: 3, name: 'Emergency Contact', description: 'Emergency contact person' },
    { id: 4, name: 'Health Information', description: 'Medical history and conditions' },
    { id: 5, name: 'Document Upload', description: 'Required documents' },
    { id: 6, name: 'Review & Submit', description: 'Final review and submission' },
];

export default function SeniorCitizenRegistration() {
    const [currentStep, setCurrentStep] = useState(1);
    const { props } = usePage();
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm<SeniorCitizenFormData>({
        // Personal Information
        last_name: '',
        first_name: '',
        middle_name: '',
        suffix: '',
        date_of_birth: '',
        place_of_birth: '',
        gender: '',
        civil_status: '',
        
        // Contact Information
        contact_number: '',
        email: '',
        
        // Address Information
        house_number: '',
        street: '',
        barangay: '',
        city: 'Iligan City',
        province: 'Lanao del Norte',
        zip_code: '9200',
        
        // Emergency Contact
        emergency_contact_name: '',
        emergency_contact_relationship: '',
        emergency_contact_number: '',
        emergency_contact_address: '',
        
        // Health Information
        has_medical_conditions: false,
        medical_conditions: '',
        current_medications: '',
        allergies: '',
        
        // Documents
        valid_id_front: null,
        valid_id_back: null,
        birth_certificate: null,
        proof_of_residency: null,
        
        // Agreements
        data_privacy_consent: false,
        terms_conditions: false,
    });

    // Handle SweetAlert notifications
    useEffect(() => {
        if (props.swal) {
            Swal.fire(props.swal).then((result) => {
                if (result.isConfirmed && props.success) {
                    // Reset form after successful submission
                    reset();
                    setCurrentStep(1);
                    clearErrors();
                }
            });
        }
    }, [props.swal]);

    // Handle success state - reset form to step 1
    useEffect(() => {
        if (props.success) {
            setCurrentStep(1);
        }
    }, [props.success]);

    const nextStep = () => {
        if (currentStep < steps.length) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Debug: Log form data
        console.log('Submitting form data:', {
            ...data,
            valid_id_front: data.valid_id_front ? 'File present' : 'Missing',
            valid_id_back: data.valid_id_back ? 'File present' : 'Missing',
            birth_certificate: data.birth_certificate ? 'File present' : 'Missing',
            proof_of_residency: data.proof_of_residency ? 'File present' : 'Missing',
        });
        
        // Show loading alert
        Swal.fire({
            title: 'Submitting Registration...',
            text: 'Please wait while we process your application.',
            allowOutsideClick: false,
            showConfirmButton: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        post(route('senior-citizen.store'), {
            forceFormData: true, // Force multipart/form-data for file uploads
            onSuccess: (response) => {
                Swal.close();
                console.log('Success response:', response);
            },
            onError: (errors) => {
                Swal.close();
                console.error('Validation errors:', errors);
                console.error('All errors:', errors);
                
                // Show validation errors in a more readable format
                if (Object.keys(errors).length > 0) {
                    const errorList = Object.entries(errors)
                        .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
                        .join('\n');
                    alert('Registration failed with validation errors:\n\n' + errorList);
                } else {
                    alert('Registration failed. Please check all required fields and try again.');
                }
            },
            onFinish: () => {
                console.log('Request finished');
            }
        });
    };

    const handleFileUpload = (field: keyof SeniorCitizenFormData, file: File | null) => {
        setData(field as any, file);
    };

    const isStepValid = (step: number): boolean => {
        switch (step) {
            case 1:
                return !!(data.last_name && data.first_name && data.date_of_birth && data.gender && data.civil_status);
            case 2:
                return !!(data.contact_number && data.house_number && data.street && data.barangay);
            case 3:
                return !!(data.emergency_contact_name && data.emergency_contact_relationship && data.emergency_contact_number);
            case 4:
                return true; // Health information is optional
            case 5:
                return !!(data.valid_id_front && data.valid_id_back);
            case 6:
                return data.data_privacy_consent && data.terms_conditions;
            default:
                return false;
        }
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                                <input
                                    type="text"
                                    value={data.last_name}
                                    onChange={(e) => setData('last_name', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                                {errors.last_name && <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                                <input
                                    type="text"
                                    value={data.first_name}
                                    onChange={(e) => setData('first_name', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                                {errors.first_name && <p className="text-red-500 text-sm mt-1">{errors.first_name}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Middle Name</label>
                                <input
                                    type="text"
                                    value={data.middle_name}
                                    onChange={(e) => setData('middle_name', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Suffix</label>
                                <select
                                    value={data.suffix}
                                    onChange={(e) => setData('suffix', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">Select Suffix</option>
                                    <option value="Jr.">Jr.</option>
                                    <option value="Sr.">Sr.</option>
                                    <option value="II">II</option>
                                    <option value="III">III</option>
                                    <option value="IV">IV</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth *</label>
                                <input
                                    type="date"
                                    value={data.date_of_birth}
                                    onChange={(e) => setData('date_of_birth', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                                {errors.date_of_birth && <p className="text-red-500 text-sm mt-1">{errors.date_of_birth}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Place of Birth</label>
                                <input
                                    type="text"
                                    value={data.place_of_birth}
                                    onChange={(e) => setData('place_of_birth', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Gender *</label>
                                <select
                                    value={data.gender}
                                    onChange={(e) => setData('gender', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                                {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Civil Status *</label>
                                <select
                                    value={data.civil_status}
                                    onChange={(e) => setData('civil_status', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                >
                                    <option value="">Select Civil Status</option>
                                    <option value="Single">Single</option>
                                    <option value="Married">Married</option>
                                    <option value="Widowed">Widowed</option>
                                    <option value="Divorced">Divorced</option>
                                    <option value="Separated">Separated</option>
                                </select>
                                {errors.civil_status && <p className="text-red-500 text-sm mt-1">{errors.civil_status}</p>}
                            </div>
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-900">Contact & Address Information</h3>
                        
                        {/* Contact Information */}
                        <div className="border-b border-gray-200 pb-6">
                            <h4 className="text-md font-medium text-gray-800 mb-4">Contact Information</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Contact Number *</label>
                                    <input
                                        type="tel"
                                        value={data.contact_number}
                                        onChange={(e) => setData('contact_number', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="09XXXXXXXXX"
                                        required
                                    />
                                    {errors.contact_number && <p className="text-red-500 text-sm mt-1">{errors.contact_number}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="email@example.com"
                                        required
                                    />
                                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Address Information */}
                        <div>
                            <h4 className="text-md font-medium text-gray-800 mb-4">Address Information</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">House Number *</label>
                                    <input
                                        type="text"
                                        value={data.house_number}
                                        onChange={(e) => setData('house_number', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                    {errors.house_number && <p className="text-red-500 text-sm mt-1">{errors.house_number}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Street *</label>
                                    <input
                                        type="text"
                                        value={data.street}
                                        onChange={(e) => setData('street', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                    {errors.street && <p className="text-red-500 text-sm mt-1">{errors.street}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Barangay *</label>
                                    <input
                                        type="text"
                                        value={data.barangay}
                                        onChange={(e) => setData('barangay', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                    {errors.barangay && <p className="text-red-500 text-sm mt-1">{errors.barangay}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                                    <input
                                        type="text"
                                        value={data.city}
                                        onChange={(e) => setData('city', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                                        readOnly
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Province</label>
                                    <input
                                        type="text"
                                        value={data.province}
                                        onChange={(e) => setData('province', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                                        readOnly
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
                                    <input
                                        type="text"
                                        value={data.zip_code}
                                        onChange={(e) => setData('zip_code', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                                        readOnly
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-900">Emergency Contact Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Person Name *</label>
                                <input
                                    type="text"
                                    value={data.emergency_contact_name}
                                    onChange={(e) => setData('emergency_contact_name', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                                {errors.emergency_contact_name && <p className="text-red-500 text-sm mt-1">{errors.emergency_contact_name}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Relationship *</label>
                                <select
                                    value={data.emergency_contact_relationship}
                                    onChange={(e) => setData('emergency_contact_relationship', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                >
                                    <option value="">Select Relationship</option>
                                    <option value="Spouse">Spouse</option>
                                    <option value="Child">Child</option>
                                    <option value="Sibling">Sibling</option>
                                    <option value="Parent">Parent</option>
                                    <option value="Relative">Relative</option>
                                    <option value="Friend">Friend</option>
                                    <option value="Neighbor">Neighbor</option>
                                    <option value="Caregiver">Caregiver</option>
                                </select>
                                {errors.emergency_contact_relationship && <p className="text-red-500 text-sm mt-1">{errors.emergency_contact_relationship}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Number *</label>
                                <input
                                    type="tel"
                                    value={data.emergency_contact_number}
                                    onChange={(e) => setData('emergency_contact_number', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="09XXXXXXXXX"
                                    required
                                />
                                {errors.emergency_contact_number && <p className="text-red-500 text-sm mt-1">{errors.emergency_contact_number}</p>}
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                                <textarea
                                    value={data.emergency_contact_address}
                                    onChange={(e) => setData('emergency_contact_address', e.target.value)}
                                    rows={3}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Complete address of emergency contact"
                                />
                            </div>
                        </div>
                    </div>
                );

            case 4:
                return (
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-900">Health Information</h3>
                        <p className="text-sm text-gray-600">This information helps us provide better care and assistance.</p>
                        
                        <div className="space-y-6">
                            <div>
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={data.has_medical_conditions}
                                        onChange={(e) => setData('has_medical_conditions', e.target.checked)}
                                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">I have existing medical conditions</span>
                                </label>
                            </div>

                            {data.has_medical_conditions && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Medical Conditions</label>
                                    <textarea
                                        value={data.medical_conditions}
                                        onChange={(e) => setData('medical_conditions', e.target.value)}
                                        rows={3}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Please list your medical conditions (e.g., Hypertension, Diabetes, Heart Disease)"
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Current Medications</label>
                                <textarea
                                    value={data.current_medications}
                                    onChange={(e) => setData('current_medications', e.target.value)}
                                    rows={3}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="List any medications you are currently taking (optional)"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Allergies</label>
                                <textarea
                                    value={data.allergies}
                                    onChange={(e) => setData('allergies', e.target.value)}
                                    rows={2}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="List any known allergies (food, medication, etc.)"
                                />
                            </div>
                        </div>
                    </div>
                );

            case 5:
                return (
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-900">Document Upload</h3>
                        <p className="text-sm text-gray-600">Please upload clear photos or scans of the required documents.</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Valid ID (Front) *</label>
                                <input
                                    type="file"
                                    accept="image/*,.pdf"
                                    onChange={(e) => handleFileUpload('valid_id_front', e.target.files?.[0] || null)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                                <p className="text-xs text-gray-500 mt-1">Accepted: Driver's License, PhilHealth ID, Senior Citizen ID, etc.</p>
                                {errors.valid_id_front && <p className="text-red-500 text-sm mt-1">{errors.valid_id_front}</p>}
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Valid ID (Back) *</label>
                                <input
                                    type="file"
                                    accept="image/*,.pdf"
                                    onChange={(e) => handleFileUpload('valid_id_back', e.target.files?.[0] || null)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                                {errors.valid_id_back && <p className="text-red-500 text-sm mt-1">{errors.valid_id_back}</p>}
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Birth Certificate</label>
                                <input
                                    type="file"
                                    accept="image/*,.pdf"
                                    onChange={(e) => handleFileUpload('birth_certificate', e.target.files?.[0] || null)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <p className="text-xs text-gray-500 mt-1">PSA Birth Certificate (recommended)</p>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Proof of Residency</label>
                                <input
                                    type="file"
                                    accept="image/*,.pdf"
                                    onChange={(e) => handleFileUpload('proof_of_residency', e.target.files?.[0] || null)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <p className="text-xs text-gray-500 mt-1">Barangay Certificate, Utility Bill, etc.</p>
                            </div>
                        </div>
                    </div>
                );

            case 6:
                return (
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-900">Review & Submit</h3>
                        
                        <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                            <h4 className="font-medium text-gray-900">Application Summary</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="font-medium">Name:</span> {data.first_name} {data.middle_name} {data.last_name} {data.suffix}
                                </div>
                                <div>
                                    <span className="font-medium">Date of Birth:</span> {data.date_of_birth}
                                </div>
                                <div>
                                    <span className="font-medium">Gender:</span> {data.gender}
                                </div>
                                <div>
                                    <span className="font-medium">Civil Status:</span> {data.civil_status}
                                </div>
                                <div>
                                    <span className="font-medium">Contact:</span> {data.contact_number}
                                </div>
                                <div>
                                    <span className="font-medium">Email:</span> {data.email || 'Not provided'}
                                </div>
                                <div className="md:col-span-2">
                                    <span className="font-medium">Address:</span> {data.house_number} {data.street}, {data.barangay}, {data.city}, {data.province}
                                </div>
                                <div className="md:col-span-2">
                                    <span className="font-medium">Emergency Contact:</span> {data.emergency_contact_name} ({data.emergency_contact_relationship}) - {data.emergency_contact_number}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="flex items-start">
                                    <input
                                        type="checkbox"
                                        checked={data.data_privacy_consent}
                                        onChange={(e) => setData('data_privacy_consent', e.target.checked)}
                                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 mt-1"
                                        required
                                    />
                                    <span className="ml-2 text-sm text-gray-700">
                                        I consent to the collection and processing of my personal data in accordance with the 
                                        <a href="#" className="text-blue-600 hover:underline"> Data Privacy Act</a>.
                                    </span>
                                </label>
                            </div>

                            <div>
                                <label className="flex items-start">
                                    <input
                                        type="checkbox"
                                        checked={data.terms_conditions}
                                        onChange={(e) => setData('terms_conditions', e.target.checked)}
                                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 mt-1"
                                        required
                                    />
                                    <span className="ml-2 text-sm text-gray-700">
                                        I agree to the <a href="#" className="text-blue-600 hover:underline">Terms and Conditions</a> 
                                        of the OSCA Senior Citizen Registration.
                                    </span>
                                </label>
                            </div>
                        </div>

                        {(!data.data_privacy_consent || !data.terms_conditions) && (
                            <div className="text-red-500 text-sm">
                                Please accept the Data Privacy consent and Terms & Conditions to proceed.
                            </div>
                        )}
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <>
            <Head title="Senior Citizen Registration - OSCA Iligan City" />
            
            <div className="min-h-screen bg-gray-50">
                <Header showFullNav={true} />
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
                    {/* Senior Citizen Registration Form Header */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-blue-700 text-center">
                            Senior Citizen Registration Form
                        </h2>
                        <p className="text-center text-gray-600 mt-2">
                            Complete all steps to register as a senior citizen in Iligan City
                        </p>
                    </div>

                    {/* Progress Steps */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            {steps.map((step, index) => (
                                <div key={step.id} className="flex items-center">
                                    <div className="flex items-center">
                                        <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                                            currentStep > step.id
                                                ? 'bg-blue-600 border-blue-600 text-white'
                                                : currentStep === step.id
                                                ? 'border-blue-600 text-blue-600'
                                                : 'border-gray-300 text-gray-500'
                                        }`}>
                                            {currentStep > step.id ? (
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            ) : (
                                                <span className="text-sm font-semibold">{step.id}</span>
                                            )}
                                        </div>
                                        <div className="ml-2 hidden sm:block">
                                            <p className={`text-sm font-medium ${
                                                currentStep >= step.id ? 'text-blue-600' : 'text-gray-500'
                                            }`}>
                                                {step.name}
                                            </p>
                                        </div>
                                    </div>
                                    {index < steps.length - 1 && (
                                        <div className={`w-8 sm:w-16 h-0.5 mx-2 ${
                                            currentStep > step.id ? 'bg-blue-600' : 'bg-gray-300'
                                        }`} />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Form */}
                    <div className="bg-white shadow rounded-lg">
                        <form onSubmit={handleSubmit} className="p-6">
                            {/* Global Error Display */}
                            {Object.keys(errors).length > 0 && (
                                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                                    <div className="flex items-start">
                                        <svg className="w-5 h-5 text-red-600 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                        <div className="flex-1">
                                            <h3 className="text-sm font-medium text-red-800 mb-2">Please fix the following errors:</h3>
                                            <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                                                {Object.entries(errors).map(([field, message]) => (
                                                    <li key={field}>
                                                        <strong>{field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:</strong> {Array.isArray(message) ? message[0] : message}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            {renderStep()}
                            
                            {/* Navigation Buttons */}
                            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={prevStep}
                                    disabled={currentStep === 1}
                                    className={`px-6 py-2 rounded-lg font-medium ${
                                        currentStep === 1
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                                >
                                    Previous
                                </button>
                                
                                {currentStep < steps.length ? (
                                    <button
                                        type="button"
                                        onClick={nextStep}
                                        disabled={!isStepValid(currentStep)}
                                        className={`px-6 py-2 rounded-lg font-medium ${
                                            isStepValid(currentStep)
                                                ? 'bg-blue-600 text-white hover:bg-blue-700'
                                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        }`}
                                    >
                                        Next
                                    </button>
                                ) : (
                                    <button
                                        type="submit"
                                        disabled={processing || !isStepValid(currentStep)}
                                        className={`px-6 py-2 rounded-lg font-medium ${
                                            isStepValid(currentStep) && !processing
                                                ? 'bg-green-600 text-white hover:bg-green-700'
                                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        }`}
                                    >
                                        {processing ? 'Submitting...' : 'Submit Application'}
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
                <Footer />
            </div>
        </>
    );
}