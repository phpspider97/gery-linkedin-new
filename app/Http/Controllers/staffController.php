<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Crypt;


class staffController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    { 
        $record_count = $request->input('record_count');
        if(!empty($record_count)){
            return User::where('login_level',3)
            ->select('user.*','user_role.role')
            ->join('user_role', 'user_role.id', '=', 'user.role_id')
            ->orderBy('id', 'DESC') 
            ->paginate($record_count); 
        }else{
            return User::where('login_level',3)
            ->select('user.*','user_role.role')
            ->join('user_role', 'user_role.id', '=', 'user.role_id')
            ->orderBy('id', 'DESC')
            ->get();
        }
       
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {  

        $is_email_exist = DB::table('user')->where('user_email',$request->user_email)->first();
        if(!empty($is_email_exist)){
            return response()->json([
                'msg' => 'Email already exist.',
                'status' => 200
            ],200);
        }
        $is_user_created = USER::create([
            'added_by' => Crypt::decryptString($request->user_token),
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'user_email' => $request->user_email,
            'user_password' => md5($request->user_password),
            'role_id' => $request->role_id, 
            'login_level'=> 3,
            'is_active' => $request->is_active
        ]);   
    
        if(!empty($is_user_created)){
            return response()->json([
                'msg' => 'Staff member created.',
                'status' => 200
            ],200);
        }else{
            return response()->json([
                'msg' => 'Staff member not created.',
                'status' => 'error'
            ],200);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    { 
        return USER::where('id',$id)->first();
    }

    public function showLoginUserData($id)
    {
        $id = Crypt::decryptString($id);
        return USER::where('id',$id)->first();
    }

    public function searchShow($search_data)
    {         
        if(!empty($search_data)){  
            return USER::where('login_level',3)
            ->select('user.*','user_role.role')
            ->join('user_role', 'user_role.id', '=', 'user.role_id')
            ->where('user.first_name','LIKE',"%{$search_data}%") 
            ->orWhere('user.last_name','LIKE',"%{$search_data}%")
            ->get();
        }else{  
            return USER::where('login_level',3)
            ->select('user.*','user_role.role')
            ->join('user_role', 'user_role.id', '=', 'user.role_id')
            ->limit(10)
            ->get();
        }
    }
    
    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //$id = Crypt::decryptString($id);
        $is_user_update = USER::where('id', $id)->update([ 
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'user_email' => $request->user_email,
            'user_password' => md5($request->user_password),
            'role_id' => $request->role_id, 
            'is_active' => $request->is_active
        ]);   
    
        if(!empty($is_user_update)){
            return response()->json([
                'msg' => 'Staff member updated.',
                'status' => 200
            ],200);
        }else{
            return response()->json([
                'msg' => 'Staff member not updated.',
                'status' => 'error'
            ],200);
        }
    }
 

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {   
        return USER::where('id',$id)->delete();
    }
}
