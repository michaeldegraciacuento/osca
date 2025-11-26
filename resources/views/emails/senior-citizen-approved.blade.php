<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Senior Citizen Registration Approved</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
        .success-badge { background: #10b981; color: white; padding: 8px 16px; border-radius: 20px; display: inline-block; font-weight: bold; }
        .info-box { background: white; border: 1px solid #e5e7eb; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .registration-id { font-size: 24px; font-weight: bold; color: #2563eb; font-family: monospace; }
        .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
        .button { color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 Registration Approved!</h1>
            <p>OSCA - Office of the Senior Citizen's Affairs</p>
        </div>
        
        <div class="content">
            <div style="text-align: center; margin-bottom: 30px;">
                <span class="success-badge">✓ APPROVED</span>
            </div>
            
            <p>Dear <strong>{{ $registration->full_name }}</strong>,</p>
            
            <p>Congratulations! We are pleased to inform you that your senior citizen registration application has been <strong>approved</strong>.</p>
            
            <div class="info-box">
                <h3>Registration Details</h3>
                <p><strong>Registration ID:</strong> <span class="registration-id">{{ $registration->registration_id }}</span></p>
                <p><strong>Applicant Name:</strong> {{ $registration->full_name }}</p>
                <p><strong>Date Applied:</strong> {{ $registration->created_at->format('F d, Y') }}</p>
                <p><strong>Date Approved:</strong> {{ now()->format('F d, Y') }}</p>
            </div>
            
            <!-- <h3>What's Next?</h3>
            <ol>
                <li><strong>Visit our office</strong> to claim your Senior Citizen ID card</li>
                <li><strong>Bring the following documents:</strong>
                    <ul>
                        <li>A valid government-issued ID</li>
                        <li>This approval email (printed or digital)</li>
                    </ul>
                </li>
                <li><strong>Office Hours:</strong> Monday to Friday, 8:00 AM - 5:00 PM</li>
            </ol> -->
            
            <div class="info-box">
                <h3>OSCA Office Location</h3>
                <p>
                    <strong>Address:</strong> Iligan City Hall Complex<br>
                    Iligan City, Lanao del Norte 9200<br>
                    <strong>Phone:</strong> (063) 221-1234 Local 456<br>
                    <strong>Email:</strong> osca@iligancity.gov.ph
                </p>
            </div>
            
            @if($registration->notes)
            <div class="info-box">
                <h3>Additional Notes</h3>
                <p>{{ $registration->notes }}</p>
            </div>
            @endif
            
            <p>Thank you for registering with OSCA. We look forward to serving you and providing you with the benefits and services you deserve as a valued senior citizen of Iligan City.</p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="{{ url('/') }}" class="button">Visit OSCA Website</a>
            </div>
        </div>
        
        <div class="footer">
            <p>This is an automated message from OSCA Iligan City.<br>
            Please do not reply to this email.</p>
            <p>&copy; {{ date('Y') }} Office of the Senior Citizen's Affairs - LGU Iligan City</p>
        </div>
    </div>
</body>
</html>
