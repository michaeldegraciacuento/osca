<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSeniorCitizenRegistrationsTable extends Migration
{
    public function up(): void
    {
        Schema::create('senior_citizen_registrations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('last_name');
            $table->string('first_name');
            $table->string('middle_name')->nullable();
            $table->string('suffix')->nullable();
            $table->date('date_of_birth');
            $table->string('place_of_birth')->nullable();
            $table->string('gender');
            $table->string('civil_status');
            $table->string('contact_number');
            $table->string('email')->nullable();
            $table->string('house_number');
            $table->string('street');
            $table->string('barangay');
            $table->string('city');
            $table->string('province');
            $table->string('zip_code');
            $table->string('emergency_contact_name');
            $table->string('emergency_contact_relationship');
            $table->string('emergency_contact_number');
            $table->string('emergency_contact_address')->nullable();
            $table->boolean('has_medical_conditions')->default(false);
            $table->text('medical_conditions')->nullable();
            $table->text('current_medications')->nullable();
            $table->text('allergies')->nullable();
            $table->string('valid_id_front');
            $table->string('valid_id_back');
            $table->string('birth_certificate')->nullable();
            $table->string('proof_of_residency')->nullable();
            $table->boolean('data_privacy_consent')->default(false);
            $table->boolean('terms_conditions')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('senior_citizen_registrations');
    }
}
