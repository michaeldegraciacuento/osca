import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { FileText, Calendar, CheckCircle, XCircle, Clock, Plus, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'My Mortuary Applications',
        href: '/my-mortuary-applications',
    },
];

interface Application {
    id: number;
    status: string;
    status_label: string;
    status_badge: string;
    notes: string | null;
    reviewed_at: string | null;
    created_at: string;
    osca_id_original: boolean;
    brgy_residency_certificate: boolean;
    brgy_indigency: boolean;
    death_certificate: boolean;
    affidavit_of_next_of_kin: boolean;
    osca_certificate: boolean;
    marriage_contract: boolean;
    birth_certificate_of_children: boolean;
    valid_id_of_children: boolean;
    valid_id_of_claimants: boolean;
    waiver_authority_to_claim: boolean;
}

interface Registration {
    id: number;
    registration_id: string;
    full_name: string;
}

interface Props {
    applications: Application[];
    hasRegistration: boolean;
    registration: Registration | null;
}

export default function MyMortuaryApplications({ applications, hasRegistration, registration }: Props) {
    const handleCreateApplication = () => {
        router.post('/my-mortuary-applications', {});
    };

    const getDocumentProgress = (app: Application) => {
        const documents = [
            app.osca_id_original,
            app.brgy_residency_certificate,
            app.brgy_indigency,
            app.death_certificate,
            app.affidavit_of_next_of_kin,
            app.osca_certificate,
            app.marriage_contract,
            app.birth_certificate_of_children,
            app.valid_id_of_children,
            app.valid_id_of_claimants,
            app.waiver_authority_to_claim,
        ];
        const uploaded = documents.filter(Boolean).length;
        const total = documents.length;
        return { uploaded, total, percentage: Math.round((uploaded / total) * 100) };
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My Mortuary Applications" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4 md:p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">My Mortuary Applications</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            View and manage your mortuary assistance applications
                        </p>
                    </div>
                    {hasRegistration && applications.length === 0 && (
                        <Button onClick={handleCreateApplication} className="flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            New Application
                        </Button>
                    )}
                </div>

                {/* No Registration Warning */}
                {!hasRegistration && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                        <div className="flex items-start gap-4">
                            <AlertCircle className="h-6 w-6 text-yellow-600 mt-1" />
                            <div>
                                <h3 className="text-lg font-semibold text-yellow-900 mb-2">
                                    No Senior Citizen Registration Found
                                </h3>
                                <p className="text-yellow-800 mb-4">
                                    You need to have a senior citizen registration before you can apply for mortuary assistance.
                                    Please contact your local OSCA office to complete your registration first.
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

                {/* Registration Info */}
                {hasRegistration && registration && (
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
                )}

                {/* Applications List */}
                {applications.length > 0 ? (
                    <div className="grid gap-4">
                        {applications.map((app) => {
                            const progress = getDocumentProgress(app);
                            return (
                                <Link
                                    key={app.id}
                                    href={`/my-mortuary-applications/${app.id}`}
                                    className="block"
                                >
                                    <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <FileText className="h-5 w-5 text-blue-600" />
                                                    <h3 className="text-lg font-semibold text-gray-900">
                                                        Application #{app.id}
                                                    </h3>
                                                </div>
                                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="h-4 w-4" />
                                                        {app.created_at}
                                                    </span>
                                                    {app.reviewed_at && (
                                                        <span className="flex items-center gap-1">
                                                            <Clock className="h-4 w-4" />
                                                            Reviewed: {app.reviewed_at}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${app.status_badge}`}>
                                                {app.status_label}
                                            </span>
                                        </div>

                                        {/* Document Progress */}
                                        <div className="mb-4">
                                            <div className="flex items-center justify-between text-sm mb-2">
                                                <span className="text-gray-600 font-medium">Document Upload Progress</span>
                                                <span className="text-gray-900 font-semibold">
                                                    {progress.uploaded} / {progress.total} ({progress.percentage}%)
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className={`h-2 rounded-full transition-all ${
                                                        progress.percentage === 100
                                                            ? 'bg-green-600'
                                                            : progress.percentage >= 50
                                                            ? 'bg-blue-600'
                                                            : 'bg-yellow-600'
                                                    }`}
                                                    style={{ width: `${progress.percentage}%` }}
                                                />
                                            </div>
                                        </div>

                                        {/* Notes */}
                                        {app.notes && (
                                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                                <p className="text-sm text-gray-600">
                                                    <span className="font-semibold text-gray-700">Notes: </span>
                                                    {app.notes}
                                                </p>
                                            </div>
                                        )}

                                        {/* Action Hint */}
                                        {app.status === 'pending' && progress.percentage < 100 && (
                                            <div className="mt-4 flex items-center gap-2 text-sm text-blue-600">
                                                <AlertCircle className="h-4 w-4" />
                                                <span>Click to upload remaining documents</span>
                                            </div>
                                        )}
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                ) : (
                    hasRegistration && (
                        <div className="text-center py-16">
                            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Applications Yet</h3>
                            <p className="text-gray-500 mb-6">
                                You haven't created any mortuary assistance applications yet.
                            </p>
                            <Button onClick={handleCreateApplication} className="flex items-center gap-2 mx-auto">
                                <Plus className="h-4 w-4" />
                                Create Your First Application
                            </Button>
                        </div>
                    )
                )}
            </div>
        </AppLayout>
    );
}
