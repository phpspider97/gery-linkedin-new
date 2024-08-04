<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class user extends Model
{
    use HasFactory;

    protected $table = 'user';
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
        'is_link',
        'campaign_group',
        'is_sync',
        'login_level',
        'user_token',
        'user_refresh_token'
    ];
}
