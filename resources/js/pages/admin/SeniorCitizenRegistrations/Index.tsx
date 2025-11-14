import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, MoreHorizontal, Search, Filter, Download, CheckCircle, XCircle, Clock, AlertCircle, FileText, Pencil } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { usePermissions } from '@/hooks/usePermissions';

interface Registration {
    id: number;
    registration_id: string;
    full_name: string;
    email: string;
    contact_number: string;
    age: number;
    gender: string;
    barangay: string;
    status: 'pending' | 'under_review' | 'approved' | 'rejected';
    status_label: string;
    status_badge: string;
    created_at: string;
    reviewed_at?: string;
}

interface PaginationData {
    data: Registration[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
}

interface Props {
    registrations: PaginationData;
    filters: {
        search?: string;
        status?: string;
        barangay?: string;
    };
    barangays: string[];
    stats: {
        total: number;
        pending: number;
        under_review: number;
        approved: number;
        rejected: number;
    };
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
];

export default function Index({ registrations, filters, barangays, stats }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');
    const [barangay, setBarangay] = useState(filters.barangay || '');
    const { can } = usePermissions();

    const handleFilter = () => {
        router.get('/admin/senior-citizen-registrations', {
            search: search || undefined,
            status: status || undefined,
            barangay: barangay || undefined,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleClearFilters = () => {
        setSearch('');
        setStatus('');
        setBarangay('');
        router.get('/admin/senior-citizen-registrations');
    };

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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Senior Citizen Registrations" />
            
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold tracking-tight">Senior Citizen Registrations</h1>
                        <p className="text-muted-foreground">
                            Manage and review senior citizen registration applications
                        </p>
                    </div>
                    <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 mb-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Registrations</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending</CardTitle>
                            <Clock className="h-4 w-4 text-yellow-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Under Review</CardTitle>
                            <AlertCircle className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">{stats.under_review}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Approved</CardTitle>
                            <CheckCircle className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
                            <XCircle className="h-4 w-4 text-red-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="text-lg">Filters</CardTitle>
                        <CardDescription>Filter registrations by search term, status, or barangay</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search by name, email, or registration ID..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="pl-8"
                                    />
                                </div>
                            </div>
                            <Select value={status} onValueChange={setStatus}>
                                <SelectTrigger className="w-full md:w-[180px]">
                                    <SelectValue placeholder="Filter by status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="under_review">Under Review</SelectItem>
                                    <SelectItem value="approved">Approved</SelectItem>
                                    <SelectItem value="rejected">Rejected</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={barangay} onValueChange={setBarangay}>
                                <SelectTrigger className="w-full md:w-[180px]">
                                    <SelectValue placeholder="Filter by barangay" />
                                </SelectTrigger>
                                <SelectContent>
                                    {barangays.map((bg) => (
                                        <SelectItem key={bg} value={bg}>{bg}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <div className="flex gap-2">
                                <Button onClick={handleFilter}>
                                    <Filter className="h-4 w-4 mr-2" />
                                    Apply
                                </Button>
                                <Button variant="outline" onClick={handleClearFilters}>
                                    Clear
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Registrations</CardTitle>
                        <CardDescription>
                            A list of all senior citizen registration applications
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Registration ID</TableHead>
                                    <TableHead>Applicant</TableHead>
                                    <TableHead>Contact</TableHead>
                                    <TableHead>Barangay</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Submitted</TableHead>
                                    <TableHead className="w-[100px]">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {registrations.data.map((registration) => (
                                    <TableRow key={registration.id}>
                                        <TableCell className="font-mono text-sm">
                                            <div className="flex items-center gap-2">
                                                <FileText className="h-4 w-4 text-muted-foreground" />
                                                {registration.registration_id}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <div className="font-medium">{registration.full_name}</div>
                                                <div className="text-sm text-muted-foreground">{registration.email}</div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {registration.contact_number}
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {registration.barangay}
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={getStatusColor(registration.status)}>
                                                {getStatusIcon(registration.status)}
                                                <span className="ml-1">{registration.status_label}</span>
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {new Date(registration.created_at).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            {(can('senior_citizen_registrations.view') || can('senior_citizen_registrations.edit')) && (
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        {can('senior_citizen_registrations.view') && (
                                                            <DropdownMenuItem asChild>
                                                                <Link href={`/admin/senior-citizen-registrations/${registration.id}`}>
                                                                    <Eye className="mr-2 h-4 w-4" />
                                                                    View Details
                                                                </Link>
                                                            </DropdownMenuItem>
                                                        )}
                                                        {can('senior_citizen_registrations.edit') && (
                                                            <DropdownMenuItem asChild>
                                                                <Link href={`/admin/senior-citizen-registrations/${registration.id}/edit`}>
                                                                    <Pencil className="mr-2 h-4 w-4" />
                                                                    Edit Registration
                                                                </Link>
                                                            </DropdownMenuItem>
                                                        )}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        {registrations.data.length === 0 && (
                            <div className="text-center py-8">
                                <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                                <h3 className="mt-2 text-sm font-semibold">No registrations found</h3>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    No registration applications match your current filters.
                                </p>
                                <div className="mt-6">
                                    <Button variant="outline" onClick={handleClearFilters}>
                                        Clear Filters
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Pagination */}
                        {registrations.last_page > 1 && (
                            <div className="flex items-center justify-between mt-4 pt-4 border-t">
                                <div className="text-sm text-muted-foreground">
                                    Showing {registrations.from} to {registrations.to} of {registrations.total} results
                                </div>
                                <div className="flex items-center space-x-2">
                                    {registrations.current_page > 1 && (
                                        <Link
                                            href={`/admin/senior-citizen-registrations?page=${registrations.current_page - 1}`}
                                            preserveState
                                            preserveScroll
                                        >
                                            <Button variant="outline" size="sm">Previous</Button>
                                        </Link>
                                    )}
                                    
                                    <span className="text-sm">
                                        Page {registrations.current_page} of {registrations.last_page}
                                    </span>
                                    
                                    {registrations.current_page < registrations.last_page && (
                                        <Link
                                            href={`/admin/senior-citizen-registrations?page=${registrations.current_page + 1}`}
                                            preserveState
                                            preserveScroll
                                        >
                                            <Button variant="outline" size="sm">Next</Button>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
