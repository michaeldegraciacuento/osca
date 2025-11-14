import { FormEvent } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertCircle } from 'lucide-react';

interface Reviewer {
    id: number;
    name: string;
}

interface Registration {
    id: number;
    registration_id: string;
    status: string;
    status_label: string;
    
    // Personal Information
    first_name: string;
    middle_name: string | null;
    last_name: string;
    suffix: string | null;
    full_name: string;
    date_of_birth: string;
    place_of_birth: string | null;
    gender: string;
    civil_status: string;
    age: number;
    
    // Contact Information
    contact_number: string;
    email: string | null;
    
    // Address Information
    house_number: string;
    street: string;
    barangay: string;
    city: string;
    province: string;
    zip_code: string;
    full_address: string;
    
    // Emergency Contact
    emergency_contact_name: string;
    emergency_contact_relationship: string;
    emergency_contact_number: string;
    emergency_contact_address: string | null;
    
    // Health Information
    has_medical_conditions: boolean;
    medical_conditions: string | null;
    current_medications: string | null;
    allergies: string | null;
    
    // Documents
    valid_id_front: string | null;
    valid_id_back: string | null;
    birth_certificate: string | null;
    proof_of_residency: string | null;
    
    // Agreements
    data_privacy_consent: boolean;
    terms_conditions: boolean;
    
    // Review Information
    notes: string | null;
    reviewed_at: string | null;
    reviewed_by: Reviewer | null;
    
    // Timestamps
    created_at: string;
    updated_at: string;
}

interface Props {
    registration: Registration;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Senior Citizen Registrations',
        href: '/admin/senior-citizen-registrations',
    },
    {
        title: 'Edit',
        href: '#',
    },
];

export default function Edit({ registration }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        // Personal Information
        first_name: registration.first_name,
        middle_name: registration.middle_name || '',
        last_name: registration.last_name,
        suffix: registration.suffix || '',
        date_of_birth: registration.date_of_birth,
        place_of_birth: registration.place_of_birth || '',
        gender: registration.gender,
        civil_status: registration.civil_status,
        
        // Contact Information
        contact_number: registration.contact_number,
        email: registration.email || '',
        
        // Address Information
        house_number: registration.house_number,
        street: registration.street,
        barangay: registration.barangay,
        city: registration.city,
        province: registration.province,
        zip_code: registration.zip_code,
        
        // Emergency Contact
        emergency_contact_name: registration.emergency_contact_name,
        emergency_contact_relationship: registration.emergency_contact_relationship,
        emergency_contact_number: registration.emergency_contact_number,
        emergency_contact_address: registration.emergency_contact_address || '',
        
        // Health Information
        has_medical_conditions: registration.has_medical_conditions,
        medical_conditions: registration.medical_conditions || '',
        current_medications: registration.current_medications || '',
        allergies: registration.allergies || '',
        
        // Documents (files - will be null unless user uploads new ones)
        valid_id_front: null as File | null,
        valid_id_back: null as File | null,
        birth_certificate: null as File | null,
        proof_of_residency: null as File | null,
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(route('admin.senior-citizen-registrations.update-registration', registration.id), {
            forceFormData: true,
        });
    };

    const handleFileChange = (field: string, file: File | null) => {
        setData(field as any, file);
    };

    const FileInput = ({ 
        label, 
        field, 
        error, 
        currentFile 
    }: { 
        label: string; 
        field: string; 
        error?: string; 
        currentFile: string | null;
    }) => (
        <div className="space-y-2">
            <Label>{label}</Label>
            {currentFile && (
                <div className="text-xs text-muted-foreground mb-1">
                    Current file: <a href={`/storage/${currentFile}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View</a>
                </div>
            )}
            <Input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => handleFileChange(field, e.target.files?.[0] || null)}
                className="cursor-pointer"
            />
            <div className="text-xs text-muted-foreground">
                {currentFile ? 'Upload a new file to replace the existing one' : 'No file uploaded yet'}
            </div>
            {error && (
                <div className="flex items-center gap-2 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                </div>
            )}
        </div>
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Registration - ${registration.registration_id}`} />
            
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold tracking-tight">Edit Registration</h1>
                    <p className="text-muted-foreground">
                        Update registration information for {registration.full_name} ({registration.registration_id})
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Personal Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Personal Information</CardTitle>
                            <CardDescription>Basic personal details of the senior citizen</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="first_name">First Name *</Label>
                                    <Input
                                        id="first_name"
                                        value={data.first_name}
                                        onChange={(e) => setData('first_name', e.target.value)}
                                    />
                                    {errors.first_name && <p className="text-sm text-destructive">{errors.first_name}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="middle_name">Middle Name</Label>
                                    <Input
                                        id="middle_name"
                                        value={data.middle_name}
                                        onChange={(e) => setData('middle_name', e.target.value)}
                                    />
                                    {errors.middle_name && <p className="text-sm text-destructive">{errors.middle_name}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="last_name">Last Name *</Label>
                                    <Input
                                        id="last_name"
                                        value={data.last_name}
                                        onChange={(e) => setData('last_name', e.target.value)}
                                    />
                                    {errors.last_name && <p className="text-sm text-destructive">{errors.last_name}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="suffix">Suffix</Label>
                                    <Input
                                        id="suffix"
                                        value={data.suffix}
                                        onChange={(e) => setData('suffix', e.target.value)}
                                        placeholder="Jr., Sr., III"
                                    />
                                    {errors.suffix && <p className="text-sm text-destructive">{errors.suffix}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="date_of_birth">Date of Birth *</Label>
                                    <Input
                                        id="date_of_birth"
                                        type="date"
                                        value={data.date_of_birth}
                                        onChange={(e) => setData('date_of_birth', e.target.value)}
                                    />
                                    {errors.date_of_birth && <p className="text-sm text-destructive">{errors.date_of_birth}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="gender">Gender *</Label>
                                    <Select value={data.gender} onValueChange={(value) => setData('gender', value)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Male">Male</SelectItem>
                                            <SelectItem value="Female">Female</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.gender && <p className="text-sm text-destructive">{errors.gender}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="civil_status">Civil Status *</Label>
                                    <Select value={data.civil_status} onValueChange={(value) => setData('civil_status', value)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Single">Single</SelectItem>
                                            <SelectItem value="Married">Married</SelectItem>
                                            <SelectItem value="Widowed">Widowed</SelectItem>
                                            <SelectItem value="Divorced">Divorced</SelectItem>
                                            <SelectItem value="Separated">Separated</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.civil_status && <p className="text-sm text-destructive">{errors.civil_status}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="place_of_birth">Place of Birth</Label>
                                <Input
                                    id="place_of_birth"
                                    value={data.place_of_birth}
                                    onChange={(e) => setData('place_of_birth', e.target.value)}
                                />
                                {errors.place_of_birth && <p className="text-sm text-destructive">{errors.place_of_birth}</p>}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Contact Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Contact Information</CardTitle>
                            <CardDescription>How to reach the senior citizen</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="contact_number">Contact Number *</Label>
                                    <Input
                                        id="contact_number"
                                        value={data.contact_number}
                                        onChange={(e) => setData('contact_number', e.target.value)}
                                    />
                                    {errors.contact_number && <p className="text-sm text-destructive">{errors.contact_number}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                    />
                                    {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Address Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Address Information</CardTitle>
                            <CardDescription>Current residential address</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="house_number">House Number *</Label>
                                    <Input
                                        id="house_number"
                                        value={data.house_number}
                                        onChange={(e) => setData('house_number', e.target.value)}
                                    />
                                    {errors.house_number && <p className="text-sm text-destructive">{errors.house_number}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="street">Street *</Label>
                                    <Input
                                        id="street"
                                        value={data.street}
                                        onChange={(e) => setData('street', e.target.value)}
                                    />
                                    {errors.street && <p className="text-sm text-destructive">{errors.street}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="barangay">Barangay *</Label>
                                    <Input
                                        id="barangay"
                                        value={data.barangay}
                                        onChange={(e) => setData('barangay', e.target.value)}
                                    />
                                    {errors.barangay && <p className="text-sm text-destructive">{errors.barangay}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="city">City *</Label>
                                    <Input
                                        id="city"
                                        value={data.city}
                                        onChange={(e) => setData('city', e.target.value)}
                                    />
                                    {errors.city && <p className="text-sm text-destructive">{errors.city}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="province">Province *</Label>
                                    <Input
                                        id="province"
                                        value={data.province}
                                        onChange={(e) => setData('province', e.target.value)}
                                    />
                                    {errors.province && <p className="text-sm text-destructive">{errors.province}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="zip_code">Zip Code *</Label>
                                    <Input
                                        id="zip_code"
                                        value={data.zip_code}
                                        onChange={(e) => setData('zip_code', e.target.value)}
                                    />
                                    {errors.zip_code && <p className="text-sm text-destructive">{errors.zip_code}</p>}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Emergency Contact */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Emergency Contact</CardTitle>
                            <CardDescription>Person to contact in case of emergency</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="emergency_contact_name">Contact Name *</Label>
                                    <Input
                                        id="emergency_contact_name"
                                        value={data.emergency_contact_name}
                                        onChange={(e) => setData('emergency_contact_name', e.target.value)}
                                    />
                                    {errors.emergency_contact_name && <p className="text-sm text-destructive">{errors.emergency_contact_name}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="emergency_contact_relationship">Relationship *</Label>
                                    <Input
                                        id="emergency_contact_relationship"
                                        value={data.emergency_contact_relationship}
                                        onChange={(e) => setData('emergency_contact_relationship', e.target.value)}
                                    />
                                    {errors.emergency_contact_relationship && <p className="text-sm text-destructive">{errors.emergency_contact_relationship}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="emergency_contact_number">Contact Number *</Label>
                                    <Input
                                        id="emergency_contact_number"
                                        value={data.emergency_contact_number}
                                        onChange={(e) => setData('emergency_contact_number', e.target.value)}
                                    />
                                    {errors.emergency_contact_number && <p className="text-sm text-destructive">{errors.emergency_contact_number}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="emergency_contact_address">Contact Address</Label>
                                <Input
                                    id="emergency_contact_address"
                                    value={data.emergency_contact_address}
                                    onChange={(e) => setData('emergency_contact_address', e.target.value)}
                                />
                                {errors.emergency_contact_address && <p className="text-sm text-destructive">{errors.emergency_contact_address}</p>}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Health Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Health Information</CardTitle>
                            <CardDescription>Medical conditions and health details</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="has_medical_conditions"
                                    checked={data.has_medical_conditions}
                                    onCheckedChange={(checked) => setData('has_medical_conditions', checked as boolean)}
                                />
                                <Label htmlFor="has_medical_conditions" className="cursor-pointer">
                                    Has medical conditions
                                </Label>
                            </div>

                            {data.has_medical_conditions && (
                                <div className="space-y-2">
                                    <Label htmlFor="medical_conditions">Medical Conditions</Label>
                                    <textarea
                                        id="medical_conditions"
                                        value={data.medical_conditions}
                                        onChange={(e) => setData('medical_conditions', e.target.value)}
                                        rows={3}
                                        className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    />
                                    {errors.medical_conditions && <p className="text-sm text-destructive">{errors.medical_conditions}</p>}
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="current_medications">Current Medications</Label>
                                <textarea
                                    id="current_medications"
                                    value={data.current_medications}
                                    onChange={(e) => setData('current_medications', e.target.value)}
                                    rows={3}
                                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                />
                                {errors.current_medications && <p className="text-sm text-destructive">{errors.current_medications}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="allergies">Allergies</Label>
                                <textarea
                                    id="allergies"
                                    value={data.allergies}
                                    onChange={(e) => setData('allergies', e.target.value)}
                                    rows={3}
                                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                />
                                {errors.allergies && <p className="text-sm text-destructive">{errors.allergies}</p>}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Documents */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Documents</CardTitle>
                            <CardDescription>Upload new documents to replace existing ones (optional)</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FileInput 
                                    label="Valid ID (Front)" 
                                    field="valid_id_front"
                                    error={errors.valid_id_front}
                                    currentFile={registration.valid_id_front}
                                />
                                <FileInput 
                                    label="Valid ID (Back)" 
                                    field="valid_id_back"
                                    error={errors.valid_id_back}
                                    currentFile={registration.valid_id_back}
                                />
                                <FileInput 
                                    label="Birth Certificate" 
                                    field="birth_certificate"
                                    error={errors.birth_certificate}
                                    currentFile={registration.birth_certificate}
                                />
                                <FileInput 
                                    label="Proof of Residency" 
                                    field="proof_of_residency"
                                    error={errors.proof_of_residency}
                                    currentFile={registration.proof_of_residency}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    <div className="flex justify-end gap-4">
                        <Link href={route('admin.senior-citizen-registrations.show', registration.id)}>
                            <Button type="button" variant="outline">
                                Cancel
                            </Button>
                        </Link>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Updating...' : 'Update Registration'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
