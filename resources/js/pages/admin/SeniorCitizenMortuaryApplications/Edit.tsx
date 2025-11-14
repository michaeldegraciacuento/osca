import { FormEvent } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { AlertCircle } from 'lucide-react';

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
        title: 'Edit',
        href: '#',
    },
];

export default function Edit({ application }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        status: application.status,
        osca_id_original: null as File | null,
        brgy_residency_certificate: null as File | null,
        brgy_indigency: null as File | null,
        death_certificate: null as File | null,
        affidavit_of_next_of_kin: null as File | null,
        osca_certificate: null as File | null,
        marriage_contract: null as File | null,
        birth_certificate_of_children: null as File | null,
        valid_id_of_children: null as File | null,
        valid_id_of_claimants: null as File | null,
        waiver_authority_to_claim: null as File | null,
        notes: application.notes || '',
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(route('admin.senior-citizen-mortuary-applications.update', application.id), {
            forceFormData: true,
        });
    };

    const handleFileChange = (field: string, file: File | null) => {
        setData(field as any, file);
    };

    const getStatusLabel = (status: string) => {
        const labels: Record<string, string> = {
            'pending': 'Pending',
            'under_review': 'Under Review',
            'approved': 'Approved',
            'rejected': 'Rejected',
            'released': 'Released',
        };
        return labels[status] || status;
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
            <Head title={`Edit Mortuary Application - ${application.registration.registration_id}`} />
            
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold tracking-tight">Edit Mortuary Application</h1>
                    <p className="text-muted-foreground">
                        Update documents for {application.registration.full_name} ({application.registration.registration_id})
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Senior Citizen Info (Read-only) */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Senior Citizen Information</CardTitle>
                            <CardDescription>This information cannot be changed</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-muted-foreground">Registration ID</Label>
                                    <div className="text-lg font-medium">{application.registration.registration_id}</div>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Name</Label>
                                    <div className="text-lg font-medium">{application.registration.full_name}</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Application Status */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Application Status</CardTitle>
                            <CardDescription>Update the status of this mortuary application</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <Label>Status</Label>
                                <Select 
                                    value={data.status}
                                    onValueChange={(value) => setData('status', value)}
                                >
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
                                {errors.status && (
                                    <div className="flex items-center gap-2 text-sm text-destructive">
                                        <AlertCircle className="h-4 w-4" />
                                        {errors.status}
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Required Documents */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Required Documents</CardTitle>
                            <CardDescription>
                                Upload new files to replace existing documents. PDF, JPG, JPEG, or PNG format (max 5MB each).
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FileInput 
                                label="OSCA ID (Original)" 
                                field="osca_id_original"
                                error={errors.osca_id_original}
                                currentFile={application.osca_id_original}
                            />
                            <FileInput 
                                label="Barangay Residency Certificate" 
                                field="brgy_residency_certificate"
                                error={errors.brgy_residency_certificate}
                                currentFile={application.brgy_residency_certificate}
                            />
                            <FileInput 
                                label="Barangay Indigency Certificate" 
                                field="brgy_indigency"
                                error={errors.brgy_indigency}
                                currentFile={application.brgy_indigency}
                            />
                            <FileInput 
                                label="Death Certificate" 
                                field="death_certificate"
                                error={errors.death_certificate}
                                currentFile={application.death_certificate}
                            />
                            <FileInput 
                                label="Affidavit of Next of Kin" 
                                field="affidavit_of_next_of_kin"
                                error={errors.affidavit_of_next_of_kin}
                                currentFile={application.affidavit_of_next_of_kin}
                            />
                            <FileInput 
                                label="OSCA Certificate" 
                                field="osca_certificate"
                                error={errors.osca_certificate}
                                currentFile={application.osca_certificate}
                            />
                        </CardContent>
                    </Card>

                    {/* Claimants Documents */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Claimants Documents</CardTitle>
                            <CardDescription>
                                Documents required from claimants/beneficiaries
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FileInput 
                                label="Marriage Contract" 
                                field="marriage_contract"
                                error={errors.marriage_contract}
                                currentFile={application.marriage_contract}
                            />
                            <FileInput 
                                label="Birth Certificate of Children" 
                                field="birth_certificate_of_children"
                                error={errors.birth_certificate_of_children}
                                currentFile={application.birth_certificate_of_children}
                            />
                            <FileInput 
                                label="Valid ID of Children" 
                                field="valid_id_of_children"
                                error={errors.valid_id_of_children}
                                currentFile={application.valid_id_of_children}
                            />
                            <FileInput 
                                label="Valid ID of Claimants" 
                                field="valid_id_of_claimants"
                                error={errors.valid_id_of_claimants}
                                currentFile={application.valid_id_of_claimants}
                            />
                            <FileInput 
                                label="Waiver / Authority to Claim" 
                                field="waiver_authority_to_claim"
                                error={errors.waiver_authority_to_claim}
                                currentFile={application.waiver_authority_to_claim}
                            />
                        </CardContent>
                    </Card>

                    {/* Notes */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Additional Notes</CardTitle>
                            <CardDescription>Optional notes or comments</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <textarea
                                value={data.notes}
                                onChange={(e) => setData('notes', e.target.value)}
                                placeholder="Add any additional notes or comments..."
                                rows={4}
                                className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                            {errors.notes && (
                                <div className="flex items-center gap-2 text-sm text-destructive mt-2">
                                    <AlertCircle className="h-4 w-4" />
                                    {errors.notes}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    <div className="flex justify-end gap-4">
                        <Link href={route('admin.senior-citizen-mortuary-applications.show', application.id)}>
                            <Button type="button" variant="outline">
                                Cancel
                            </Button>
                        </Link>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Updating...' : 'Update Application'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
