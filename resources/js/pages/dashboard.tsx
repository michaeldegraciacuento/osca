import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Users, FileText, Calendar, CheckCircle, Clock, XCircle, TrendingUp } from 'lucide-react';
import { usePermissions } from '@/hooks/usePermissions';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface DashboardStats {
    registrations: {
        total: number;
        pending: number;
        under_review: number;
        approved: number;
        rejected: number;
    };
    home_visits: {
        total: number;
        scheduled: number;
        in_progress: number;
        completed: number;
        cancelled: number;
        today: number;
        this_week: number;
    };
    users: {
        total: number;
        active: number;
        unverified: number;
    };
    recent_registrations: any[];
    upcoming_visits: any[];
}

interface UserHomeVisit {
    id: number;
    scheduled_date: string;
    time_slot: string;
    status: string;
    notes: string | null;
}

interface Props {
    stats: DashboardStats;
    userHomeVisits?: UserHomeVisit[];
}

export default function Dashboard({ stats, userHomeVisits = [] }: Props) {
    const { can } = usePermissions();
    const { auth } = usePage().props as any;
    const [isHomeVisitModalOpen, setIsHomeVisitModalOpen] = useState(false);
    
    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'scheduled':
                return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'in progress':
            case 'in-progress':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'completed':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'cancelled':
                return 'bg-gray-100 text-gray-800 border-gray-200';
            case 're-scheduled':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };
    
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4 md:p-6 overflow-x-auto">
                {/* Welcome Section */}
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white">
                    <h1 className="text-2xl md:text-3xl font-bold mb-2">Welcome to OSCA Dashboard</h1>
                    <p className="text-purple-100">Office of the Senior Citizen's Affairs - Iligan City</p>
                </div>

                {/* Statistics Cards */}
                {can('system.dashboards') && (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {/* Total Registrations */}
                        <Link href="/admin/senior-citizen-registrations" className="block">
                            <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 bg-blue-100 rounded-lg">
                                        <FileText className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <span className="text-2xl font-bold text-gray-900">{stats.registrations.total}</span>
                                </div>
                                <h3 className="text-sm font-medium text-gray-600 mb-2">Total Registrations</h3>
                                <div className="flex items-center gap-4 text-xs">
                                    <span className="text-yellow-600">⏳ {stats.registrations.pending} Pending</span>
                                    <span className="text-green-600">✓ {stats.registrations.approved} Approved</span>
                                </div>
                            </div>
                        </Link>

                        {/* Total Home Visits */}
                        <Link href="/admin/senior-citizen-home-visit" className="block">
                            <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 bg-purple-100 rounded-lg">
                                        <Calendar className="h-6 w-6 text-purple-600" />
                                    </div>
                                    <span className="text-2xl font-bold text-gray-900">{stats.home_visits.total}</span>
                                </div>
                                <h3 className="text-sm font-medium text-gray-600 mb-2">Home Visits</h3>
                                <div className="flex items-center gap-4 text-xs">
                                    <span className="text-purple-600">📅 {stats.home_visits.scheduled} Scheduled</span>
                                    <span className="text-green-600">✓ {stats.home_visits.completed} Done</span>
                                </div>
                            </div>
                        </Link>

                        {/* Total Users */}
                        <Link href="/users" className="block">
                            <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 bg-green-100 rounded-lg">
                                        <Users className="h-6 w-6 text-green-600" />
                                    </div>
                                    <span className="text-2xl font-bold text-gray-900">{stats.users.total}</span>
                                </div>
                                <h3 className="text-sm font-medium text-gray-600 mb-2">System Users</h3>
                                <div className="flex items-center gap-4 text-xs">
                                    <span className="text-green-600">✓ {stats.users.active} Active</span>
                                    <span className="text-gray-500">⏳ {stats.users.unverified} Unverified</span>
                                </div>
                            </div>
                        </Link>

                        {/* Today's Visits */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-orange-100 rounded-lg">
                                    <Clock className="h-6 w-6 text-orange-600" />
                                </div>
                                <span className="text-2xl font-bold text-gray-900">{stats.home_visits.today}</span>
                            </div>
                            <h3 className="text-sm font-medium text-gray-600 mb-2">Visits Today</h3>
                            <div className="flex items-center gap-4 text-xs">
                                <span className="text-blue-600">📊 {stats.home_visits.this_week} This Week</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Detailed Statistics Row */}
                {can('system.dashboards') && (
                    <div className="grid gap-4 md:grid-cols-2">
                        {/* Registration Status Breakdown */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <FileText className="h-5 w-5 text-blue-600" />
                            Registration Status
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                    <span className="text-sm font-medium text-gray-700">Pending</span>
                                </div>
                                <span className="text-sm font-bold text-gray-900">{stats.registrations.pending}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    <span className="text-sm font-medium text-gray-700">Under Review</span>
                                </div>
                                <span className="text-sm font-bold text-gray-900">{stats.registrations.under_review}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span className="text-sm font-medium text-gray-700">Approved</span>
                                </div>
                                <span className="text-sm font-bold text-gray-900">{stats.registrations.approved}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                    <span className="text-sm font-medium text-gray-700">Rejected</span>
                                </div>
                                <span className="text-sm font-bold text-gray-900">{stats.registrations.rejected}</span>
                            </div>
                        </div>
                    </div>

                    {/* Home Visit Status Breakdown */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-purple-600" />
                            Home Visit Status
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                    <span className="text-sm font-medium text-gray-700">Scheduled</span>
                                </div>
                                <span className="text-sm font-bold text-gray-900">{stats.home_visits.scheduled}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    <span className="text-sm font-medium text-gray-700">In Progress</span>
                                </div>
                                <span className="text-sm font-bold text-gray-900">{stats.home_visits.in_progress}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span className="text-sm font-medium text-gray-700">Completed</span>
                                </div>
                                <span className="text-sm font-bold text-gray-900">{stats.home_visits.completed}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                                    <span className="text-sm font-medium text-gray-700">Cancelled</span>
                                </div>
                                <span className="text-sm font-bold text-gray-900">{stats.home_visits.cancelled}</span>
                            </div>
                        </div>
                    </div>
                </div>
                )}

                {/* Recent Activities */}
                {can('system.dashboards') && (
                    <div className="grid gap-4 md:grid-cols-2">
                        {/* Recent Registrations */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-blue-600" />
                                Recent Registrations
                            </h3>
                            <Link href="/admin/senior-citizen-registrations" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                                View All →
                            </Link>
                        </div>
                        <div className="space-y-3">
                            {stats.recent_registrations.length > 0 ? (
                                stats.recent_registrations.map((reg: any) => (
                                    <div key={reg.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900">{reg.first_name} {reg.last_name}</p>
                                            <p className="text-xs text-gray-500">{reg.registration_id}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className={`text-xs px-2 py-1 rounded-full ${
                                                reg.status === 'approved' ? 'bg-green-100 text-green-700' :
                                                reg.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                reg.status === 'under_review' ? 'bg-blue-100 text-blue-700' :
                                                'bg-red-100 text-red-700'
                                            }`}>
                                                {reg.status}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-gray-500 text-center py-4">No recent registrations</p>
                            )}
                        </div>
                    </div>

                    {/* Upcoming Visits */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-purple-600" />
                                Upcoming Visits
                            </h3>
                            <Link href="/admin/senior-citizen-home-visit" className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                                View All →
                            </Link>
                        </div>
                        <div className="space-y-3">
                            {stats.upcoming_visits.length > 0 ? (
                                stats.upcoming_visits.map((visit: any) => (
                                    <div key={visit.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900">
                                                {visit.registration?.first_name} {visit.registration?.last_name}
                                            </p>
                                            <p className="text-xs text-gray-500">{visit.registration?.registration_id}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs font-medium text-gray-900">{new Date(visit.scheduled_date).toLocaleDateString()}</p>
                                            <p className="text-xs text-gray-500">{visit.time_slot}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-gray-500 text-center py-4">No upcoming visits</p>
                            )}
                        </div>
                    </div>
                </div>
                )}
                
                {/* Recent Registrations */}
                {can('system.dashboards') && (
                    <div className="grid gap-4 md:grid-cols-2">
                       
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5 text-blue-600" />
                                    Recent Registrations
                                </h3>
                                <Link href="/admin/senior-citizen-registrations" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                                    View All →
                                </Link>
                            </div>
                            <div className="space-y-3">
                                {stats.recent_registrations.length > 0 ? (
                                    stats.recent_registrations.map((reg: any) => (
                                        <div key={reg.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-gray-900">{reg.first_name} {reg.last_name}</p>
                                                <p className="text-xs text-gray-500">{reg.registration_id}</p>
                                            </div>
                                            <div className="text-right">
                                                <span className={`text-xs px-2 py-1 rounded-full ${
                                                    reg.status === 'approved' ? 'bg-green-100 text-green-700' :
                                                    reg.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                    reg.status === 'under_review' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-red-100 text-red-700'
                                                }`}>
                                                    {reg.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-500 text-center py-4">No recent registrations</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}


                        {/* Senior Citizen*/}
                        {can('system.senior_citizen') && (
                            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border-2 border-blue-200 p-8 shadow-sm">
                                <div className="flex items-start gap-4">
                                    <div className="p-4 bg-blue-100 rounded-full">
                                        <Users className="h-8 w-8 text-blue-600" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-2xl font-bold text-gray-900 mb-3">Welcome, {auth.user?.name}!</h3>
                                        <div className="space-y-2 text-base text-gray-700">
                                            <p className="leading-relaxed">
                                                Thank you for being a valued member of our community. The Office of Senior Citizens Affairs (OSCA) 
                                                is here to support you with various programs and services.
                                            </p>
                                            <div className="mt-4 pt-4 border-t border-blue-200">
                                                <p className="font-semibold text-blue-900 mb-2">Available Services:</p>
                                                <ul className="space-y-1 text-sm">
                                                    <li className="flex items-center gap-2">
                                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                                        <Link 
                                                            href="/my-registration"
                                                            className="text-blue-700 hover:underline hover:bg-blue-100 px-2 py-1 rounded-lg transition-colors"
                                                        >
                                                            Senior Citizen Registration
                                                        </Link>
                                                    </li>
                                                    <li 
                                                        className="flex items-center gap-2 cursor-pointer hover:bg-blue-100 p-2 rounded-lg transition-colors"
                                                        onClick={() => setIsHomeVisitModalOpen(true)}
                                                    >
                                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                                        <span className="text-blue-700 hover:underline">Home Visit Services</span>
                                                    </li>
                                                    <li className="flex items-center gap-2">
                                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                                        <Link 
                                                            href="/my-mortuary-applications"
                                                            className="text-blue-700 hover:underline hover:bg-blue-100 px-2 py-1 rounded-lg transition-colors"
                                                        >
                                                            Mortuary Assistance Applications
                                                        </Link>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Home Visit Modal */}
                        <Dialog open={isHomeVisitModalOpen} onOpenChange={setIsHomeVisitModalOpen}>
                            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                                <DialogHeader>
                                    <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                                        <Calendar className="h-6 w-6 text-purple-600" />
                                        Your Scheduled Home Visits
                                    </DialogTitle>
                                </DialogHeader>
                                <div className="mt-4">
                                    {userHomeVisits && userHomeVisits.length > 0 ? (
                                        <div className="space-y-4">
                                            {userHomeVisits.map((visit) => (
                                                <div key={visit.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-3 mb-2">
                                                                <Calendar className="h-5 w-5 text-purple-600" />
                                                                <span className="text-lg font-semibold text-gray-900">
                                                                    {new Date(visit.scheduled_date).toLocaleDateString('en-US', {
                                                                        weekday: 'long',
                                                                        year: 'numeric',
                                                                        month: 'long',
                                                                        day: 'numeric'
                                                                    })}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-3 text-gray-600">
                                                                <Clock className="h-4 w-4" />
                                                                <span className="text-sm font-medium">{visit.time_slot}</span>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(visit.status)}`}>
                                                                {visit.status}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    {visit.notes && (
                                                        <div className="mt-3 pt-3 border-t border-gray-100">
                                                            <p className="text-sm text-gray-600">
                                                                <span className="font-semibold text-gray-700">Notes: </span>
                                                                {visit.notes}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12">
                                            <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Scheduled Visits</h3>
                                            <p className="text-gray-500">You don't have any scheduled home visits at the moment.</p>
                                        </div>
                                    )}
                                </div>
                            </DialogContent>
                        </Dialog>
            </div>
        </AppLayout>
    );
}
