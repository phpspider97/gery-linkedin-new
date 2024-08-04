<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserRolePermission extends Model
{
    use HasFactory;
    protected $table = 'user_role_permission';
    // protected $fillable = [
    //     'role_id',
    //     'permission_id' 
    // ];

    // public function UserRole()
    // { 
    //     return $this->belongsTo(UserRole::class);
    // }
}
