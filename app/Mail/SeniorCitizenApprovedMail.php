<?php

namespace App\Mail;

use App\Models\SeniorCitizenRegistration;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class SeniorCitizenApprovedMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public SeniorCitizenRegistration $registration
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Senior Citizen Registration Approved - ' . $this->registration->registration_id,
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.senior-citizen-approved',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
