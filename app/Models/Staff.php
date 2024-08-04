<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Staff extends Model
{
    use HasFactory;

    protected $table = 'staff';
    protected $fillable = [
        'added_by',
        'first_name',
        'last_name',
        'user_email',
        'user_password',
        'role_id',
        'is_active',
        'token',
        'linkedin_id',
        'login_level'
    ];
}
