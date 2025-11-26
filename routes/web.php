<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SeniorCitizenController;
use App\Http\Controllers\SeniorCitizenHomeVisitController;
use App\Http\Controllers\FeedbackController;
use App\Http\Controllers\InquiryController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\EmailVerificationController;
use Illuminate\Http\Request;
use App\Models\SeniorCitizenHomeVisit;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified', 'mfa.login'])->group(function () {
    Route::get('dashboard', function () {
        // Get dashboard statistics
        $stats = [
            // Senior Citizen Registrations
            'registrations' => [
                'total' => \App\Models\SeniorCitizenRegistration::count(),
                'pending' => \App\Models\SeniorCitizenRegistration::where('status', 'pending')->count(),
                'under_review' => \App\Models\SeniorCitizenRegistration::where('status', 'under_review')->count(),
                'approved' => \App\Models\SeniorCitizenRegistration::where('status', 'approved')->count(),
                'rejected' => \App\Models\SeniorCitizenRegistration::where('status', 'rejected')->count(),
            ],
            
            // Home Visits
            'home_visits' => [
                'total' => \App\Models\SeniorCitizenHomeVisit::count(),
                'scheduled' => \App\Models\SeniorCitizenHomeVisit::where('status', 'Scheduled')->count(),
                'in_progress' => \App\Models\SeniorCitizenHomeVisit::where('status', 'In-Progress')->count(),
                'completed' => \App\Models\SeniorCitizenHomeVisit::where('status', 'Completed')->count(),
                'cancelled' => \App\Models\SeniorCitizenHomeVisit::where('status', 'Cancelled')->count(),
                'today' => \App\Models\SeniorCitizenHomeVisit::whereDate('scheduled_date', today())->count(),
                'this_week' => \App\Models\SeniorCitizenHomeVisit::whereBetween('scheduled_date', [now()->startOfWeek(), now()->endOfWeek()])->count(),
            ],
            
            // Users
            'users' => [
                'total' => \App\Models\User::count(),
                'active' => \App\Models\User::whereNotNull('email_verified_at')->count(),
                'unverified' => \App\Models\User::whereNull('email_verified_at')->count(),
            ],
            
            // Recent Activities
            'recent_registrations' => \App\Models\SeniorCitizenRegistration::latest()->take(5)->get(['id', 'registration_id', 'first_name', 'last_name', 'status', 'created_at']),
            'upcoming_visits' => \App\Models\SeniorCitizenHomeVisit::with('registration:id,registration_id,first_name,last_name')
                ->where('scheduled_date', '>=', today())
                ->where('status', 'Scheduled')
                ->orderBy('scheduled_date')
                ->take(5)
                ->get(['id', 'registration_id', 'scheduled_date', 'time_slot', 'status']),
        ];

        // Get user's home visits if they are a senior citizen
        $userHomeVisits = [];
        if (auth()->user()->can('system.senior_citizen')) {
            $registration = \App\Models\SeniorCitizenRegistration::where('user_id', auth()->id())->first();
            if ($registration) {
                $userHomeVisits = \App\Models\SeniorCitizenHomeVisit::where('registration_id', $registration->id)
                    ->orderBy('scheduled_date', 'asc')
                    ->get(['id', 'scheduled_date', 'time_slot', 'status', 'notes'])
                    ->toArray();
            }
        }
        
        return Inertia::render('dashboard', [
            'stats' => $stats,
            'userHomeVisits' => $userHomeVisits,
        ]);
    })->name('dashboard');

    // Senior Citizen - My Mortuary Applications Routes
    Route::middleware(['permission:system.senior_citizen'])->group(function () {
        Route::get('/my-registration', [SeniorCitizenController::class, 'myRegistration'])->name('my-registration.show');
        Route::get('/my-mortuary-applications', [\App\Http\Controllers\SeniorCitizenMortuaryApplicationController::class, 'myApplications'])->name('my-mortuary-applications.index');
        Route::get('/my-mortuary-applications/{application}', [\App\Http\Controllers\SeniorCitizenMortuaryApplicationController::class, 'myApplicationShow'])->name('my-mortuary-applications.show');
        Route::post('/my-mortuary-applications', [\App\Http\Controllers\SeniorCitizenMortuaryApplicationController::class, 'myApplicationStore'])->name('my-mortuary-applications.store');
        Route::post('/my-mortuary-applications/{application}/upload', [\App\Http\Controllers\SeniorCitizenMortuaryApplicationController::class, 'uploadDocument'])->name('my-mortuary-applications.upload');
        
        // Feedback Routes
        Route::post('/my-feedback', [FeedbackController::class, 'store'])->name('my-feedback.store');
        Route::get('/my-feedback/check-today', [FeedbackController::class, 'checkToday'])->name('my-feedback.check-today');
    });
    
    // Admin Feedback Routes
    Route::middleware(['permission:system.dashboards'])->group(function () {
        Route::get('/admin/feedback', [FeedbackController::class, 'index'])->name('admin.feedback.index');
    });
    
    // Role and Permission Management Routes with middleware protection
    // Create & Store must come first
    Route::middleware(['permission:users.create'])->group(function () {
        Route::get('roles/create', [RoleController::class, 'create'])
             ->name('roles.create');
        Route::post('roles',       [RoleController::class, 'store'])
             ->name('roles.store');
        Route::get('permissions/create', [PermissionController::class, 'create'])
             ->name('permissions.create');
        Route::post('permissions', [PermissionController::class, 'store'])
             ->name('permissions.store');
     Route::get('users/create', [UserController::class, 'create'])
             ->name('users.create');
        Route::post('users',       [UserController::class, 'store'])
             ->name('users.store');
    });

    // View (index + show)
    Route::middleware(['permission:users.view'])->group(function () {
        Route::get('roles',         [RoleController::class, 'index'])
             ->name('roles.index');
        Route::get('roles/{role}',  [RoleController::class, 'show'])
             ->name('roles.show');
        Route::get('permissions',   [PermissionController::class, 'index'])
             ->name('permissions.index');
        Route::get('permissions/{permission}', [PermissionController::class, 'show'])
             ->name('permissions.show');
        Route::get('users',         [UserController::class, 'index'])
             ->name('users.index');
        Route::get('users/{user}',  [UserController::class, 'show'])
             ->name('users.show');
    });

    // Edit & Update
    Route::middleware(['permission:users.edit'])->group(function () {
        Route::get('roles/{role}/edit', [RoleController::class, 'edit'])
             ->name('roles.edit');
        Route::match(['put','patch'],'roles/{role}', [RoleController::class, 'update'])
             ->name('roles.update');
        Route::get('permissions/{permission}/edit', [PermissionController::class, 'edit'])
             ->name('permissions.edit');
        Route::match(['put','patch'],'permissions/{permission}', [PermissionController::class, 'update'])
             ->name('permissions.update');
        Route::get('users/{user}/edit', [UserController::class, 'edit'])
             ->name('users.edit');
        Route::match(['put','patch'],'users/{user}', [UserController::class, 'update'])
             ->name('users.update');

        // MFA Management for Users
        Route::post('users/{user}/enable-mfa', [UserController::class, 'enableMfa'])
             ->name('users.enable-mfa');
        Route::post('users/{user}/disable-mfa', [UserController::class, 'disableMfa'])
             ->name('users.disable-mfa');
    });

    // Delete (with MFA protection for sensitive actions)
    Route::middleware(['permission:users.delete', 'mfa:delete_role'])->group(function () {
        Route::delete('roles/{role}', [RoleController::class, 'destroy'])
             ->name('roles.destroy');
    });
    
    Route::middleware(['permission:users.delete', 'mfa:delete_permission'])->group(function () {
        Route::delete('permissions/{permission}', [PermissionController::class, 'destroy'])
             ->name('permissions.destroy');
    });
    
    Route::middleware(['permission:users.delete', 'mfa:delete_user'])->group(function () {
        Route::delete('users/{user}', [UserController::class, 'destroy'])
             ->name('users.destroy');
    });

});

// Senior Citizen Registration Routes
Route::get('/senior-citizen/register', [SeniorCitizenController::class, 'create'])->name('senior-citizen.register');
Route::post('/senior-citizen/register', [SeniorCitizenController::class, 'store'])->name('senior-citizen.store');
Route::get('/senior-citizen/confirmation/{registrationId}', [SeniorCitizenController::class, 'confirmation'])->name('senior-citizen.confirmation');
Route::post('/senior-citizen/check-status', [SeniorCitizenController::class, 'checkStatus'])->name('senior-citizen.check-status'); // POST (kept)
Route::get('/senior-citizen/check-status/{registrationId}', [SeniorCitizenController::class, 'checkStatus'])->name('senior-citizen.check-status.get'); // NEW GET

// Public API for home visit calendar
Route::get('/api/home-visit-calendar', [SeniorCitizenHomeVisitController::class, 'getCalendar'])->name('api.home-visit-calendar');

// Inquiry Routes (Contact Form)
Route::post('/inquiries/submit', [InquiryController::class, 'store'])->name('inquiries.submit');
Route::get('/inquiries/check-today', [InquiryController::class, 'checkToday'])->name('inquiries.check-today');

// Admin routes for managing registrations (protected by auth middleware)
Route::middleware(['auth', 'verified'])->group(function () {
    // Senior Citizen Registration Routes with Permission Middleware
    Route::middleware(['permission:senior_citizen_registrations.page'])->group(function () {
        Route::get('/admin/senior-citizen-registrations', [SeniorCitizenController::class, 'index'])->name('admin.senior-citizen-registrations.index');
        Route::get('/admin/senior-citizen-registrations/{registration}', [SeniorCitizenController::class, 'show'])->name('admin.senior-citizen-registrations.show');
        Route::get('/admin/senior-citizen-registrations/{registration}/download-form', [SeniorCitizenController::class, 'downloadForm'])->name('admin.senior-citizen-registrations.download-form');
    });
    
    Route::middleware(['permission:senior_citizen_registrations.edit'])->group(function () {
        Route::get('/admin/senior-citizen-registrations/{registration}/edit', [SeniorCitizenController::class, 'edit'])->name('admin.senior-citizen-registrations.edit');
        Route::put('/admin/senior-citizen-registrations/{registration}', [SeniorCitizenController::class, 'updateRegistration'])->name('admin.senior-citizen-registrations.update-registration');
        Route::patch('/admin/senior-citizen-registrations/{registration}', [SeniorCitizenController::class, 'update'])->name('admin.senior-citizen-registrations.update');
    });
    
    // Home Visit Routes with Permission Middleware
    Route::middleware(['permission:senior_citizen_home_visits.page'])->group(function () {
        Route::get('/admin/senior-citizen-home-visit', [SeniorCitizenHomeVisitController::class, 'index'])
            ->name('admin.senior-citizen-home-visit.index');
    });
    
    Route::middleware(['permission:senior_citizen_home_visits.create'])->group(function () {
        Route::post('/admin/senior-citizen-home-visit', [SeniorCitizenHomeVisitController::class, 'store'])
            ->name('admin.senior-citizen-home-visit.store');
    });
    
    Route::middleware(['permission:senior_citizen_home_visits.edit'])->group(function () {
        Route::patch('/admin/senior-citizen-home-visit/{visit}/status', [SeniorCitizenHomeVisitController::class, 'updateStatus'])->name('admin.senior-citizen-home-visit.update-status');
    });
    
    Route::middleware(['permission:senior_citizen_home_visits.delete'])->group(function () {
        Route::delete('/admin/senior-citizen-home-visit/{visit}', [SeniorCitizenHomeVisitController::class, 'destroy'])
            ->name('admin.senior-citizen-home-visit.destroy');
    });

    // Mortuary Applications Routes with Permission Middleware
    Route::prefix('admin/senior-citizen-mortuary-applications')->name('admin.senior-citizen-mortuary-applications.')->group(function () {
        // Create routes must come BEFORE show routes to avoid route collision
        Route::middleware(['permission:senior_citizen_mortuary_applications.create'])->group(function () {
            Route::get('/create', [\App\Http\Controllers\SeniorCitizenMortuaryApplicationController::class, 'create'])->name('create');
            Route::post('/', [\App\Http\Controllers\SeniorCitizenMortuaryApplicationController::class, 'store'])->name('store');
        });
        
        Route::middleware(['permission:senior_citizen_mortuary_applications.page'])->group(function () {
            Route::get('/', [\App\Http\Controllers\SeniorCitizenMortuaryApplicationController::class, 'index'])->name('index');
            Route::get('/{application}', [\App\Http\Controllers\SeniorCitizenMortuaryApplicationController::class, 'show'])->name('show');
        });
        
        Route::middleware(['permission:senior_citizen_mortuary_applications.edit'])->group(function () {
            Route::get('/{application}/edit', [\App\Http\Controllers\SeniorCitizenMortuaryApplicationController::class, 'edit'])->name('edit');
            Route::put('/{application}', [\App\Http\Controllers\SeniorCitizenMortuaryApplicationController::class, 'update'])->name('update');
            Route::patch('/{application}/status', [\App\Http\Controllers\SeniorCitizenMortuaryApplicationController::class, 'updateStatus'])->name('update-status');
        });
        
        Route::middleware(['permission:senior_citizen_mortuary_applications.delete'])->group(function () {
            Route::delete('/{application}', [\App\Http\Controllers\SeniorCitizenMortuaryApplicationController::class, 'destroy'])->name('destroy');
        });
    });
});

// Email verification routes
Route::get('/verify-email-and-login', [EmailVerificationController::class, 'verifyAndLogin'])->name('verify-email-login.show');
Route::post('/verify-email-and-login', [EmailVerificationController::class, 'verifyAndLogin'])->name('verify-email-login.store');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/mfa.php';
require __DIR__.'/auth.php';
require __DIR__.'/mfa.php';
require __DIR__.'/mfa.php';
