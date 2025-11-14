import { FormEvent } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle } from 'lucide-react';

interface Registration {
    id: number;
    registration_id: string;
    full_name: string;
}

interface Props {
    registrations: Registration[];
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
        title: 'Create',
        href: '/admin/senior-citizen-mortuary-applications/create',
    },
];

export default function Create({ registrations }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        senior_citizen_registration_id: '',
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
        notes: '',
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(route('admin.senior-citizen-mortuary-applications.store'), {
            forceFormData: true,
        });
    };

    const handleFileChange = (field: string, file: File | null) => {
        setData(field as any, file);
    };

    const FileInput = ({ label, field, error }: { label: string; field: string; error?: string }) => (
        <div className="space-y-2">
            <Label>{label}</Label>
            <Input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => handleFileChange(field, e.target.files?.[0] || null)}
                className="cursor-pointer"
            />
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
            <Head title="Create Mortuary Application" />
            
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold tracking-tight">Create Mortuary Application</h1>
                    <p className="text-muted-foreground">
                        Upload required documents for mortuary benefit processing
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Senior Citizen Selection */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Senior Citizen Information</CardTitle>
                            <CardDescription>
                                Select the approved senior citizen for this mortuary application
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <Label htmlFor="senior_citizen">Senior Citizen *</Label>
                                <Select
                                    value={data.senior_citizen_registration_id}
                                    onValueChange={(value) => setData('senior_citizen_registration_id', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a senior citizen..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {registrations.map((reg) => (
                                            <SelectItem key={reg.id} value={reg.id.toString()}>
                                                {reg.registration_id} - {reg.full_name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.senior_citizen_registration_id && (
                                    <div className="flex items-center gap-2 text-sm text-destructive">
                                        <AlertCircle className="h-4 w-4" />
                                        {errors.senior_citizen_registration_id}
                                    </div>
                                )}
                                {registrations.length === 0 && (
                                    <div className="flex items-center gap-2 text-sm text-yellow-600 bg-yellow-50 p-3 rounded-md">
                                        <AlertCircle className="h-4 w-4" />
                                        No approved senior citizens available. All approved registrations already have mortuary applications.
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
                                Upload documents in PDF, JPG, JPEG, or PNG format (max 5MB each). All fields are optional.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FileInput 
                                label="OSCA ID (Original)" 
                                field="osca_id_original"
                                error={errors.osca_id_original}
                            />
                            <FileInput 
                                label="Barangay Residency Certificate" 
                                field="brgy_residency_certificate"
                                error={errors.brgy_residency_certificate}
                            />
                            <FileInput 
                                label="Barangay Indigency Certificate" 
                                field="brgy_indigency"
                                error={errors.brgy_indigency}
                            />
                            <FileInput 
                                label="Death Certificate" 
                                field="death_certificate"
                                error={errors.death_certificate}
                            />
                            <FileInput 
                                label="Affidavit of Next of Kin" 
                                field="affidavit_of_next_of_kin"
                                error={errors.affidavit_of_next_of_kin}
                            />
                            <FileInput 
                                label="OSCA Certificate" 
                                field="osca_certificate"
                                error={errors.osca_certificate}
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
                            />
                            <FileInput 
                                label="Birth Certificate of Children" 
                                field="birth_certificate_of_children"
                                error={errors.birth_certificate_of_children}
                            />
                            <FileInput 
                                label="Valid ID of Children" 
                                field="valid_id_of_children"
                                error={errors.valid_id_of_children}
                            />
                            <FileInput 
                                label="Valid ID of Claimants" 
                                field="valid_id_of_claimants"
                                error={errors.valid_id_of_claimants}
                            />
                            <FileInput 
                                label="Waiver / Authority to Claim" 
                                field="waiver_authority_to_claim"
                                error={errors.waiver_authority_to_claim}
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
                        <Link href={route('admin.senior-citizen-mortuary-applications.index')}>
                            <Button type="button" variant="outline">
                                Cancel
                            </Button>
                        </Link>
                        <Button type="submit" disabled={processing || registrations.length === 0}>
                            {processing ? 'Creating...' : 'Create Application'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
