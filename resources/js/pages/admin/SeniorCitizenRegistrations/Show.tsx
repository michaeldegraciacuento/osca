import { Head, Link, router, usePage } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
    ArrowLeft, 
    CheckCircle, 
    XCircle, 
    Clock, 
    AlertCircle, 
    FileText, 
    Download,
    Eye,
    Calendar,
    Phone,
    Mail,
    MapPin,
    Heart,
    User,
    Shield,
    Pencil
} from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { useState, useEffect } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { usePermissions } from '@/hooks/usePermissions';

interface Registration {
    id: number;
    registration_id: string;
    status: 'pending' | 'under_review' | 'approved' | 'rejected';
    status_label: string;
    
    // Personal Information
    first_name: string;
    middle_name: string;
    last_name: string;
    suffix: string;
    full_name: string;
    date_of_birth: string;
    place_of_birth: string;
    gender: string;
    civil_status: string;
    age: number;
    
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
    full_address: string;
    
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
    valid_id_front: string;
    valid_id_back: string;
    birth_certificate: string;
    proof_of_residency: string;
    
    // Agreements
    data_privacy_consent: boolean;
    terms_conditions: boolean;
    
    // Review Information
    notes: string;
    reviewed_at: string;
    reviewed_by: {
        id: number;
        name: string;
    } | null;
    
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
        title: 'View Registration',
        href: '#',
    },
];

export default function Show({ registration }: Props) {
    const [isUpdating, setIsUpdating] = useState(false);
    const [status, setStatus] = useState(registration.status);
    const [notes, setNotes] = useState(registration.notes || '');
    const { props } = usePage();
    const { can } = usePermissions();

    // Show success message if status was updated
    useEffect(() => {
        if (props.success && props.message) {
            // You can use your existing notification system here
            // For now, we'll use a simple alert
            setTimeout(() => {
                alert(props.message);
            }, 100);
        }
    }, [props.success, props.message]);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending':
                return <Clock className="h-4 w-4" />;
            case 'under_review':
                return <AlertCircle className="h-4 w-4" />;
            case 'approved':
                return <CheckCircle className="h-4 w-4" />;
            case 'rejected':
                return <XCircle className="h-4 w-4" />;
            default:
                return <Clock className="h-4 w-4" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'under_review':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'approved':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'rejected':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const handleStatusUpdate = () => {
        setIsUpdating(true);
        router.patch(`/admin/senior-citizen-registrations/${registration.id}`, {
            status,
            notes,
        }, {
            onFinish: () => setIsUpdating(false),
            preserveScroll: true,
        });
    };

    const viewDocument = (documentPath: string) => {
        window.open(`/storage/${documentPath}`, '_blank');
    };

    const isApproved = registration.status === 'approved';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Registration ${registration.registration_id}`} />
            
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
            
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <Link href="/admin/senior-citizen-registrations">
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Registrations
                        </Button>
                    </Link>
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold tracking-tight">Registration Details</h1>
                        <p className="text-muted-foreground">
                            Review and manage senior citizen registration application
                        </p>
                    </div>
                    {can('senior_citizen_registrations.edit') && (
                        <Link href={`/admin/senior-citizen-registrations/${registration.id}/edit`}>
                            <Button variant="outline" size="sm">
                                <Pencil className="h-4 w-4 mr-2" />
                                Edit
                            </Button>
                        </Link>
                    )}
                    {can('senior_citizen_registrations.view') && (
                        <a 
                            href={`/admin/senior-citizen-registrations/${registration.id}/download-form`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Button variant="outline" size="sm">
                                <Download className="h-4 w-4 mr-2" />
                                Download Form
                            </Button>
                        </a>
                    )}
                </div>

                {/* Registration Overview */}
                <Card className="mb-6">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-xl">Registration {registration.registration_id}</CardTitle>
                                <CardDescription>
                                    Submitted on {new Date(registration.created_at).toLocaleDateString()}
                                </CardDescription>
                            </div>
                            <Badge className={getStatusColor(registration.status)}>
                                {getStatusIcon(registration.status)}
                                <span className="ml-1">{registration.status_label}</span>
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">Applicant Name</Label>
                                <p className="text-lg font-semibold">{registration.full_name}</p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">Age</Label>
                                <p className="text-lg">{registration.age} years old</p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">Gender</Label>
                                <p className="text-lg">{registration.gender}</p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">Barangay</Label>
                                <p className="text-lg">{registration.barangay}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Personal Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5" />
                                    Personal Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">Full Name</Label>
                                        <p>{registration.full_name}</p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">Date of Birth</Label>
                                        <p>{new Date(registration.date_of_birth).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">Place of Birth</Label>
                                        <p>{registration.place_of_birth || 'Not provided'}</p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">Civil Status</Label>
                                        <p>{registration.civil_status}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Contact Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Phone className="h-5 w-5" />
                                    Contact Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">Contact Number</Label>
                                        <p className="flex items-center gap-2">
                                            <Phone className="h-4 w-4 text-muted-foreground" />
                                            {registration.contact_number}
                                        </p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">Email Address</Label>
                                        <p className="flex items-center gap-2">
                                            <Mail className="h-4 w-4 text-muted-foreground" />
                                            {registration.email || 'Not provided'}
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">Address</Label>
                                    <p className="flex items-start gap-2">
                                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                                        {registration.full_address}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Emergency Contact */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Shield className="h-5 w-5" />
                                    Emergency Contact
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">Contact Person</Label>
                                        <p>{registration.emergency_contact_name}</p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">Relationship</Label>
                                        <p>{registration.emergency_contact_relationship}</p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">Contact Number</Label>
                                        <p>{registration.emergency_contact_number}</p>
                                    </div>
                                </div>
                                {registration.emergency_contact_address && (
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">Address</Label>
                                        <p>{registration.emergency_contact_address}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Health Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Heart className="h-5 w-5" />
                                    Health Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">Medical Conditions</Label>
                                    <p>{registration.has_medical_conditions ? 'Yes' : 'No'}</p>
                                    {registration.has_medical_conditions && registration.medical_conditions && (
                                        <p className="text-sm mt-1 p-2 bg-muted rounded">{registration.medical_conditions}</p>
                                    )}
                                </div>
                                {registration.current_medications && (
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">Current Medications</Label>
                                        <p className="text-sm p-2 bg-muted rounded">{registration.current_medications}</p>
                                    </div>
                                )}
                                {registration.allergies && (
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">Allergies</Label>
                                        <p className="text-sm p-2 bg-muted rounded">{registration.allergies}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Documents */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-5 w-5" />
                                    Submitted Documents
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[
                                        { label: 'Valid ID (Front)', path: registration.valid_id_front },
                                        { label: 'Valid ID (Back)', path: registration.valid_id_back },
                                        { label: 'Birth Certificate', path: registration.birth_certificate },
                                        { label: 'Proof of Residency', path: registration.proof_of_residency },
                                    ].map((doc) => (
                                        <div key={doc.label} className="border rounded-lg p-3">
                                            <Label className="text-sm font-medium">{doc.label}</Label>
                                            {doc.path ? (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="mt-2 w-full"
                                                    onClick={() => viewDocument(doc.path)}
                                                >
                                                    <Eye className="h-4 w-4 mr-2" />
                                                    View Document
                                                </Button>
                                            ) : (
                                                <p className="text-sm text-muted-foreground mt-2">Not provided</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Status Update */}
                        {can('senior_citizen_registrations.edit') && (
                            <>
                                {isApproved ? (
                                    <TooltipProvider>
                                        <Tooltip delayDuration={0}>
                                            <TooltipTrigger asChild>
                                                <div className="cursor-not-allowed">
                                                    <Card className="opacity-60">
                                                        <CardHeader>
                                                            <CardTitle>Update Status</CardTitle>
                                                            <CardDescription>
                                                                Review and update the registration status
                                                            </CardDescription>
                                                        </CardHeader>
                                                        <CardContent className="space-y-4">
                                                            <div>
                                                                <Label>Status</Label>
                                                                <Select value={status} onValueChange={setStatus} disabled>
                                                                    <SelectTrigger>
                                                                        <SelectValue />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="pending">Pending</SelectItem>
                                                                        <SelectItem value="correction">Correction</SelectItem>
                                                                        <SelectItem value="under_review">Under Review</SelectItem>
                                                                <SelectItem value="approved">Approved</SelectItem>
                                                                <SelectItem value="rejected">Rejected</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div>
                                                        <Label>Review Notes</Label>
                                                        <textarea
                                                            value={notes}
                                                            onChange={(e) => setNotes(e.target.value)}
                                                            placeholder="Add notes about this registration..."
                                                            rows={4}
                                                            disabled
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none resize-none bg-muted text-muted-foreground"
                                                        />
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent side="left">
                                        Already approved, no need to update
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        ) : (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Update Status</CardTitle>
                                    <CardDescription>
                                        Review and update the registration status
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label>Status</Label>
                                        <Select value={status} onValueChange={setStatus} disabled={isUpdating}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="pending">Pending</SelectItem>
                                                <SelectItem value="correction">Correction</SelectItem>
                                                <SelectItem value="under_review">Under Review</SelectItem>
                                                <SelectItem value="approved">Approved</SelectItem>
                                                <SelectItem value="rejected">Rejected</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label>Review Notes</Label>
                                        <textarea
                                            value={notes}
                                            onChange={(e) => setNotes(e.target.value)}
                                            placeholder="Add notes about this registration..."
                                            rows={4}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                                        />
                                    </div>
                                    <Button
                                        onClick={handleStatusUpdate}
                                        disabled={isUpdating}
                                        className="w-full"
                                    >
                                        {isUpdating ? 'Updating...' : 'Update Status'}
                                    </Button>
                                </CardContent>
                            </Card>
                        )}
                            </>
                        )}

                        {/* Review Information */}
                        {registration.reviewed_at && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Review Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">Reviewed By</Label>
                                        <p>{registration.reviewed_by?.name || 'System'}</p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">Reviewed On</Label>
                                        <p className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-muted-foreground" />
                                            {new Date(registration.reviewed_at).toLocaleString()}
                                        </p>
                                    </div>
                                    {registration.notes && (
                                        <div>
                                            <Label className="text-sm font-medium text-muted-foreground">Notes</Label>
                                            <p className="text-sm p-2 bg-muted rounded mt-1">{registration.notes}</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        {/* Registration Timeline */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Timeline</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center gap-3 text-sm">
                                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                    <div>
                                        <p className="font-medium">Registration Submitted</p>
                                        <p className="text-muted-foreground">
                                            {new Date(registration.created_at).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                                {registration.reviewed_at && (
                                    <div className="flex items-center gap-3 text-sm">
                                        <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                                        <div>
                                            <p className="font-medium">Status Updated</p>
                                            <p className="text-muted-foreground">
                                                {new Date(registration.reviewed_at).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
