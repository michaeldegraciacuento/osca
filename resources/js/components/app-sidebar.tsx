import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, FacebookIcon, Folder, LayoutGrid, Shield, Users, Settings, FileText, House, Cuboid, MessageSquare } from 'lucide-react';
import AppLogo from './app-logo';
import { usePermissions } from '@/hooks/usePermissions';
import { useMemo } from 'react';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
        permission: undefined, // No permission required for dashboard
    },
    {
        title: 'Registrations',
        href: '/admin/senior-citizen-registrations',
        icon: FileText,
        permission: 'senior_citizen_registrations.page',
    },
    {
        title: 'Home Visit',
        href: '/admin/senior-citizen-home-visit',
        icon: House,
        permission: 'senior_citizen_home_visits.page',
    },
    {
        title: 'Mortuary Applications',
        href: '/admin/senior-citizen-mortuary-applications',
        icon: Cuboid,
        permission: 'senior_citizen_mortuary_applications.page',
    },
    {
        title: 'Feedbacks',
        href: '/admin/feedback',
        icon: MessageSquare,
        permission: 'system.dashboards',
    },
];

const footerNavItemsSettings: NavItem[] = [
    {
        title: 'Users',
        href: '/users',
        icon: Users,
        permission: 'users.page',
    },
    {
        title: 'MFA Settings',
        href: '/settings/mfa',
        icon: Shield,
        permission: undefined, // No permission required - user's own settings
    },
    {
        title: 'Roles & Permissions',
        href: '/roles',
        icon: Shield,
        permission: 'users.page', // Require users.page to see roles
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Facebook',
        href: 'https://www.facebook.com/p/Office-of-the-Senior-Citizens-Affairs-LGU-iligan-61562896852421/',
        icon: FacebookIcon,
    },
    {
        title: 'Documentation',
        href: '',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    const { can } = usePermissions();
    
    // Filter navigation items based on user permissions
    const filteredMainNavItems = useMemo(() => {
        return mainNavItems.filter(item => {
            // If no permission is required, show the item
            if (!item.permission) return true;
            // Otherwise, check if user has the permission
            return can(item.permission);
        });
    }, [can]);
    
    const filteredFooterNavItems = useMemo(() => {
        return footerNavItemsSettings.filter(item => {
            // If no permission is required, show the item
            if (!item.permission) return true;
            // Otherwise, check if user has the permission
            return can(item.permission);
        });
    }, [can]);
    
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={filteredMainNavItems} />
            </SidebarContent>
            <SidebarFooter>
                <NavFooter items={filteredFooterNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
            {/* <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter> */}
        </Sidebar>
    );
}
