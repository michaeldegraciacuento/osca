<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddRegistrationIdToSeniorCitizenRegistrationsTable extends Migration
{
    public function up(): void
    {
        Schema::table('senior_citizen_registrations', function (Blueprint $table) {
            $table->string('registration_id')->unique()->after('id');
            $table->enum('status', ['pending', 'correction','under_review', 'approved', 'rejected'])->default('pending')->after('registration_id');
            $table->text('notes')->nullable()->after('status');
            $table->timestamp('reviewed_at')->nullable()->after('notes');
            $table->unsignedBigInteger('reviewed_by')->nullable()->after('reviewed_at');
            
            $table->foreign('reviewed_by')->references('id')->on('users')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::table('senior_citizen_registrations', function (Blueprint $table) {
            $table->dropForeign(['reviewed_by']);
            $table->dropColumn(['registration_id', 'status', 'notes', 'reviewed_at', 'reviewed_by']);
        });
    }
}
