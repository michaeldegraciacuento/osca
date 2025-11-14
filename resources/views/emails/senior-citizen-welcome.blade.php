<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to OSCA - Account Created</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
        .success-badge { background: #10b981; color: white; padding: 8px 16px; border-radius: 20px; display: inline-block; font-weight: bold; }
        .info-box { background: white; border: 1px solid #e5e7eb; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .registration-id { font-size: 20px; font-weight: bold; color: #2563eb; font-family: monospace; }
        .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
        .button { background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold; margin: 10px 5px; }
        .button-success { background: #10b981; }
        .button-warning { background: #f59e0b; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 Welcome to OSCA!</h1>
            <p>Your Senior Citizen Account is Ready</p>
        </div>
        
        <div class="content">
            <div style="text-align: center; margin-bottom: 30px;">
                <span class="success-badge">✓ ACCOUNT CREATED</span>
            </div>
            
            <p>Dear <strong>{{ $registration->full_name }}</strong>,</p>
            
            <p>Congratulations! Your senior citizen registration has been <strong>approved</strong> and we've created your personal OSCA account.</p>
            
            <div class="info-box">
                <h3>Your Account Details</h3>
                <p><strong>Registration ID:</strong> <span class="registration-id">{{ $registration->registration_id }}</span></p>
                <p><strong>Full Name:</strong> {{ $registration->full_name }}</p>
                <p><strong>Email Address:</strong> {{ $user->email }}</p>
                <p><strong>Account Created:</strong> {{ now()->format('F d, Y') }}</p>
            </div>
            
            <div class="info-box" style="background: #fef3c7; border-color: #f59e0b;">
                <h3>🔐 Secure Login Required</h3>
                <p>For your security, you need to verify your email and set up your password before accessing your account.</p>
                
                <div style="text-align: center; margin: 20px 0;">
                    <a href="{{ url('/verify-email-and-login?token=' . $loginToken) }}" class="button button-success">
                        🔑 Click Here to Login & Set Password
                    </a>
                </div>
                
                <p style="font-size: 14px; color: #d97706;">
                    <strong>Important:</strong> This login link is valid for 24 hours and can only be used once for security purposes.
                </p>
            </div>
            
            <h3>What You Can Do with Your Account:</h3>
            <ul>
                <li>✅ Access your Senior Citizen Dashboard</li>
                <li>✅ View and update your personal information</li>
                <li>✅ Apply for senior citizen benefits and services</li>
                <li>✅ Track your application status</li>
                <li>✅ Access digital copies of your documents</li>
                <li>✅ Stay updated on OSCA news and programs</li>
            </ul>
            
            <div class="info-box">
                <h3>Next Steps:</h3>
                <ol>
                    <li><strong>Click the "Login & Set Password" button above</strong></li>
                    <li><strong>Create a secure password</strong> for your account</li>
                    <li><strong>Complete your profile</strong> if needed</li>
                    <li><strong>Explore available services</strong> and benefits</li>
                    <li><strong>Visit our office</strong> to claim your physical Senior Citizen ID</li>
                </ol>
            </div>
            
            <div class="info-box">
                <h3>OSCA Office Information</h3>
                <p>
                    <strong>Address:</strong> Iligan City Hall Complex<br>
                    Iligan City, Lanao del Norte 9200<br>
                    <strong>Phone:</strong> (063) 221-1234 Local 456<br>
                    <strong>Email:</strong> osca@iligancity.gov.ph<br>
                    <strong>Office Hours:</strong> Monday to Friday, 8:00 AM - 5:00 PM
                </p>
            </div>
            
            @if($registration->notes)
            <div class="info-box">
                <h3>Additional Notes</h3>
                <p>{{ $registration->notes }}</p>
            </div>
            @endif
            
            <p>Welcome to the OSCA family! We're honored to serve you and provide you with the benefits and services you deserve as a valued senior citizen of Iligan City.</p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="{{ url('/') }}" class="">Visit OSCA Website</a>
                <a href="{{ url('/verify-email-and-login?token=' . $loginToken) }}" class="">Login to Your Account</a>
            </div>
        </div>
        
        <div class="footer">
            <p>This is an automated message from OSCA Iligan City.<br>
            If you have any questions, please contact us at osca@iligancity.gov.ph</p>
            <p>&copy; {{ date('Y') }} Office of the Senior Citizen's Affairs - LGU Iligan City</p>
        </div>
    </div>
</body>
</html>
