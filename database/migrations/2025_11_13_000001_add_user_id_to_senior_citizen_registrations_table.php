<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('senior_citizen_registrations', function (Blueprint $table) {
            if (!Schema::hasColumn('senior_citizen_registrations', 'user_id')) {
                $table->foreignId('user_id')->nullable()->after('reviewed_by')->constrained('users')->nullOnDelete();
            }
        });
    }

    public function down(): void
    {
        Schema::table('senior_citizen_registrations', function (Blueprint $table) {
            if (Schema::hasColumn('senior_citizen_registrations', 'user_id')) {
                $table->dropForeign(['user_id']);
                $table->dropColumn('user_id');
            }
        });
    }
};
