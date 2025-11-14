import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { FileText, Upload, CheckCircle, XCircle, Calendar, Clock, AlertCircle, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface Application {
    id: number;
    status: string;
    status_label: string;
    status_badge: string;
    notes: string | null;
    reviewed_at: string | null;
    created_at: string;
    osca_id_original: string | null;
    brgy_residency_certificate: string | null;
    brgy_indigency: string | null;
    death_certificate: string | null;
    affidavit_of_next_of_kin: string | null;
    osca_certificate: string | null;
    marriage_contract: string | null;
    birth_certificate_of_children: string | null;
    valid_id_of_children: string | null;
    valid_id_of_claimants: string | null;
    waiver_authority_to_claim: string | null;
}

interface Registration {
    id: number;
    registration_id: string;
    full_name: string;
}

interface Props {
    application: Application;
    registration: Registration;
}

const breadcrumbs = (appId: number): BreadcrumbItem[] => [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'My Mortuary Applications',
        href: '/my-mortuary-applications',
    },
    {
        title: `Application #${appId}`,
        href: `/my-mortuary-applications/${appId}`,
    },
];

const documentFields = [
    { key: 'osca_id_original', label: 'OSCA ID (Original)', required: true },
    { key: 'brgy_residency_certificate', label: 'Barangay Residency Certificate', required: true },
    { key: 'brgy_indigency', label: 'Barangay Indigency Certificate', required: true },
    { key: 'death_certificate', label: 'Death Certificate', required: true },
    { key: 'affidavit_of_next_of_kin', label: 'Affidavit of Next of Kin', required: true },
    { key: 'osca_certificate', label: 'OSCA Certificate', required: true },
    { key: 'marriage_contract', label: 'Marriage Contract', required: false },
    { key: 'birth_certificate_of_children', label: 'Birth Certificate of Children', required: false },
    { key: 'valid_id_of_children', label: 'Valid ID of Children', required: false },
    { key: 'valid_id_of_claimants', label: 'Valid ID of Claimants', required: true },
    { key: 'waiver_authority_to_claim', label: 'Waiver/Authority to Claim', required: false },
];

export default function ShowMyMortuaryApplication({ application, registration }: Props) {
    const [uploadingField, setUploadingField] = useState<string | null>(null);

    const handleFileUpload = (documentField: string, file: File) => {
        setUploadingField(documentField);
        
        router.post(
            `/my-mortuary-applications/${application.id}/upload`,
            {
                document_field: documentField,
                file: file,
            },
            {
                onFinish: () => {
                    setUploadingField(null);
                },
            }
        );
    };

    const canUpload = ['pending', 'under_review'].includes(application.status);

    const requiredDocs = documentFields.filter(d => d.required);
    const optionalDocs = documentFields.filter(d => !d.required);
    
    const uploadedRequired = requiredDocs.filter(d => application[d.key as keyof Application]).length;
    const totalRequired = requiredDocs.length;
    const allRequiredUploaded = uploadedRequired === totalRequired;

    return (
        <AppLayout breadcrumbs={breadcrumbs(application.id)}>
            <Head title={`Application #${application.id}`} />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4 md:p-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <FileText className="h-8 w-8 text-blue-600" />
                            <h1 className="text-3xl font-bold text-gray-900">
                                Application #{application.id}
                            </h1>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                Created: {application.created_at}
                            </span>
                            {application.reviewed_at && (
                                <span className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    Reviewed: {application.reviewed_at}
                                </span>
                            )}
                        </div>
                    </div>
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${application.status_badge}`}>
                        {application.status_label}
                    </span>
                </div>

                {/* Registration Info */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-blue-100 rounded-full">
                            <FileText className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">{registration.full_name}</h3>
                            <p className="text-sm text-gray-600">Registration ID: {registration.registration_id}</p>
                        </div>
                    </div>
                </div>

                {/* Status Message */}
                {application.notes && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                        <div className="flex items-start gap-4">
                            <AlertCircle className="h-6 w-6 text-blue-600 mt-1" />
                            <div>
                                <h3 className="text-lg font-semibold text-blue-900 mb-2">Notes from Reviewer</h3>
                                <p className="text-blue-800">{application.notes}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Progress Banner */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">Required Documents Progress</h3>
                        <span className="text-lg font-bold text-gray-900">
                            {uploadedRequired} / {totalRequired}
                        </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                            className={`h-3 rounded-full transition-all ${
                                allRequiredUploaded
                                    ? 'bg-green-600'
                                    : uploadedRequired >= totalRequired / 2
                                    ? 'bg-blue-600'
                                    : 'bg-yellow-600'
                            }`}
                            style={{ width: `${(uploadedRequired / totalRequired) * 100}%` }}
                        />
                    </div>
                    {allRequiredUploaded ? (
                        <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                            <CheckCircle className="h-4 w-4" />
                            All required documents uploaded!
                        </p>
                    ) : (
                        <p className="text-sm text-gray-600 mt-2">
                            {totalRequired - uploadedRequired} required document(s) remaining
                        </p>
                    )}
                </div>

                {/* Required Documents */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Required Documents</h3>
                    <div className="space-y-4">
                        {requiredDocs.map((doc) => {
                            const isUploaded = application[doc.key as keyof Application];
                            const isUploading = uploadingField === doc.key;
                            
                            return (
                                <div
                                    key={doc.key}
                                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                                >
                                    <div className="flex items-center gap-3 flex-1">
                                        {isUploaded ? (
                                            <CheckCircle className="h-5 w-5 text-green-600" />
                                        ) : (
                                            <XCircle className="h-5 w-5 text-gray-400" />
                                        )}
                                        <div>
                                            <p className="font-medium text-gray-900">{doc.label}</p>
                                            {isUploaded && (
                                                <p className="text-xs text-green-600">✓ Uploaded</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {isUploaded && (
                                            <a
                                                href={`/storage/${application[doc.key as keyof Application]}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:text-blue-700"
                                            >
                                                <Download className="h-5 w-5" />
                                            </a>
                                        )}
                                        {canUpload && (
                                            <label className="cursor-pointer">
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    accept=".pdf,.jpg,.jpeg,.png"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) {
                                                            handleFileUpload(doc.key, file);
                                                        }
                                                    }}
                                                    disabled={isUploading}
                                                />
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    disabled={isUploading}
                                                    asChild
                                                >
                                                    <span>
                                                        {isUploading ? (
                                                            <>Uploading...</>
                                                        ) : isUploaded ? (
                                                            <>Replace</>
                                                        ) : (
                                                            <>
                                                                <Upload className="h-4 w-4 mr-1" />
                                                                Upload
                                                            </>
                                                        )}
                                                    </span>
                                                </Button>
                                            </label>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Optional Documents */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Optional Documents</h3>
                    <p className="text-sm text-gray-600 mb-4">These documents may be required depending on your specific case.</p>
                    <div className="space-y-4">
                        {optionalDocs.map((doc) => {
                            const isUploaded = application[doc.key as keyof Application];
                            const isUploading = uploadingField === doc.key;
                            
                            return (
                                <div
                                    key={doc.key}
                                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                                >
                                    <div className="flex items-center gap-3 flex-1">
                                        {isUploaded ? (
                                            <CheckCircle className="h-5 w-5 text-green-600" />
                                        ) : (
                                            <XCircle className="h-5 w-5 text-gray-400" />
                                        )}
                                        <div>
                                            <p className="font-medium text-gray-900">{doc.label}</p>
                                            {isUploaded && (
                                                <p className="text-xs text-green-600">✓ Uploaded</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {isUploaded && (
                                            <a
                                                href={`/storage/${application[doc.key as keyof Application]}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:text-blue-700"
                                            >
                                                <Download className="h-5 w-5" />
                                            </a>
                                        )}
                                        {canUpload && (
                                            <label className="cursor-pointer">
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    accept=".pdf,.jpg,.jpeg,.png"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) {
                                                            handleFileUpload(doc.key, file);
                                                        }
                                                    }}
                                                    disabled={isUploading}
                                                />
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    disabled={isUploading}
                                                    asChild
                                                >
                                                    <span>
                                                        {isUploading ? (
                                                            <>Uploading...</>
                                                        ) : isUploaded ? (
                                                            <>Replace</>
                                                        ) : (
                                                            <>
                                                                <Upload className="h-4 w-4 mr-1" />
                                                                Upload
                                                            </>
                                                        )}
                                                    </span>
                                                </Button>
                                            </label>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Info Box */}
                {canUpload && (
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                        <h3 className="font-semibold text-gray-900 mb-2">Upload Guidelines</h3>
                        <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Accepted formats: PDF, JPG, JPEG, PNG</li>
                            <li>• Maximum file size: 5MB</li>
                            <li>• Ensure documents are clear and legible</li>
                            <li>• All required documents must be uploaded before submission</li>
                        </ul>
                    </div>
                )}

                {/* Back Button */}
                <div>
                    <Link href="/my-mortuary-applications">
                        <Button variant="outline">← Back to Applications</Button>
                    </Link>
                </div>
            </div>
        </AppLayout>
    );
}
