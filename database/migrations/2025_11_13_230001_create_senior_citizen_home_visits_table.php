<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        if (!Schema::hasTable('senior_citizen_home_visits')) {
            Schema::create('senior_citizen_home_visits', function (Blueprint $table) {
                $table->id();
                $table->foreignId('registration_id')
                      ->constrained('senior_citizen_registrations')
                      ->cascadeOnDelete();
                $table->date('scheduled_date');
                $table->string('time_slot'); // 8-10, 10-12, 1-2, 1-4
                $table->string('status')->default('scheduled'); // scheduled|completed|canceled
                $table->text('notes')->nullable();
                $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
                $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
                $table->timestamps();
                $table->unique(['registration_id', 'scheduled_date', 'time_slot'], 'uniq_visit_slot');
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('senior_citizen_home_visits');
    }
};
