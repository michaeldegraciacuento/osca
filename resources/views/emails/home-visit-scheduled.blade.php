<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Home Visit Scheduled</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #ffffff;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        .content {
            padding: 30px;
        }
        .info-box {
            background: #f8f9fa;
            border-left: 4px solid #667eea;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
        }
        .info-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #e9ecef;
        }
        .info-row:last-child {
            border-bottom: none;
        }
        .info-label {
            font-weight: bold;
            color: #495057;
        }
        .info-value {
            color: #212529;
        }
        .highlight {
            background: #fff3cd;
            padding: 15px;
            border-radius: 4px;
            margin: 20px 0;
            border-left: 4px solid #ffc107;
        }
        .footer {
            background: #f8f9fa;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #6c757d;
        }
        .button {
            display: inline-block;
            padding: 12px 30px;
            background: #667eea;
            color: #ffffff;
            text-decoration: none;
            border-radius: 4px;
            margin: 20px 0;
        }
        .logo {
            width: 60px;
            height: 60px;
            margin-bottom: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🏠 Home Visit Scheduled</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Office for Senior Citizen Affairs - Iligan City</p>
        </div>
        
        <div class="content">
            <p>Dear <strong>{{ $registration->full_name }}</strong>,</p>
            
            <p>We are pleased to inform you that a home visit has been scheduled for you by the Office for Senior Citizen Affairs (OSCA) Iligan City.</p>
            
            <div class="info-box">
                <h3 style="margin-top: 0; color: #667eea;">Visit Details</h3>
                <div class="info-row">
                    <span class="info-label">Registration ID:</span>
                    <span class="info-value">{{ $registration->registration_id }}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Date:</span>
                    <span class="info-value">{{ \Carbon\Carbon::parse($visit->scheduled_date)->format('l, F j, Y') }}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Time:</span>
                    <span class="info-value">{{ $visit->time_slot }}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Status:</span>
                    <span class="info-value">{{ $visit->status }}</span>
                </div>
                @if($visit->notes)
                <div class="info-row">
                    <span class="info-label">Notes:</span>
                    <span class="info-value">{{ $visit->notes }}</span>
                </div>
                @endif
            </div>
            
            <div class="highlight">
                <strong>⚠️ Important Reminders:</strong>
                <ul style="margin: 10px 0; padding-left: 20px;">
                    <li>Please ensure someone is available at your registered address during the scheduled time.</li>
                    <li>Have your OSCA ID or Registration ID ready for verification.</li>
                    <li>If you need to reschedule, please contact us at least 24 hours in advance.</li>
                </ul>
            </div>
            
            <p><strong>Your Address:</strong><br>
            {{ $registration->full_address }}</p>
            
            <p style="margin-top: 30px;">If you have any questions or concerns, please feel free to contact us:</p>
            
            <div style="background: #f8f9fa; padding: 15px; border-radius: 4px; margin: 15px 0;">
                <strong>Contact Information:</strong><br>
                📞 Phone: (063) 221-1234 Local 456<br>
                📧 Email: osca@iligancity.gov.ph<br>
                🏢 Office: Iligan City Hall Complex, Iligan City
            </div>
        </div>
        
        <div class="footer">
            <p style="margin: 5px 0;"><strong>Office for Senior Citizen Affairs (OSCA)</strong></p>
            <p style="margin: 5px 0;">Local Government Unit of Iligan City</p>
            <p style="margin: 5px 0;">Iligan City Hall Complex, Iligan City, Lanao del Norte, Philippines 9200</p>
            <p style="margin: 15px 0 5px 0;">This is an automated message. Please do not reply to this email.</p>
        </div>
    </div>
</body>
</html>
