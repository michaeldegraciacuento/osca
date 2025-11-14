import { FormEvent, useState } from 'react';
import { Head, useForm, router, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Trash2, AlertCircle, Pencil } from 'lucide-react';
import { usePermissions } from '@/hooks/usePermissions';

interface Registration {
    id: number;
    registration_id: string;
    full_name: string;
}

interface Reviewer {
    id: number;
    name: string;
}

interface MortuaryApplication {
    id: number;
    registration: Registration;
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
    status: string;
    status_label: string;
    notes: string | null;
    reviewed_at: string | null;
    reviewed_by: Reviewer | null;
    created_at: string;
    updated_at: string;
}

interface Props {
    application: MortuaryApplication;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Mortuary Applications',
        href: '/admin/senior-citizen-mortuary-applications',
    },
    {
        title: 'Details',
        href: '#',
    },
];

export default function Show({ application }: Props) {
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
    const { can } = usePermissions();
    
    const { data, setData, patch, processing } = useForm({
        status: application.status,
        notes: application.notes || '',
    });

    const handleStatusUpdate = (e: FormEvent) => {
        e.preventDefault();
        setIsUpdatingStatus(true);
        patch(route('admin.senior-citizen-mortuary-applications.update-status', application.id), {
            preserveScroll: true,
            onSuccess: () => setIsUpdatingStatus(false),
            onError: () => setIsUpdatingStatus(false),
        });
    };

    const handleDelete = () => {
        if (confirm(`Are you sure you want to delete this mortuary application for ${application.registration.registration_id}?`)) {
            router.delete(route('admin.senior-citizen-mortuary-applications.destroy', application.id));
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
            case 'released':
                return 'bg-purple-100 text-purple-800 border-purple-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const DocumentField = ({ label, path }: { label: string; path: string | null }) => {
        if (!path) {
            return (
                <Card className="bg-muted/50">
                    <CardContent className="p-4">
                        <div className="text-sm font-medium mb-2">{label}</div>
                        <div className="text-sm text-muted-foreground italic">Not uploaded</div>
                    </CardContent>
                </Card>
            );
        }

        const fileUrl = `/storage/${path}`;
        const isPdf = path.toLowerCase().endsWith('.pdf');

        return (
            <Card>
                <CardContent className="p-4">
                    <div className="text-sm font-medium mb-2">{label}</div>
                    {isPdf ? (
                        <div className="flex items-center gap-2">
                            <FileText className="h-8 w-8 text-red-500" />
                            <a
                                href={fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline text-sm"
                            >
                                View PDF Document
                            </a>
                        </div>
                    ) : (
                        <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                            <img
                                src={fileUrl}
                                alt={label}
                                className="max-w-full h-auto rounded border cursor-pointer hover:opacity-90 transition"
                            />
                        </a>
                    )}
                </CardContent>
            </Card>
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Mortuary Application - ${application.registration.registration_id}`} />
            
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Mortuary Application Details</h1>
                        <p className="text-muted-foreground">
                            View and manage mortuary application for {application.registration.full_name}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        {can('senior_citizen_mortuary_applications.edit') && (
                            <Link href={route('admin.senior-citizen-mortuary-applications.edit', application.id)}>
                                <Button variant="outline">
                                    <Pencil className="h-4 w-4 mr-2" />
                                    Edit
                                </Button>
                            </Link>
                        )}
                        {can('senior_citizen_mortuary_applications.delete') && (
                            <Button variant="destructive" onClick={handleDelete}>
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                            </Button>
                        )}
                    </div>
                </div>

                {/* Application Info */}
                <Card>
                    <CardHeader>
                        <CardTitle>Application Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <Label className="text-muted-foreground">Registration ID</Label>
                                <div className="text-lg font-medium">{application.registration.registration_id}</div>
                            </div>
                            <div>
                                <Label className="text-muted-foreground">Senior Citizen Name</Label>
                                <div className="text-lg font-medium">{application.registration.full_name}</div>
                            </div>
                            <div>
                                <Label className="text-muted-foreground">Status</Label>
                                <div>
                                    <Badge variant="outline" className={getStatusColor(application.status)}>
                                        {application.status_label}
                                    </Badge>
                                </div>
                            </div>
                            <div>
                                <Label className="text-muted-foreground">Submitted Date</Label>
                                <div className="text-base">
                                    {new Date(application.created_at).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </div>
                            </div>
                            {application.reviewed_at && (
                                <>
                                    <div>
                                        <Label className="text-muted-foreground">Reviewed Date</Label>
                                        <div className="text-base">
                                            {new Date(application.reviewed_at).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </div>
                                    </div>
                                    <div>
                                        <Label className="text-muted-foreground">Reviewed By</Label>
                                        <div className="text-base">{application.reviewed_by?.name || 'N/A'}</div>
                                    </div>
                                </>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Documents */}
                <Card>
                    <CardHeader>
                        <CardTitle>Uploaded Documents</CardTitle>
                        <CardDescription>
                            Click on images to view full size, or click PDF links to open documents
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <DocumentField label="OSCA ID (Original)" path={application.osca_id_original} />
                            <DocumentField label="Barangay Residency Certificate" path={application.brgy_residency_certificate} />
                            <DocumentField label="Barangay Indigency Certificate" path={application.brgy_indigency} />
                            <DocumentField label="Death Certificate" path={application.death_certificate} />
                            <DocumentField label="Affidavit of Next of Kin" path={application.affidavit_of_next_of_kin} />
                            <DocumentField label="OSCA Certificate" path={application.osca_certificate} />
                            <DocumentField label="Marriage Contract" path={application.marriage_contract} />
                            <DocumentField label="Birth Certificate of Children" path={application.birth_certificate_of_children} />
                            <DocumentField label="Valid ID of Children" path={application.valid_id_of_children} />
                            <DocumentField label="Valid ID of Claimants" path={application.valid_id_of_claimants} />
                            <DocumentField label="Waiver / Authority to Claim" path={application.waiver_authority_to_claim} />
                        </div>
                    </CardContent>
                </Card>

                {/* Status Update Form */}
                {can('senior_citizen_mortuary_applications.edit') && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Update Status</CardTitle>
                            <CardDescription>Change application status and add notes</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleStatusUpdate} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="status">Status</Label>
                                    <Select value={data.status} onValueChange={(value) => setData('status', value)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="pending">Pending</SelectItem>
                                            <SelectItem value="under_review">Under Review</SelectItem>
                                            <SelectItem value="approved">Approved</SelectItem>
                                            <SelectItem value="rejected">Rejected</SelectItem>
                                            <SelectItem value="released">Released</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="notes">Notes</Label>
                                    <textarea
                                        id="notes"
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                        rows={4}
                                        className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        placeholder="Add notes about the status change..."
                                    />
                                </div>
                                <div className="flex justify-end gap-3">
                                    <Link href={route('admin.senior-citizen-mortuary-applications.index')}>
                                        <Button type="button" variant="outline">
                                            Back to List
                                        </Button>
                                    </Link>
                                    <Button type="submit" disabled={processing || isUpdatingStatus}>
                                        {processing || isUpdatingStatus ? 'Updating...' : 'Update Status'}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
