<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserRole extends Model
{
    use HasFactory;

    protected $table = 'user_role';
    protected $fillable = [
        'added_by',
        'role',
        'is_active',
    ];

    public function rolePermission(){ 
        return $this->hasMany(UserRolePermission::class, 'role_id');
    }
}
