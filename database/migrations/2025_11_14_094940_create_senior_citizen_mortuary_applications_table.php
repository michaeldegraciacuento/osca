<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('senior_citizen_mortuary_applications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('senior_citizen_registration_id')->constrained('senior_citizen_registrations', 'id', 'sc_mort_app_reg_id_fk')->onDelete('cascade');
            
            // OSCA ID (Original)
            $table->string('osca_id_original')->nullable();
            
            // Barangay Documents
            $table->string('brgy_residency_certificate')->nullable();
            $table->string('brgy_indigency')->nullable();
            
            // Death Certificate
            $table->string('death_certificate')->nullable();
            
            // Affidavit
            $table->string('affidavit_of_next_of_kin')->nullable();
            
            // OSCA Certificate
            $table->string('osca_certificate')->nullable();
            
            // Claimants Documents
            $table->string('marriage_contract')->nullable();
            $table->string('birth_certificate_of_children')->nullable();
            $table->string('valid_id_of_children')->nullable();
            $table->string('valid_id_of_claimants')->nullable();
            $table->string('waiver_authority_to_claim')->nullable();
            
            // Status and Tracking
            $table->enum('status', ['pending', 'under_review', 'approved', 'rejected', 'released'])->default('pending');
            $table->text('notes')->nullable();
            $table->timestamp('reviewed_at')->nullable();
            $table->foreignId('reviewed_by')->nullable()->constrained('users', 'id', 'sc_mort_app_reviewer_fk')->onDelete('set null');
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('senior_citizen_mortuary_applications');
    }
};
