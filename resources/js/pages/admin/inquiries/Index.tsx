import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Mail, Calendar, User, TrendingUp, MapPin } from 'lucide-react';
import { Card } from '@/components/ui/card';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Inquiries',
        href: '/admin/inquiries',
    },
];

interface InquiryItem {
    id: number;
    name: string;
    email: string;
    message: string;
    ip_address: string;
    submitted_at: string;
    created_at: string;
}

interface Stats {
    total: number;
    today: number;
    this_week: number;
    this_month: number;
}

interface Props {
    inquiries: {
        data: InquiryItem[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: any[];
    };
    stats: Stats;
}

export default function Index({ inquiries, stats }: Props) {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return {
            date: date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            }),
            time: date.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
            })
        };
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Inquiries" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4 md:p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-blue-100 rounded-lg">
                            <Mail className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Contact Inquiries</h1>
                            <p className="text-sm text-gray-500">
                                {inquiries.total} total inquiry submissions
                            </p>
                        </div>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {/* Total Inquiries */}
                    <Card className="p-6">
                        <div className="flex items-center justify-between mb-2">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Mail className="h-5 w-5 text-blue-600" />
                            </div>
                            <span className="text-2xl font-bold text-gray-900">{stats.total}</span>
                        </div>
                        <h3 className="text-sm font-medium text-gray-600">Total Inquiries</h3>
                    </Card>

                    {/* This Month */}
                    <Card className="p-6">
                        <div className="flex items-center justify-between mb-2">
                            <div className="p-2 bg-orange-100 rounded-lg">
                                <Calendar className="h-5 w-5 text-orange-600" />
                            </div>
                            <span className="text-2xl font-bold text-gray-900">{stats.this_month}</span>
                        </div>
                        <h3 className="text-sm font-medium text-gray-600">This Month</h3>
                    </Card>

                    {/* This Week */}
                    <Card className="p-6">
                        <div className="flex items-center justify-between mb-2">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <TrendingUp className="h-5 w-5 text-green-600" />
                            </div>
                            <span className="text-2xl font-bold text-gray-900">{stats.this_week}</span>
                        </div>
                        <h3 className="text-sm font-medium text-gray-600">This Week</h3>
                    </Card>

                    {/* Today */}
                    <Card className="p-6">
                        <div className="flex items-center justify-between mb-2">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <Calendar className="h-5 w-5 text-purple-600" />
                            </div>
                            <span className="text-2xl font-bold text-gray-900">{stats.today}</span>
                        </div>
                        <h3 className="text-sm font-medium text-gray-600">Today</h3>
                    </Card>
                </div>

                {/* Inquiries Table */}
                <Card className="overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Contact
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Message
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        IP Address
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Submitted At
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {inquiries.data.length > 0 ? (
                                    inquiries.data.map((inquiry) => {
                                        const { date, time } = formatDate(inquiry.submitted_at);
                                        return (
                                            <tr key={inquiry.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10">
                                                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                                <User className="h-5 w-5 text-blue-600" />
                                                            </div>
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {inquiry.name}
                                                            </div>
                                                            <div className="text-sm text-gray-500 flex items-center gap-1">
                                                                <Mail className="h-3 w-3" />
                                                                {inquiry.email}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-900 max-w-md">
                                                        <p className="line-clamp-2">{inquiry.message}</p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-1 text-sm text-gray-600">
                                                        <MapPin className="h-4 w-4 text-gray-400" />
                                                        <span className="font-mono text-xs">
                                                            {inquiry.ip_address}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="h-4 w-4" />
                                                        <div className="flex flex-col">
                                                            <span>{date}</span>
                                                            <span className="text-xs text-gray-400">
                                                                {time}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12">
                                            <div className="text-center">
                                                <Mail className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Inquiries Yet</h3>
                                                <p className="text-gray-500">No inquiries have been submitted yet.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>

                {/* Pagination */}
                {inquiries.last_page > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-6">
                        {inquiries.links.map((link: any, index: number) => (
                            <Link
                                key={index}
                                href={link.url || '#'}
                                className={`px-4 py-2 rounded-lg border ${
                                    link.active
                                        ? 'bg-blue-600 text-white border-blue-600'
                                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
