namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SeniorCitizenRegistration extends Model
{
    protected $fillable = [
        'last_name', 'first_name', 'middle_name', 'suffix', 'date_of_birth', 'place_of_birth', 'gender', 'civil_status',
        'contact_number', 'email', 'house_number', 'street', 'barangay', 'city', 'province', 'zip_code',
        'emergency_contact_name', 'emergency_contact_relationship', 'emergency_contact_number', 'emergency_contact_address',
        'has_medical_conditions', 'medical_conditions', 'current_medications', 'allergies',
        'valid_id_front', 'valid_id_back', 'birth_certificate', 'proof_of_residency',
        'data_privacy_consent', 'terms_conditions'
    ];
}
