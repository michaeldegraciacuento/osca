import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { 
    User, 
    Phone, 
    Mail, 
    MapPin, 
    Calendar, 
    Heart, 
    FileText, 
    AlertCircle,
    Download,
    Users,
    Shield,
    Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'My Registration',
        href: '/my-registration',
    },
];

interface Registration {
    id: number;
    registration_id: string;
    status: string;
    status_label: string;
    
    // Personal Information
    last_name: string;
    first_name: string;
    middle_name: string | null;
    suffix: string | null;
    full_name: string;
    date_of_birth: string;
    age: number;
    place_of_birth: string | null;
    gender: string;
    civil_status: string;
    
    // Contact Information
    contact_number: string;
    email: string | null;
    
    // Address Information
    street_address: string;
    barangay: string;
    city: string;
    province: string;
    zip_code: string | null;
    full_address: string;
    
    // Additional Information
    senior_citizen_id: string | null;
    philhealth_number: string | null;
    tin: string | null;
    sss_gsis_number: string | null;
    
    // Emergency Contact
    emergency_contact_name: string | null;
    emergency_contact_relationship: string | null;
    emergency_contact_number: string | null;
    emergency_contact_address: string | null;
    
    // Health Information
    health_conditions: string | null;
    medications: string | null;
    mobility_status: string | null;
    
    // Documents
    photo: string | null;
    valid_id_front: string | null;
    valid_id_back: string | null;
    proof_of_residency: string | null;
    birth_certificate: string | null;
    
    // Timestamps
    created_at: string;
    updated_at: string;
}

interface Props {
    registration: Registration | null;
    hasRegistration: boolean;
}

const InfoRow = ({ label, value }: { label: string; value: string | null | undefined }) => (
    <div className="py-3 border-b border-gray-100 last:border-0">
        <dt className="text-sm font-medium text-gray-500 mb-1">{label}</dt>
        <dd className="text-base text-gray-900">{value || 'Not provided'}</dd>
    </div>
);

export default function MyRegistration({ registration, hasRegistration }: Props) {
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'approved':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'under_review':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'rejected':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My Registration" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4 md:p-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">My Registration</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            View your senior citizen registration information
                        </p>
                    </div>
                </div>

                {/* No Registration Warning */}
                {!hasRegistration && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                        <div className="flex items-start gap-4">
                            <AlertCircle className="h-6 w-6 text-yellow-600 mt-1" />
                            <div>
                                <h3 className="text-lg font-semibold text-yellow-900 mb-2">
                                    No Registration Found
                                </h3>
                                <p className="text-yellow-800 mb-4">
                                    You don't have a senior citizen registration yet. Please visit your local OSCA office
                                    to complete your registration, or register online if available.
                                </p>
                                <Link href="/dashboard">
                                    <Button variant="outline" className="border-yellow-600 text-yellow-700 hover:bg-yellow-100">
                                        Go to Dashboard
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                )}

                {/* Registration Details */}
                {hasRegistration && registration && (
                    <>
                        {/* Status Banner */}
                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-blue-100 rounded-full">
                                        <FileText className="h-8 w-8 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-900">{registration.full_name}</h3>
                                        <p className="text-sm text-gray-600">Registration ID: {registration.registration_id}</p>
                                    </div>
                                </div>
                                <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusBadge(registration.status)}`}>
                                    {registration.status_label}
                                </span>
                            </div>
                        </div>

                        <div className="grid gap-6 lg:grid-cols-2">
                            {/* Personal Information */}
                            <div className="bg-white border border-gray-200 rounded-xl p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <User className="h-5 w-5 text-blue-600" />
                                    <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                                </div>
                                <dl className="space-y-1">
                                    <InfoRow label="Full Name" value={registration.full_name} />
                                    <InfoRow label="Date of Birth" value={registration.date_of_birth} />
                                    <InfoRow label="Age" value={`${registration.age} years old`} />
                                    <InfoRow label="Place of Birth" value={registration.place_of_birth} />
                                    <InfoRow label="Gender" value={registration.gender} />
                                    <InfoRow label="Civil Status" value={registration.civil_status} />
                                </dl>
                            </div>

                            {/* Contact Information */}
                            <div className="bg-white border border-gray-200 rounded-xl p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <Phone className="h-5 w-5 text-green-600" />
                                    <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
                                </div>
                                <dl className="space-y-1">
                                    <InfoRow label="Contact Number" value={registration.contact_number} />
                                    <InfoRow label="Email Address" value={registration.email} />
                                </dl>
                            </div>

                            {/* Address Information */}
                            <div className="bg-white border border-gray-200 rounded-xl p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <MapPin className="h-5 w-5 text-red-600" />
                                    <h3 className="text-lg font-semibold text-gray-900">Address</h3>
                                </div>
                                <dl className="space-y-1">
                                    <InfoRow label="Street Address" value={registration.street_address} />
                                    <InfoRow label="Barangay" value={registration.barangay} />
                                    <InfoRow label="City" value={registration.city} />
                                    <InfoRow label="Province" value={registration.province} />
                                    <InfoRow label="Zip Code" value={registration.zip_code} />
                                </dl>
                            </div>

                            {/* Government IDs */}
                            <div className="bg-white border border-gray-200 rounded-xl p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <Shield className="h-5 w-5 text-purple-600" />
                                    <h3 className="text-lg font-semibold text-gray-900">Government IDs</h3>
                                </div>
                                <dl className="space-y-1">
                                    <InfoRow label="Senior Citizen ID" value={registration.senior_citizen_id} />
                                    <InfoRow label="PhilHealth Number" value={registration.philhealth_number} />
                                    <InfoRow label="TIN" value={registration.tin} />
                                    <InfoRow label="SSS/GSIS Number" value={registration.sss_gsis_number} />
                                </dl>
                            </div>

                            {/* Emergency Contact */}
                            <div className="bg-white border border-gray-200 rounded-xl p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <Users className="h-5 w-5 text-orange-600" />
                                    <h3 className="text-lg font-semibold text-gray-900">Emergency Contact</h3>
                                </div>
                                <dl className="space-y-1">
                                    <InfoRow label="Contact Name" value={registration.emergency_contact_name} />
                                    <InfoRow label="Relationship" value={registration.emergency_contact_relationship} />
                                    <InfoRow label="Contact Number" value={registration.emergency_contact_number} />
                                    <InfoRow label="Address" value={registration.emergency_contact_address} />
                                </dl>
                            </div>

                            {/* Health Information */}
                            <div className="bg-white border border-gray-200 rounded-xl p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <Activity className="h-5 w-5 text-pink-600" />
                                    <h3 className="text-lg font-semibold text-gray-900">Health Information</h3>
                                </div>
                                <dl className="space-y-1">
                                    <InfoRow label="Health Conditions" value={registration.health_conditions} />
                                    <InfoRow label="Current Medications" value={registration.medications} />
                                    <InfoRow label="Mobility Status" value={registration.mobility_status} />
                                </dl>
                            </div>
                        </div>

                        {/* Documents Section */}
                        <div className="bg-white border border-gray-200 rounded-xl p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <FileText className="h-5 w-5 text-indigo-600" />
                                <h3 className="text-lg font-semibold text-gray-900">Uploaded Documents</h3>
                            </div>
                            <div className="space-y-6">
                               
                                {/* Valid ID Front and Back */}
                                <div className="grid gap-6 md:grid-cols-2">
                                    {/* Valid ID Front */}
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-semibold text-gray-700">Valid ID (Front)</span>
                                            {registration.valid_id_front && (
                                                <a
                                                    href={`/storage/${registration.valid_id_front}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm"
                                                >
                                                    <Download className="h-4 w-4" />
                                                    Download
                                                </a>
                                            )}
                                        </div>
                                        {registration.valid_id_front ? (
                                            <a
                                                href={`/storage/${registration.valid_id_front}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="block"
                                            >
                                                <div className="relative aspect-[3/2] w-full overflow-hidden rounded-lg border-2 border-gray-200 hover:border-blue-400 transition-colors cursor-pointer group">
                                                    <img
                                                        src={`/storage/${registration.valid_id_front}`}
                                                        alt="Valid ID Front"
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                                    />
                                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 flex items-center justify-center">
                                                        <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-50 px-3 py-1 rounded-full text-sm">
                                                            Click to view full size
                                                        </span>
                                                    </div>
                                                </div>
                                            </a>
                                        ) : (
                                            <div className="aspect-[3/2] w-full bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                                                <div className="text-center">
                                                    <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                                                    <p className="text-sm text-gray-500">No ID front uploaded</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Valid ID Back */}
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-semibold text-gray-700">Valid ID (Back)</span>
                                            {registration.valid_id_back && (
                                                <a
                                                    href={`/storage/${registration.valid_id_back}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm"
                                                >
                                                    <Download className="h-4 w-4" />
                                                    Download
                                                </a>
                                            )}
                                        </div>
                                        {registration.valid_id_back ? (
                                            <a
                                                href={`/storage/${registration.valid_id_back}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="block"
                                            >
                                                <div className="relative aspect-[3/2] w-full overflow-hidden rounded-lg border-2 border-gray-200 hover:border-blue-400 transition-colors cursor-pointer group">
                                                    <img
                                                        src={`/storage/${registration.valid_id_back}`}
                                                        alt="Valid ID Back"
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                                    />
                                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 flex items-center justify-center">
                                                        <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-50 px-3 py-1 rounded-full text-sm">
                                                            Click to view full size
                                                        </span>
                                                    </div>
                                                </div>
                                            </a>
                                        ) : (
                                            <div className="aspect-[3/2] w-full bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                                                <div className="text-center">
                                                    <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                                                    <p className="text-sm text-gray-500">No ID back uploaded</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Other Documents */}
                                <div className="grid gap-4 md:grid-cols-2">
                                    {[
                                        { label: 'Proof of Residency', file: registration.proof_of_residency },
                                        { label: 'Birth Certificate', file: registration.birth_certificate },
                                    ].map((doc) => (
                                        <div
                                            key={doc.label}
                                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                                        >
                                            <div className="flex items-center gap-3">
                                                {doc.file ? (
                                                    <FileText className="h-5 w-5 text-green-600" />
                                                ) : (
                                                    <AlertCircle className="h-5 w-5 text-gray-400" />
                                                )}
                                                <span className="text-sm font-medium text-gray-900">{doc.label}</span>
                                            </div>
                                            {doc.file && (
                                                <a
                                                    href={`/storage/${doc.file}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
                                                >
                                                    <Download className="h-4 w-4" />
                                                    <span className="text-sm">View</span>
                                                </a>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Registration Timeline */}
                        <div className="bg-white border border-gray-200 rounded-xl p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Calendar className="h-5 w-5 text-gray-600" />
                                <h3 className="text-lg font-semibold text-gray-900">Registration Timeline</h3>
                            </div>
                            <dl className="grid gap-4 md:grid-cols-2">
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <dt className="text-sm font-medium text-gray-500 mb-1">Submitted On</dt>
                                    <dd className="text-base text-gray-900">{registration.created_at}</dd>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <dt className="text-sm font-medium text-gray-500 mb-1">Last Updated</dt>
                                    <dd className="text-base text-gray-900">{registration.updated_at}</dd>
                                </div>
                            </dl>
                        </div>

                        {/* Info Message */}
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                            <div className="flex items-start gap-4">
                                <AlertCircle className="h-6 w-6 text-blue-600 mt-1" />
                                <div>
                                    <h3 className="text-lg font-semibold text-blue-900 mb-2">Need to Update Your Information?</h3>
                                    <p className="text-blue-800">
                                        If you need to update any information on your registration, please visit your local
                                        OSCA office or contact the administrator. Some information updates may require
                                        supporting documents.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* Back Button */}
                <div>
                    <Link href="/dashboard">
                        <Button variant="outline">← Back to Dashboard</Button>
                    </Link>
                </div>
            </div>
        </AppLayout>
    );
}
