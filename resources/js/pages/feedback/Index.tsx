import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { MessageSquare, Star, Calendar, User, TrendingUp, BarChart3 } from 'lucide-react';
import { Card } from '@/components/ui/card';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Feedback',
        href: '/admin/feedback',
    },
];

interface FeedbackItem {
    id: number;
    rating: number;
    category: string;
    message: string;
    created_at: string;
    user: {
        id: number;
        name: string;
        email: string;
    };
}

interface Stats {
    total: number;
    today: number;
    this_week: number;
    this_month: number;
    average_rating: number;
    by_category: Record<string, number>;
    by_rating: Record<string, number>;
}

interface Props {
    feedback: {
        data: FeedbackItem[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: any[];
    };
    stats: Stats;
}

export default function Index({ feedback, stats }: Props) {
    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'Service Quality':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'Staff Assistance':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'Process':
                return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'Facilities':
                return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'Other':
                return 'bg-gray-100 text-gray-800 border-gray-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const renderStars = (rating: number) => {
        return (
            <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`h-4 w-4 ${
                            star <= rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                        }`}
                    />
                ))}
            </div>
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Feedback" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4 md:p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-blue-100 rounded-lg">
                            <MessageSquare className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Feedback</h1>
                            <p className="text-sm text-gray-500">
                                {feedback.total} total feedback submissions
                            </p>
                        </div>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {/* Total Feedback */}
                    <Card className="p-6">
                        <div className="flex items-center justify-between mb-2">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <MessageSquare className="h-5 w-5 text-blue-600" />
                            </div>
                            <span className="text-2xl font-bold text-gray-900">{stats.total}</span>
                        </div>
                        <h3 className="text-sm font-medium text-gray-600">Total Feedback</h3>
                    </Card>

                    {/* Average Rating */}
                    <Card className="p-6">
                        <div className="flex items-center justify-between mb-2">
                            <div className="p-2 bg-yellow-100 rounded-lg">
                                <Star className="h-5 w-5 text-yellow-600" />
                            </div>
                            <span className="text-2xl font-bold text-gray-900">{stats.average_rating || 0}</span>
                        </div>
                        <h3 className="text-sm font-medium text-gray-600">Average Rating</h3>
                        <div className="flex items-center gap-1 mt-2">
                            {renderStars(Math.round(stats.average_rating))}
                        </div>
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

                {/* Category Breakdown */}
                <div className="grid gap-4 md:grid-cols-2">
                    {/* By Category */}
                    <Card className="p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <BarChart3 className="h-5 w-5 text-blue-600" />
                            <h3 className="text-lg font-semibold text-gray-900">By Category</h3>
                        </div>
                        <div className="space-y-3">
                            {Object.entries(stats.by_category).map(([category, count]) => (
                                <div key={category} className="flex items-center justify-between">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(category)}`}>
                                        {category}
                                    </span>
                                    <span className="text-sm font-semibold text-gray-900">{count}</span>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* By Rating */}
                    <Card className="p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Star className="h-5 w-5 text-yellow-600" />
                            <h3 className="text-lg font-semibold text-gray-900">By Rating</h3>
                        </div>
                        <div className="space-y-3">
                            {[5, 4, 3, 2, 1].map((rating) => (
                                <div key={rating} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        {renderStars(rating)}
                                    </div>
                                    <span className="text-sm font-semibold text-gray-900">
                                        {stats.by_rating[rating] || 0}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Feedback List */}
                <Card className="overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        User
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Rating
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Category
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Message
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {feedback.data.length > 0 ? (
                                    feedback.data.map((item) => (
                                        <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                                                            <User className="h-5 w-5 text-gray-600" />
                                                        </div>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {item.user.name}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {item.user.email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex flex-col gap-1">
                                                    {renderStars(item.rating)}
                                                    <span className="text-xs text-gray-500">
                                                        {item.rating}/5
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-medium rounded-full border ${getCategoryColor(item.category)}`}>
                                                    {item.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900 max-w-md">
                                                    <p className="line-clamp-2">{item.message}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="h-4 w-4" />
                                                    <div className="flex flex-col">
                                                        <span>{new Date(item.created_at).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric'
                                                        })}</span>
                                                        <span className="text-xs text-gray-400">
                                                            {new Date(item.created_at).toLocaleTimeString('en-US', {
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            })}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12">
                                            <div className="text-center">
                                                <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Feedback Yet</h3>
                                                <p className="text-gray-500">No feedback has been submitted yet.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>

                {/* Pagination */}
                {feedback.last_page > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-6">
                        {feedback.links.map((link: any, index: number) => (
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
