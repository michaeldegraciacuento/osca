<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Senior Citizen Registration Form</title>
    <style>
        @page {
            margin: 1cm;
        }
        
        body {
            font-family: Arial, sans-serif;
            font-size: 9pt;
            line-height: 1.2;
            color: #000;
        }
        
        .header {
            text-align: center;
            margin-bottom: 5px;
        }
        
        .header h3 {
            margin: 2px 0;
            font-size: 11pt;
        }
        
        .header h2 {
            margin: 2px 0;
            font-size: 12pt;
            font-weight: bold;
        }
        
        .logo {
            width: 60px;
            height: 60px;
            position: absolute;
        }
        
        .logo-left {
            left: 30px;
            top: 10px;
        }
        
        .logo-right {
            right: 30px;
            top: 10px;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 3px;
        }
        
        table, th, td {
            border: 1px solid #000;
        }
        
        th, td {
            padding: 3px 5px;
            text-align: left;
            vertical-align: top;
        }
        
        .field-label {
            font-weight: bold;
            font-size: 8pt;
            text-transform: uppercase;
        }
        
        .field-value {
            border-bottom: 1px solid #000;
            min-height: 18px;
            display: inline-block;
            width: 100%;
        }
        
        .inline-field {
            display: inline-block;
            margin-right: 10px;
        }
        
        .checkbox {
            display: inline-block;
            width: 15px;
            height: 15px;
            border: 1px solid #000;
            margin-right: 5px;
            text-align: center;
            vertical-align: middle;
        }
        
        .section-title {
            background-color: #e0e0e0;
            font-weight: bold;
            text-align: center;
            padding: 4px;
            text-transform: uppercase;
        }
        
        .small-text {
            font-size: 7pt;
        }
        
        .note {
            font-style: italic;
            font-size: 7pt;
            margin-top: 5px;
        }
        
        .watermark {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            font-size: 80pt;
            color: rgba(200, 200, 200, 0.3);
            font-weight: bold;
            z-index: -1;
        }
    </style>
</head>
<body>
    <div class="watermark">NOT FOR SALE</div>
    
    <div class="header">
        <h3>Office for the Senior Citizens Affairs</h3>
        <h3><em>City of Iligan</em></h3>
        <h2>APPLICATION / REGISTRATION FOR</h2>
        <h2>SENIOR CITIZEN'S NATIONAL I.D (White) CARD</h2>
    </div>
    
    <p style="margin: 5px 0;"><em>Please print clearly</em></p>
    
    <table>
        <tr>
            <td colspan="3">
                <span class="field-label">Surname</span>
                <div class="field-value">{{ strtoupper($registration->last_name) }}</div>
            </td>
            <td colspan="2">
                <span class="field-label">First Name</span>
                <div class="field-value">{{ strtoupper($registration->first_name) }}</div>
            </td>
            <td colspan="2">
                <span class="field-label">Middle Name</span>
                <div class="field-value">{{ strtoupper($registration->middle_name ?? '') }}</div>
            </td>
            <td>
                <span class="field-label">AGE:</span>
                <div class="field-value">{{ $registration->age }}</div>
            </td>
            <td colspan="2">
                <span class="field-label">DATE OF BIRTH:</span>
                <div class="field-value">{{ \Carbon\Carbon::parse($registration->date_of_birth)->format('m/d/Y') }}</div>
            </td>
            <td colspan="2">
                <span class="field-label">CIVIL STATUS:</span>
                <div class="field-value">{{ $registration->civil_status }}</div>
            </td>
        </tr>
    </table>
    
    <table>
        <tr>
            <td colspan="8">
                <span class="field-label">CURRENT ADDRESS:</span>
                <div class="field-value">{{ strtoupper($registration->full_address) }}</div>
            </td>
            <td colspan="2">
                <span class="field-label">SINCE WHEN?</span>
                <div class="field-value"></div>
            </td>
            <td colspan="2">
                <span class="field-label">TEL No.(s)</span>
                <div class="field-value">{{ $registration->contact_number }}</div>
            </td>
        </tr>
    </table>
    
    <table>
        <tr>
            <td colspan="2">
                <span class="field-label">No.</span>
                <div class="field-value">{{ strtoupper($registration->house_number) }}</div>
            </td>
            <td colspan="4">
                <span class="field-label">Street</span>
                <div class="field-value">{{ strtoupper($registration->street) }}</div>
            </td>
            <td colspan="6">
                <span class="field-label">Barangay</span>
                <div class="field-value">{{ strtoupper($registration->barangay) }}</div>
            </td>
        </tr>
    </table>
    
    <table>
        <tr>
            <td colspan="12">
                <span class="field-label">CURRENT TYPE OF RESIDENCY - Check one:</span>
                <span class="checkbox"></span> House Owner
                <span class="checkbox" style="margin-left: 20px;"></span> Lessee/Tenant
                <span class="checkbox" style="margin-left: 20px;"></span> Boarder
                <span class="checkbox" style="margin-left: 20px;"></span> Sharer
            </td>
        </tr>
    </table>
    
    <table>
        <tr>
            <td colspan="6">
                <span class="field-label">PREVIOUS ADDRESS:</span>
                <div class="field-value"></div>
            </td>
            <td colspan="6">
                <span class="field-label">Dates of Residency at Previous Address:</span>
                <div class="field-value">From: __________ To: __________</div>
            </td>
        </tr>
    </table>
    
    <table>
        <tr>
            <td colspan="6">
                <span class="field-label">PROVINCIAL ADDRESS:</span>
                <div class="field-value">{{ strtoupper($registration->province) }}</div>
            </td>
            <td colspan="6">
                <span class="field-label">DIALECT(s) SPOKEN:</span>
                <div class="field-value"></div>
            </td>
        </tr>
    </table>
    
    <table>
        <tr>
            <td colspan="3">
                <span class="field-label">PLACE OF BIRTH</span>
                <div class="field-value">{{ strtoupper($registration->place_of_birth ?? '') }}</div>
            </td>
            <td colspan="2">
                <span class="field-label">GENDER:</span>
                <div class="field-value">{{ $registration->gender }}</div>
            </td>
            <td>
                <span class="field-label">HEIGHT:</span>
                <div class="field-value"></div>
            </td>
            <td>
                <span class="field-label">WEIGHT:</span>
                <div class="field-value"></div>
            </td>
            <td colspan="5">
                <span class="field-label">OCCUPATION / PENSION:</span>
                <div class="field-value"></div>
            </td>
        </tr>
    </table>
    
    <table>
        <tr>
            <td colspan="6">
                <span class="field-label">EDUCATIONAL ATTAINMENT:</span>
                <div class="field-value"></div>
            </td>
            <td colspan="6">
                <span class="field-label">SKILLS / TALENT'S:</span>
                <div class="field-value"></div>
            </td>
        </tr>
    </table>
    
    <table>
        <tr>
            <td colspan="4">
                <span class="field-label">NAME OF SPOUSE, if Married</span>
                <div class="field-value"></div>
            </td>
            <td colspan="3">
                <span class="field-label">DATE OF BIRTH:</span>
                <div class="field-value"></div>
            </td>
            <td colspan="3">
                <span class="field-label">DATE OF MARRIAGE:</span>
                <div class="field-value"></div>
            </td>
            <td colspan="2">
                <span class="field-label">PLACE OF MARRIAGE</span>
                <div class="field-value"></div>
            </td>
        </tr>
    </table>
    
    <table>
        <tr>
            <td colspan="12">
                <span class="field-label">Have you been issued a Senior Citizen N.I.D (White) Card before?</span>
                <span class="checkbox">{{ isset($registration->has_previous_id) && !$registration->has_previous_id ? '✓' : '' }}</span> No
                <span class="checkbox" style="margin-left: 20px;">{{ isset($registration->has_previous_id) && $registration->has_previous_id ? '✓' : '' }}</span> Yes
            </td>
        </tr>
        <tr>
            <td colspan="12">
                <span class="field-label">IF YES:</span>
                I.D. No: _____________ Place of issue: _____________ Date of issue: _____________
            </td>
        </tr>
    </table>
    
    <table>
        <tr>
            <td colspan="12" class="section-title">FAMILY COMPOSITION</td>
        </tr>
        <tr>
            <td colspan="1" style="text-align: center;"><strong>#</strong></td>
            <td colspan="4" style="text-align: center;"><strong>Name</strong></td>
            <td colspan="2" style="text-align: center;"><strong>Relationship</strong></td>
            <td colspan="2" style="text-align: center;"><strong>Age</strong></td>
            <td colspan="2" style="text-align: center;"><strong>Civil Status</strong></td>
            <td colspan="1" style="text-align: center;"><strong>Profession</strong></td>
        </tr>
        <tr>
            <td colspan="1">1</td>
            <td colspan="4"></td>
            <td colspan="2"></td>
            <td colspan="2"></td>
            <td colspan="2"></td>
            <td colspan="1"></td>
        </tr>
        <tr>
            <td colspan="1">2</td>
            <td colspan="4"></td>
            <td colspan="2"></td>
            <td colspan="2"></td>
            <td colspan="2"></td>
            <td colspan="1"></td>
        </tr>
        <tr>
            <td colspan="1">3</td>
            <td colspan="4"></td>
            <td colspan="2"></td>
            <td colspan="2"></td>
            <td colspan="2"></td>
            <td colspan="1"></td>
        </tr>
        <tr>
            <td colspan="1">4</td>
            <td colspan="4"></td>
            <td colspan="2"></td>
            <td colspan="2"></td>
            <td colspan="2"></td>
            <td colspan="1"></td>
        </tr>
        <tr>
            <td colspan="1">5</td>
            <td colspan="4"></td>
            <td colspan="2"></td>
            <td colspan="2"></td>
            <td colspan="2"></td>
            <td colspan="1"></td>
        </tr>
        <tr>
            <td colspan="12" class="small-text"><em>(Use reverse side, if necessary)</em></td>
        </tr>
    </table>
    
    <table>
        <tr>
            <td colspan="12" class="section-title">MEMBERSHIP IN OTHER SENIOR CITIZENS ASSOCIATION</td>
        </tr>
        <tr>
            <td colspan="6" style="text-align: center;"><strong>Name</strong></td>
            <td colspan="3" style="text-align: center;"><strong>Location</strong></td>
            <td colspan="3" style="text-align: center;"><strong>Position (if an Officer, date elected)</strong></td>
        </tr>
        <tr>
            <td colspan="6"></td>
            <td colspan="3"></td>
            <td colspan="3"></td>
        </tr>
    </table>
    
    <table>
        <tr>
            <td colspan="6" style="vertical-align: top;">
                <div class="field-label">QUALIFICATIONS:</div>
                <div class="small-text">
                    1. Sixty (60) years old and above.<br>
                    2. Filipino Citizen or with Dual Citizenship.<br>
                    3. Registered voter of Iligan City and is current resident.
                </div>
                <div class="field-label" style="margin-top: 10px;">REQUIREMENTS:</div>
                <div class="small-text">
                    1. Latest Comelec ID or Certificate of Registration as Voter of Iligan.<br>
                    2. Plus any one of the following:<br>
                    <div style="margin-left: 10px;">
                        a. Birth Certificate<br>
                        b. Baptismal Certificate<br>
                        c. Valid Passport<br>
                        d. SSS/GSIS ID with date of birth<br>
                        e. PRC Card<br>
                        f. Income Tax Return<br>
                        g. Two (2) copies "1x1" ID photos (with white background) taken not more than 6 months.
                    </div>
                </div>
                <div class="note">
                    <strong>NOTE:</strong> Attach xerox copies of requirements 1 and 2 to this form. Present to your Chapter President/Coordinator together with the originals for authentication, and thereafter to OSCA Office for final processing.
                </div>
            </td>
            <td colspan="6" style="vertical-align: top;">
                <div class="field-label">APPLICANT'S STATEMENT:</div>
                <div class="small-text" style="margin-bottom: 20px;">
                    <strong>I CERTIFY</strong> that the above information discovered is true and correct. Any false information discovered in the future shall cause the immediate forfeiture of all rights and benefits accruing and seizure of the N.I.D issued to me.
                </div>
                
                <div style="margin-top: 30px; text-align: center;">
                    <div style="border-bottom: 1px solid #000; width: 70%; margin: 0 auto 5px;">
                        
                    </div>
                    <div class="small-text">Signature or Thumbmark of Applicant</div>
                </div>
                
                <div style="margin-top: 10px;">
                    <span class="field-label">Date:</span>
                    <div class="field-value" style="width: 40%;"></div>
                </div>
                
                <div style="margin-top: 20px; text-align: center;">
                    <div style="border-bottom: 1px solid #000; width: 70%; margin: 0 auto 5px;">
                        <strong>ATTESTED:</strong>
                    </div>
                    <div class="small-text">Barangay Chapter President of Senior Citizen</div>
                </div>
                
                <div style="margin-top: 20px;">
                    <span class="field-label">Date:</span>
                    <div class="field-value" style="width: 40%;"></div>
                </div>
                
                <div style="margin-top: 10px;">
                    <span class="field-label">NOTED:</span>
                    <div style="text-align: center; margin-top: 30px;">
                        <div style="border-bottom: 1px solid #000; width: 70%; margin: 0 auto;">
                            <strong>FREDERICK W. SIAO</strong>
                        </div>
                        <div class="small-text">City Mayor</div>
                    </div>
                </div>
                
                <div class="field-label" style="margin-top: 20px;">ORIGINAL PHOTOS TAKEN NOT MORE THAN 6 MONTHS</div>
                <table style="margin-top: 5px;">
                    <tr>
                        <td style="text-align: center; width: 50%;">
                            <div class="small-text">Paste here<br>1"x1"<br>with<br>white/backgroun<br>d<br>photo<br>(For OSCA File)</div>
                        </td>
                        <td style="text-align: center; width: 50%;">
                            <div class="small-text">Paste here<br>1"x1"<br>with<br>white/backgroun<br>d<br>photo<br>(For ID Card)</div>
                        </td>
                    </tr>
                </table>
                
                <div style="margin-top: 10px;">
                    <span class="field-label">Remarks, if any:</span>
                    <div class="field-value"></div>
                </div>
            </td>
        </tr>
    </table>
    
    <div style="text-align: right; margin-top: 10px; font-size: 7pt;">
        Revised: 9.12.2012/Genty
    </div>
</body>
</html>
