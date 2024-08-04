<?php

namespace App\Http\Controllers;

use App\Models\UserRole;
 
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Crypt;
 
class userRoleController extends Controller
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
            return UserRole::orderBy('id', 'DESC')->paginate($record_count); 
        }else{   
            return $get_permission_data = UserRole::with(['rolePermission'])->where('is_active',1)->orderBy('id', 'DESC')->get();

            // $get_role_data = UserRole::get();

            // foreach($get_role_data as $k => $permissionData){
            //    $role_id =  $permissionData->id;
            //    $get_permission_data = UserRole::with(['rolePermission'])->find($role_id); 
            //    $get_role_data[$k]->permission_data = $get_permission_data;
            // }
            // return $get_role_data; 
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
        //dd($request->user_role_permission);
        $is_user_role_created = UserRole::create([
            'added_by' => Crypt::decryptString($request->user_token),
            'role' => $request->user_role,
            'is_active' => $request->is_active
        ]);   

        if(!empty($is_user_role_created)){
            if(!empty($request->user_role_permission)){
                foreach($request->user_role_permission as $permission_key=>$permission_value){ 
                    DB::table('user_role_permission')->insert([
                        'role_id' => $is_user_role_created->id,
                        'permission_id' => $permission_value
                    ]);
                }
            }

            return response()->json([
                'msg' => 'User role created.',
                'status' => 200
            ],200);
        }else{
            return response()->json([
                'msg' => 'User role not created.',
                'status' => 'error'
            ],500);
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
        $role_data = DB::table('user_role')->where('id',$id)->first();
        $role_id = $role_data->id;

        if(!empty($role_id)){
            $role_permission_data = DB::table('user_role_permission')->select('permission_id')->where('role_id',$role_id)->get();
        }

        $role_data->permission_data = $role_permission_data;

        return $role_data;
    }

    public function searchShow($search_data)
    {         
        if(!empty($search_data)){ 
            return UserRole::where('role','LIKE',"%{$search_data}%")->get();
        }else{ 
            return UserRole::limit(10)->get();
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
        $is_user_role_update = UserRole::where('id', $id)->update([ 
            'role' => $request->user_role??'',
            'is_active' => $request->is_active??0
        ]);   
         
        if(!empty($is_user_role_update)){

            if(!empty($request->user_role_permission)){
                DB::table('user_role_permission')->where([
                    'role_id' => $id
                ])->delete();
                foreach($request->user_role_permission as $permission_key=>$permission_value){ 
                    DB::table('user_role_permission')->insert([
                        'role_id' => $id,
                        'permission_id' => $permission_value
                    ]);
                }
            }

            return response()->json([
                'msg' => 'User role updated.',
                'status' => 200
            ],200);
        }else{
            return response()->json([
                'msg' => 'User role not updated.',
                'status' => 'error'
            ],500);
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
        return UserRole::where('id',$id)->delete();
    }
}
