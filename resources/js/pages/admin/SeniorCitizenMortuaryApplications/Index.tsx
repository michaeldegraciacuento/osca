import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, Trash2, Search, Plus, Pencil } from 'lucide-react';
import { usePermissions } from '@/hooks/usePermissions';

interface Registration {
    id: number;
    registration_id: string;
    full_name: string;
}

interface MortuaryApplication {
    id: number;
    registration: Registration;
    status: string;
    status_label: string;
    reviewed_at: string | null;
    created_at: string;
}

interface Stats {
    total: number;
    pending: number;
    under_review: number;
    approved: number;
    rejected: number;
    released: number;
}

interface Props {
    applications: {
        data: MortuaryApplication[];
        links: any[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    filters: {
        search?: string;
        status?: string;
    };
    stats: Stats;
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
];

export default function Index({ applications, filters, stats }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');
    const { can } = usePermissions();

    const handleFilter = () => {
        router.get(route('admin.senior-citizen-mortuary-applications.index'), 
            { search: search || undefined, status: status || undefined },
            { preserveState: true, preserveScroll: true }
        );
    };

    const handleClearFilters = () => {
        setSearch('');
        setStatus('');
        router.get(route('admin.senior-citizen-mortuary-applications.index'));
    };

    const handleDelete = (id: number, registrationId: string) => {
        if (confirm(`Are you sure you want to delete the mortuary application for ${registrationId}?`)) {
            router.delete(route('admin.senior-citizen-mortuary-applications.destroy', id), {
                preserveScroll: true,
            });
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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Mortuary Applications" />
            
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold tracking-tight">Mortuary Applications</h1>
                        <p className="text-muted-foreground">
                            Manage mortuary benefit applications for deceased senior citizens
                        </p>
                    </div>
                    {can('senior_citizen_mortuary_applications.create') && (
                        <Link href={route('admin.senior-citizen-mortuary-applications.create')}>
                            <Button>
                                <Plus className="h-4 w-4 mr-2" />
                                New Application
                            </Button>
                        </Link>
                    )}
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6 mb-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Under Review</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">{stats.under_review}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Approved</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Released</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-purple-600">{stats.released}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle>Filters</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <Input
                                    placeholder="Search by Registration ID or Name..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleFilter()}
                                />
                            </div>
                            <Select value={status || undefined} onValueChange={(value) => setStatus(value === "all" ? "" : value)}>
                                <SelectTrigger className="w-[200px]">
                                    <SelectValue placeholder="All Statuses" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="under_review">Under Review</SelectItem>
                                    <SelectItem value="approved">Approved</SelectItem>
                                    <SelectItem value="rejected">Rejected</SelectItem>
                                    <SelectItem value="released">Released</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button onClick={handleFilter}>
                                <Search className="h-4 w-4 mr-2" />
                                Search
                            </Button>
                            <Button variant="outline" onClick={handleClearFilters}>
                                Clear
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Applications Table */}
                <Card>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Registration ID</TableHead>
                                <TableHead>Senior Citizen Name</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Submitted Date</TableHead>
                                <TableHead>Reviewed Date</TableHead>
                                {(can('senior_citizen_mortuary_applications.view') || can('senior_citizen_mortuary_applications.edit') || can('senior_citizen_mortuary_applications.delete')) && (
                                    <TableHead className="text-right">Actions</TableHead>
                                )}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {applications.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={(can('senior_citizen_mortuary_applications.view') || can('senior_citizen_mortuary_applications.edit') || can('senior_citizen_mortuary_applications.delete')) ? 6 : 5} className="text-center py-12 text-muted-foreground">
                                        No mortuary applications found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                applications.data.map((application) => (
                                    <TableRow key={application.id}>
                                        <TableCell className="font-medium">
                                            {application.registration.registration_id}
                                        </TableCell>
                                        <TableCell>{application.registration.full_name}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={getStatusColor(application.status)}>
                                                {application.status_label}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {new Date(application.created_at).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                            })}
                                        </TableCell>
                                        <TableCell>
                                            {application.reviewed_at
                                                ? new Date(application.reviewed_at).toLocaleDateString('en-US', {
                                                      year: 'numeric',
                                                      month: 'short',
                                                      day: 'numeric',
                                                  })
                                                : '-'}
                                        </TableCell>
                                        {(can('senior_citizen_mortuary_applications.view') || can('senior_citizen_mortuary_applications.edit') || can('senior_citizen_mortuary_applications.delete')) && (
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    {can('senior_citizen_mortuary_applications.view') && (
                                                        <Link href={route('admin.senior-citizen-mortuary-applications.show', application.id)}>
                                                            <Button variant="ghost" size="sm">
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                    )}
                                                    {can('senior_citizen_mortuary_applications.edit') && (
                                                        <Link href={route('admin.senior-citizen-mortuary-applications.edit', application.id)}>
                                                            <Button variant="ghost" size="sm">
                                                                <Pencil className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                    )}
                                                    {can('senior_citizen_mortuary_applications.delete') && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleDelete(application.id, application.registration.registration_id)}
                                                        >
                                                            <Trash2 className="h-4 w-4 text-red-500" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </TableCell>
                                        )}
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>

                    {/* Pagination */}
                    {applications.last_page > 1 && (
                        <div className="flex items-center justify-between px-4 py-4 border-t">
                            <div className="text-sm text-muted-foreground">
                                Page {applications.current_page} of {applications.last_page}
                            </div>
                            <div className="flex gap-2">
                                {applications.links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url || '#'}
                                        preserveState
                                        className={`px-3 py-1 rounded text-sm ${
                                            link.active
                                                ? 'bg-primary text-primary-foreground'
                                                : link.url
                                                ? 'bg-secondary hover:bg-secondary/80'
                                                : 'opacity-50 cursor-not-allowed'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </AppLayout>
    );
}
