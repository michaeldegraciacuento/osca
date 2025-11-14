<?php

namespace App\Mail;

use App\Models\SeniorCitizenHomeVisit;
use App\Models\SeniorCitizenRegistration;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class HomeVisitScheduledMail extends Mailable
{
    use Queueable, SerializesModels;

    public $visit;
    public $registration;

    /**
     * Create a new message instance.
     */
    public function __construct(SeniorCitizenHomeVisit $visit, SeniorCitizenRegistration $registration)
    {
        $this->visit = $visit;
        $this->registration = $registration;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Home Visit Scheduled - OSCA Iligan',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.home-visit-scheduled',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
