<?php

namespace App\Mail;

use App\Models\User;
use App\Models\SeniorCitizenRegistration;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class SeniorCitizenWelcomeMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public User $user,
        public SeniorCitizenRegistration $registration,
        public string $loginToken
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Welcome to OSCA - Your Account is Ready! - ' . $this->registration->registration_id,
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.senior-citizen-welcome',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
