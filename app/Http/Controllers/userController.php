<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Str;

class userController extends Controller
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
            return User::orderBy('id', 'DESC')->where('login_level',2)->paginate($record_count);
        }else{
            return User::where('login_level',2)->orderBy('id', 'DESC')->get();
        } 
    }

    public function getPermission(Request $request)
    {   
        $login_level = $request->input('login_level');
        $user_token = $request->input('user_token');

        $user_id = Crypt::decryptString($user_token);
        $user_data = DB::table('user')->select('role_id')->where('id',$user_id)->first();
        if($login_level == 3){
           return DB::table('user_role_permission')->where('role_id',$user_data->role_id)->get()->pluck('permission_id');
        }
        
    }
    public function totalAffectedAds(){
        $total_user = DB::table('user')->where('login_level',2)->get()->count();
        $total_parameter = DB::table('utm_parameter_update')->get()->count();
         
        return response()->json([
            "total_user" => $total_user,
            "total_parameter" => $total_parameter,
        ],200);
    }

    public function userAccountDetail($a_encrypt_user_id){    
        $encrypt_user_id = explode('-',$a_encrypt_user_id)[0];
        $for_user = explode('-',$a_encrypt_user_id)[1];
        $user_id = Crypt::decryptString($encrypt_user_id);
        if(!empty($for_user)){  //dd($user_id);
            return DB::table('user_account_detail')->where(['user_id'=>$user_id])->get();
        }else{
            return DB::table('user_account_detail')->where(['user_id'=>$user_id,'is_delete'=>0])->get();
        }
    }

    public function updateUserAccountDetail(Request $request){ 
        $user_id = Crypt::decryptString($request->user_id);
        try{
            DB::table('user_account_detail')->where('user_id',$user_id)->update([
                'is_active' => 0
            ]);
            foreach($request->user_ads_account as $account_value){ 
                DB::table('user_account_detail')->where('account_id',"$account_value")->update([
                    'is_active' => 1
                ]);
            } 
            return response()->json([
                'msg' => 'User account updated.',
                'status' => 'success'
            ],200);
        }catch (\Exception $exception){ 
            return response()->json([
                'msg' => $exception->getMessage(),
                'status' => 'error'
            ],404);
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
        // if(!empty($request->is_link) && empty($request->is_sync)){
        //     app('App\Http\Controllers\LinkedinApi')->createCampaignGroup($request);
        // }
        $is_email_exist = DB::table('user')->where('user_email',$request->user_email)->first();
        if(!empty($is_email_exist)){
            return response()->json([
                'msg' => 'Email already exist.',
                'status' => 200
            ],200);
        }
        $is_user_created = User::create([
            'added_by' => Crypt::decryptString($request->user_token),
            'campaign_group' => $request->campaign_group,
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'user_email' => $request->user_email,
            'user_password' => md5($request->user_password),
            'role_id' => $request->role_id,
            //'linkedin_id' => $request->linkedin_id,
            // 'is_sync' => ($request->is_link)?1:0,
            // 'is_link' => $request->is_link,
            'login_level'=>2,
            'is_active' => $request->is_active
        ]);   
        $user_id = $is_user_created->id;
        
        if(!empty($request->linkedin_id)){
            $a_linkedin_id = explode(',',$request->linkedin_id);
            if(!empty($a_linkedin_id)){
                foreach($a_linkedin_id as $linkedin_id){
                    DB::table('user_account_detail')->insert([
                        'user_id' => $user_id,
                        'account_id' => $linkedin_id,
                        'is_active' => 0
                    ]);
                }
            }
        }

        if(!empty($is_user_created)){
            $details = [
                'user_name' => $request->first_name.' '.$request->last_name,
                'user_email' => $request->user_email,
                'user_password' => $request->user_password,
            ];
            \Mail::to($request->user_email)->send(new \App\Mail\AddUser($details));
            return response()->json([
                'msg' => 'User created.',
                'status' => 200
            ],200);
        }else{
            return response()->json([
                'msg' => 'User not created.',
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
        //return User::where('id',$id)->first();
        $user_data = DB::table('user')->where('id',$id)->first(); 
        $ads_account_data = DB::table('user_account_detail')->where(['user_id'=>$id,'is_delete'=>0])->get()->pluck('account_id'); 
        $user_data->ads_account_data = $ads_account_data;
        return $user_data;
    }

    public function showLoginUserData($id)
    {
        $id = Crypt::decryptString($id);
        return User::where('id',$id)->first();
    }

    public function searchShow($search_data)
    {         
        if(!empty($search_data)){  
            return USER::where('login_level',2)
            ->where('first_name','LIKE',"%{$search_data}%")
            ->orWhere('last_name','LIKE',"%{$search_data}%")
            ->get();
        }else{  
            return USER::where('login_level',2)
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
        // create linkedin account
        // if(!empty($request->is_link) && empty($request->is_sync)){
        //     app('App\Http\Controllers\LinkedinApi')->createCampaignGroup($request);
        // }

        $is_user_update = User::where('id', $id)->update([ 
            'campaign_group' => $request->campaign_group,
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'user_email' => $request->user_email,
            'user_password' => md5($request->user_password),
            'role_id' => $request->role_id,
            //'linkedin_id' => $request->linkedin_id,
            // 'is_link' => $request->is_link,
            'is_active' => $request->is_active
        ]);   
    
        $user_id = $id;

        if(!empty($request->linkedin_id)){
            $a_linkedin_id = explode(',',$request->linkedin_id);
            if(!empty($a_linkedin_id)){
                DB::table('user_account_detail')->where('user_id',$user_id)->update(['is_active'=>0,'is_delete'=>1]);
                foreach($a_linkedin_id as $linkedin_id){ 
                    DB::table('user_account_detail')->updateOrInsert([
                        'user_id'=>$user_id,
                        'account_id'=>$linkedin_id
                    ],[ 
                        'user_id'=>$user_id,
                        'account_id'=>$linkedin_id, 
                        'is_active'=>1, 
                        'is_delete'=>0,
                    ]);
                }
            }
        }

        if(!empty($is_user_update)){
            return response()->json([
                'msg' => 'User updated.',
                'status' => 200
            ],200);
        }else{
            return response()->json([
                'msg' => 'User not updated.',
                'status' => 'error'
            ],200);
        }
    }

    public function changeProfile(Request $request)
    {
        $id = $request->id;
        $id = Crypt::decryptString($id);
        $is_user_update = User::where('id', $id)->update([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'user_email' => $request->user_email
        ]);   
          
        /* User Image Upload */
            $image_path = '';
            if($request->file('image')){
                $extension      =   $request->file('image')->extension();
                $fileName       =    Str::slug($request->first_name).'.'.$extension;
                $request->file('image')->storeAs('public/user-image', $fileName);
                DB::table('user')->where('id',$id)->update([
                    'image_path' => $fileName
                ]);
                $image_path = env('APP_URL').'/storage/user-image/'.$fileName;
            }
        /* User Image Upload */ 

        if(!empty($is_user_update)){
            return response()->json([
                'msg' => 'Your information updated.',
                'image' => $image_path,
                'status' => 'success'
            ],200);
        }else{
            return response()->json([
                'msg' => 'Your information not updated.',
                'image' => $image_path,
                'status' => 'error'
            ],200);
        }
    }


    public function changePassword(Request $request, $user_id)
    {         
        $user_id = Crypt::decryptString($user_id);

        $is_user_password = User::select('first_name')->where(['id'=> $user_id,'user_password' => md5($request->old_password)])->first();   
        try {
            if(!empty($is_user_password)){  
                User::where(['id'=> $user_id,'user_password' => md5($request->old_password)])->update([
                    "user_password" => md5($request->new_password)
                ]);
                return response()->json([
                    'msg' => 'Your password changed.',
                    'status' => 'success'
                ],200);
            }else{  
                return response()->json([
                    'msg' => 'Your old password not match.',
                    'status' => 'error'
                ],200);
            }
        }catch (\Exception $exception){ 
            return response()->json([
                'msg' => $exception->getMessage(),
                'status' => 'error'
            ],404);
        }
 
    }
 
    public function forgotPassword(Request $request)
    {         
        $is_user_exist = User::select('id')->where(['user_email'=> $request->user_email])->first();   
        try {
            if(!empty($is_user_exist->id)){  
                $encrypt_id = Crypt::encryptString($is_user_exist->id);
                $details = [
                    'link' => 'https://www.pipelight.io/change-forgot-password/'.$encrypt_id
                ];
               
                \Mail::to($request->user_email)->send(new \App\Mail\ForgotPasswordMail($details));

                return response()->json([
                    'msg' => 'Please check your email.',
                    'status' => 'success'
                ],200);
            }else{  
                return response()->json([
                    'msg' => 'This email is not in our database.',
                    'status' => 'error'
                ],200);
            }
        }catch (\Exception $exception){ 
            return response()->json([
                'msg' => $exception->getMessage(),
                'status' => 'error'
            ],404);
        }
 
    }


    public function changeForgotPassword(Request $request)
    {   
        $user_id = Crypt::decryptString($request->id);
        $is_user_exist = User::select('first_name')->where(['id'=> $user_id])->first();   
        try {
            if(!empty($is_user_exist)){  
                User::where(['id'=> $user_id])->update([
                    "user_password" => md5($request->new_password)
                ]);
                return response()->json([
                    'msg' => 'Your password changed successfully.',
                    'status' => 'success'
                ],200);
            }else{  
                return response()->json([
                    'msg' => "This user doesn't exist.",
                    'status' => 'error'
                ],200);
            }
        }catch (\Exception $exception){ 
            return response()->json([
                'msg' => $exception->getMessage(),
                'status' => 'error'
            ],404);
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
        return User::where('id',$id)->delete();
    }

    public function utmParameter(Request $request){ 
        $added_by = Crypt::decryptString($request->user_token);
        $utm_name_id =  $request->utm_name_id;
        $operation_text = 'added';

        if(!empty($request->a_utm_parameter)){ 
            //dd($request->a_utm_parameter);
            if(empty($utm_name_id)){
                $utm_name_id = DB::table('utm_name')->insertGetId([
                    'utm_name' => $request->utm_name,
                    'added_by' => $added_by,
                    'campaign_id' => $request->campaign_id,
                    'creative_id' => $request->creative_id,
                    'account_id' => $request->account_id,
                ]);
            }else{
                DB::table('utm_name')->where('id',$utm_name_id)->update([
                    'utm_name' => $request->utm_name, 
                    'campaign_id' => $request->campaign_id,
                    'creative_id' => $request->creative_id,
                ]);
            }
            //dd($request->a_utm_parameter);
            foreach($request->a_utm_parameter as $array_key => $utm_parameter){
                $additional_utm_parameter =    explode('#',$utm_parameter)[0];
                $parameter_id = explode('|',$additional_utm_parameter)[0];
                $parameter_operation = explode('|',$additional_utm_parameter)[1];
                $parameter_key = explode('|',$additional_utm_parameter)[2];

                $parameter_field =  explode('#',$utm_parameter)[1];
                $parameter_value =  explode('#',$utm_parameter)[2];
  
                if(!empty($parameter_key) && !empty($parameter_value)){
                    $is_parameter_insert = true; 
                    if($parameter_operation == 'insert'){   
                        $is_parameter_insert = DB::table('utm_parameter')->insertGetId([ 
                            'utm_name_id' => $utm_name_id, 
                            'parameter_key' => $parameter_key,
                            'parameter_field' => $parameter_field,
                            'parameter_value' => $parameter_value,
                            'added_by' => $added_by
                        ]); 
                    }else{
                        $operation_text = 'update';
                        DB::table('utm_parameter')->where('id',$parameter_id)->update([ 
                            'utm_name_id' => $utm_name_id, 
                            'parameter_key' => $parameter_key,
                            'parameter_field' => $parameter_field,
                            'parameter_value' => $parameter_value,
                            'added_by' => $added_by
                        ]); 
                    }
                }
            }
        } 
        if(!empty($is_parameter_insert)){
            return response()->json([
                'msg' => "UTM parameter $operation_text.",
                'status' => 200
            ],200);
        }else{
            return response()->json([
                'msg' => "UTM parameter not $operation_text.",
                'status' => 'error'
            ],200);
        }
    }

    public function getUtmParameterDetail($a_encrypt_user_id){   
        $account_id = explode('-',$a_encrypt_user_id)[0];
        $encrypt_user_id = explode('-',$a_encrypt_user_id)[1];
        $user_id = Crypt::decryptString($encrypt_user_id);
        
        if(!empty($account_id)){
            $a_account_id = explode(',',$account_id);
        }
        //dd($a_account_id);
        if(!empty($user_id)){
            $a_store_account_id = DB::table('utm_name')->select('id','account_id')->where([
                'added_by'=>$user_id
            ])->get();
            if(!empty($a_store_account_id)){
                $a_selected_utm_id = [];
                foreach($a_store_account_id as $k=>$utm_data){
                    $utm_store_id = $utm_data->id;
                    $utm_store_account_id = $utm_data->account_id;
                    if(!empty($utm_store_account_id)){
                        $a_utm_store_account_id = explode(',',$utm_store_account_id);
                        if(!empty($a_utm_store_account_id)){
                            foreach($a_utm_store_account_id as $utm_key=>$utm_selected_data){ 
                                if(in_array($utm_selected_data,$a_account_id)){
                                    $a_selected_utm_id[] = $utm_store_id;
                                }else{
                                    $a_selected_utm_id[] = 0;
                                }
                            }
                        }
                    }
                }
            }
            if(!empty($a_selected_utm_id)){
                $a_unique_selected_utm_id = array_unique($a_selected_utm_id);
            }else{
                $a_unique_selected_utm_id = [];
            } 
            //dd($a_unique_selected_utm_id);
            return DB::table('utm_name')->whereIn('id',$a_unique_selected_utm_id)->orderBy('id', 'DESC')->get();
        } 
    }
    public function getUtmUpdate($a_encrypt_user_id){
        //dd(1);
        $encrypt_user_id = explode('-',$a_encrypt_user_id)[0];
        $display_permission = explode('-',$a_encrypt_user_id)[1];
        $is_admin = @explode('-',$a_encrypt_user_id)[2];

        if(!empty($is_admin)){
            $user_id = $encrypt_user_id;
        }else{
            $user_id = Crypt::decryptString($encrypt_user_id);
        }
        if($display_permission == 'limit'){
            return DB::table('utm_parameter_update')->select(
            DB::raw('count(utm_parameter_update.ads_id) as total_ads_effect'),'utm_name.utm_name')
            ->join('utm_name', 'utm_name.id', '=', 'utm_parameter_update.utm_parameter_name_id')->where('user_id',$user_id)->groupBy('utm_parameter_update.utm_parameter_name_id')->get();
        }else{
            return DB::table('utm_parameter_update')->select('utm_name.utm_name','utm_parameter_update.*')
            ->join('utm_name', 'utm_name.id', '=', 'utm_parameter_update.utm_parameter_name_id')->where('user_id',$user_id)->orderBy('created_at','desc')->get();
        }
    }
    public function getUnreadUpdate($encrypt_user_id){
        
        $user_id = Crypt::decryptString($encrypt_user_id);

        return DB::table('utm_parameter_update')->where(['user_id'=>$user_id,'is_read'=>0])->get()->count();
    }
    public function updateUnread($encrypt_user_id){
        $user_id = Crypt::decryptString($encrypt_user_id);
        $is_update =  DB::table('utm_parameter_update')->where(['user_id'=>$user_id,'is_read'=>0])->update([
            'is_read'=>1
        ]);
        if($is_update){
            return response()->json([
                'msg' => "All notification read.",
                'status' => 200
            ],200);
        }else{
            return response()->json([
                'msg' => "Some issue to update read notification",
                'status' => 'error'
            ],200);
        }
    }
    public function getPerticularUtmDetail($utm_id){     
        if(!empty($utm_id)){
            $a_utm_name  = DB::table('utm_name')
           // ->join('utm_parameter', 'utm_parameter.utm_name_id', '=', 'utm_name.id')
            ->where([
                'utm_name.id'=>$utm_id
            ])->get();
   
            $utm_parameter  = DB::table('utm_parameter')->select('id',DB::raw('CONCAT(parameter_key,",",parameter_field,",",parameter_value) AS parameter_data'))->where([
                'utm_name_id'=>$utm_id
            ])->get()->pluck('parameter_data','id');

            // remove utm_
            if(!empty($utm_parameter)){
                foreach($utm_parameter as $paramer_key=>$utm_parameter_value){
                    $update_parameter[$paramer_key] = $utm_parameter_value;
                }  
            }
            if(!empty($a_utm_name)){
                foreach( $a_utm_name as $utm_name_key => $a_utm_name_value ){
                    $a_utm_name[0]->parameter = $update_parameter; 
                }
            }
            return $a_utm_name;
        } 
    }
    public function deletePerticularUtmName($id)
    {   
        DB::table('utm_name')->where('id',$id)->delete();
        $is_parameter_delete = DB::table('utm_parameter')->where('utm_name_id',$id)->delete();

        if(!empty($is_parameter_delete)){
            return response()->json([
                'msg' => "UTM deleted.",
                'status' => 200
            ],200);
        }else{
            return response()->json([
                'msg' => "UTM not deleted.",
                'status' => 'error'
            ],200);
        }
    }
    public function deletePerticularUtmParameter($id)
    {    
        $is_parameter_delete = DB::table('utm_parameter')->where('id',$id)->delete();
        if(!empty($is_parameter_delete)){
            return response()->json([
                'msg' => "UTM parameter deleted.",
                'status' => 200
            ],200);
        }else{
            return response()->json([
                'msg' => "UTM parameter not deleted.",
                'status' => 'error'
            ],200);
        }
    }
}
