import { usePage } from '@inertiajs/react';

interface AuthProps {
    user: any;
    permissions: string[];
    roles: string[];
}

export function usePermissions() {
    const { auth } = usePage<{ auth: AuthProps }>().props;

    const can = (permission: string): boolean => {
        return auth.permissions?.includes(permission) || false;
    };

    const hasRole = (role: string): boolean => {
        return auth.roles?.includes(role) || false;
    };

    const hasAnyRole = (roles: string[]): boolean => {
        return roles.some(role => auth.roles?.includes(role)) || false;
    };

    const hasAllRoles = (roles: string[]): boolean => {
        return roles.every(role => auth.roles?.includes(role)) || false;
    };

    const canAny = (permissions: string[]): boolean => {
        return permissions.some(permission => auth.permissions?.includes(permission)) || false;
    };

    const canAll = (permissions: string[]): boolean => {
        return permissions.every(permission => auth.permissions?.includes(permission)) || false;
    };

    return {
        can,
        hasRole,
        hasAnyRole,
        hasAllRoles,
        canAny,
        canAll,
        permissions: auth.permissions || [],
        roles: auth.roles || [],
    };
}
