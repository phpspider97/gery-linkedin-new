<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;

use Illuminate\Support\Facades\Crypt;
use App\Http\Controllers\userController;
use App\Http\Controllers\staffController;
use App\Http\Controllers\userRoleController;
use App\Http\Controllers\LinkedinApi;
use App\Http\Controllers\HubspotApi;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });

Route::post('/login', function(Request $request) {
    $is_user_exist = DB::table('user')->where([
        'user_email' => $request->user_email,
        'user_password' => md5($request->user_password),
        'is_active' => 1
    ])->first();    
       
    if(!empty($is_user_exist)){
        $redirect = ($is_user_exist->login_level == 2)?'user':'admin';
        $ecrypt_user_id = Crypt::encryptString($is_user_exist->id);

        DB::table('user')->where([
            'id' => $is_user_exist->id
        ])->update([
            "token" => $ecrypt_user_id
        ]);   

        // Get the multiple account id
        $a_linkedin_account_id = DB::table('user_account_detail')->select('account_id')->where(['user_id'=>$is_user_exist->id,'is_active'=>1])->get(); 
        $linkedin_account_id = 0;
        if(!empty($a_linkedin_account_id)){
            foreach( $a_linkedin_account_id as $account_value){ 
                $a_account_id[] = $account_value->account_id;
            }
            if(!empty($a_account_id)){
                $linkedin_account_id = implode(',',$a_account_id);
            }
        }
         
        if($is_user_exist->image_path){
            $image_path = env('APP_URL').'/storage/user-image/'.$is_user_exist->image_path;
        }else{
            $image_path = '';
        }
        return response()->json([ 
            'token' => $ecrypt_user_id,
            'user_name' => $is_user_exist->first_name.' '.$is_user_exist->last_name,
            'linkedin_id' => $linkedin_account_id,
            'login_level' => $is_user_exist->login_level,
            'redirect' => $redirect,
            'image' => $image_path,
            'status' => 'success'
        ],200);
    }else{
        return response()->json([
            'msg' => 'Your credential not correct or not active by admin.',
            'status' => 'error'
        ],200);
    }
});

Route::post('/register', function(Request $request) {
    $is_user_exist = DB::table('user')->where([
        'user_email' => $request->user_email 
    ])->first();    
       
    if(empty($is_user_exist)){
        
        $user_id = DB::table('user')->insertGetId([
            'first_name' => $request->first_name??'',
            'last_name' => $request->last_name??'',
            'user_email' => $request->user_email,
            'user_password' => md5($request->user_password),
            'added_by' => 0,
            'is_active' => 1,
            'login_level' => 2
        ]);
        
        if($user_id){
            $ecrypt_user_id = Crypt::encryptString($user_id);
            DB::table('user')->where([
                'id' => $user_id
            ])->update([
                "token" => $ecrypt_user_id
            ]);   

            return response()->json([
                'token' => $ecrypt_user_id,
                'user_name' => $request->first_name.' '.$request->last_name,
                'redirect' => 'user',
                'status' => 'success'
            ],200);
        }else{
            return response()->json([
                'msg' => 'Technical issue.',
                'status' => 'error'
            ],200);
        }
    }else{
        return response()->json([
            'msg' => 'This email is already registered.',
            'status' => 'error'
        ],200);
    } 
});

Route::get('/getAdsUpdated/{user_token}', function ($user_token) { 
    $display_error_msg = '';
    $a_utm_cron_data = DB::table('utm_parameter_cron')->where(['utm_type'=>1,'user_token'=>$user_token])->get();

    $error_data = DB::table('error_detail')->where(['is_display'=>0,'user_token'=>Crypt::decryptString($user_token)])->first();
    if(isset($error_data->id) && !empty($error_data)){ 
        DB::table('error_detail')->where(['id'=>$error_data->id])->update(['is_display'=>1]);
        $creative_id = $error_data->creative_id;
        $response_code = $error_data->response_code;
        if($response_code == 403){
            $display_error_msg = "You don't have access to update this ads ($creative_id). Please contact with administrative.";
        }else{
            $display_error_msg = "Some technical issue. Creative ID $creative_id not updated.";
        }
    }

    return response()->json([
        'pending_ads' => count($a_utm_cron_data),
        'display_error' => $display_error_msg,
        'status' => 'success'
    ],200);
});

Route::get('/getCreativeUpdated/{user_token}', function ($user_token) { 
    $display_error_msg = '';
    $a_utm_cron_data = DB::table('utm_parameter_cron')->where(['utm_type'=>2,'user_token'=>$user_token])->get();

    $error_data = DB::table('error_detail')->where(['is_display'=>0,'user_token'=>Crypt::decryptString($user_token)])->first();
    if(isset($error_data->id) && !empty($error_data)){ 
        DB::table('error_detail')->where(['id'=>$error_data->id])->update(['is_display'=>1]);
        $creative_id = $error_data->creative_id;
        $response_code = $error_data->response_code;
        if($response_code == 403){
            $display_error_msg = "You don't have access to update this ads ($creative_id). Please contact with administrative.";
        }else{
            $display_error_msg = "Some technical issue. Creative ID $creative_id not updated.";
        }
    }
    return response()->json([
        'pending_ads' => count($a_utm_cron_data),
        'display_error' => $display_error_msg,
        'status' => 'success'
    ],200);
});

Route::resource('/staff',staffController::class);
Route::get('/staff/search/{search_data}',[staffController::class,'searchShow']);


Route::get('/user/search/{search_data}',[userController::class,'searchShow']);
Route::get('/user/userAccountDetail/{user_id}',[userController::class,'userAccountDetail']);
Route::post('/user/userAccountDetail',[userController::class,'updateUserAccountDetail']);
Route::post('/user/utmParameter',[userController::class,'utmParameter']);
Route::get('/user/utmParameter/{parameter_data}',[userController::class,'getUtmParameterDetail']);
Route::get('/user/utm/{utm_id}',[userController::class,'getPerticularUtmDetail']);
Route::delete('/user/utmName/{utm_id}',[userController::class,'deletePerticularUtmName']);
Route::delete('/user/utmParameter/{utm_id}',[userController::class,'deletePerticularUtmParameter']);
Route::get('/user/getUtmUpdate/{user_id}',[userController::class,'getUtmUpdate']);
Route::get('/user/totalAffectedAds/{optional_data}',[userController::class,'totalAffectedAds']);
Route::get('/user/getUnreadUpdate/{user_id}',[userController::class,'getUnreadUpdate']);
Route::get('/user/updateUnread/{user_id}',[userController::class,'updateUnread']);
  
Route::resource('/user',userController::class);

Route::get('/getPermission',[userController::class,'getPermission']);

Route::resource('/user-role',userRoleController::class);
Route::get('/user-role/search/{search_data}',[userRoleController::class,'searchShow']); 
 
Route::put('/change-password/{user_id}',[userController::class,'changePassword']); 
//Route::put('/change-profile/{user_id}',[userController::class,'changeProfile']); 
Route::post('/change-profile',[userController::class,'changeProfile']); 
Route::post('/forgot-password',[userController::class,'forgotPassword']); 
Route::put('/change-forgot-password',[userController::class,'changeForgotPassword']); 
Route::get('/login-user-data/{id}',[userController::class,'showLoginUserData']);

Route::get('/linkedin/account/{account_id}',[LinkedinApi::class,'showUserAccount']); 
Route::get('/linkedin/campaignGroup/{campaigngroup_id}',[LinkedinApi::class,'showUserCampaignGroup']); 
Route::get('/linkedin/campaign/{campaign_id}',[LinkedinApi::class,'showUserCampaign']); 
Route::get('/linkedin/creative/{creative_id}',[LinkedinApi::class,'showUserCreative']); 
Route::get('/linkedin/totalCampaignAds/{campaign_id}',[LinkedinApi::class,'totalCampaignAds']);  
Route::get('/linkedin/campaignUnderAccount/{account_id}',[LinkedinApi::class,'showUserCampaignUnderAccount']);  
Route::get('/linkedin/creativeUnderAccount/{account_id}',[LinkedinApi::class,'showUserCreativeUnderAccount']);  

Route::post('/linkedin/createAccount',[LinkedinApi::class,'createAccount']); 

Route::get('/linkedin/utm',[LinkedinApi::class,'getUtmDetail']); 
//Route::post('/linkedin/updateCampaignUtm',[LinkedinApi::class,'updateCampaignUtm']);
Route::post('/linkedin/updateCampaignUtm',[LinkedinApi::class,'storeCampaignCronData']);
//Route::post('/linkedin/updateCreativeUtm',[LinkedinApi::class,'updateCreativeUtm']);
Route::post('/linkedin/updateCreativeUtm',[LinkedinApi::class,'storeCreativeCronData']);

Route::get('/linkedin/adsType/{account_id}',[LinkedinApi::class,'adsTypeData']);
Route::get('/linkedin/adsLanding/{account_id}',[LinkedinApi::class,'adsLandingData']);
Route::get('/linkedin/adsPerforming/{account_id}',[LinkedinApi::class,'adsPerformingData']);
Route::get('/linkedin/accountSpend/{account_id}',[LinkedinApi::class,'accountSpendData']);

Route::post('/hubspot/getAccessToken',[HubspotApi::class,'getAccessToken']);
Route::get('/hubspot/isUserLinkWithHub/{userID}',[HubspotApi::class,'isUserLinkWithHub']);
Route::get('/hubspot/isUserLinkWithHubCronData/{userID}',[HubspotApi::class,'isUserLinkWithHubCronData']);
Route::post('/hubspot/isAccountLinkWithHub',[HubspotApi::class,'isAccountLinkWithHub']);
Route::delete('/hubspot/deleteLinkedAccount/{accountID}',[HubspotApi::class,'deleteLinkedAccount']);
Route::get('/hubspot/getHubspotData/{accountID}',[HubspotApi::class,'getHubspotData']);
Route::get('/hubspot/linkedinSyncHubspot',[HubspotApi::class,'linkedinSyncHubspot']);
Route::post('/hubspot/manualLinkedinSyncHubspot',[HubspotApi::class,'manualLinkedinSyncHubspot']);

Route::any('/hello',[LinkedinApi::class,'hello']);

Route::any('/testing', function(){
    
    dd('apis are workings');
});
