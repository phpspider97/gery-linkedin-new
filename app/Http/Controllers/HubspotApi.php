<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;

use Exception;

class HubspotApi extends Controller{ 
    function isHubSpotTokenExpire($access_token,$refresh_token,$expires_in,$accountID){
        if($expires_in < time()){  
            $client_id = '161315b1-1e34-410a-8b51-8c5bdc52b755';
            $client_secret = '69bbfc00-83e3-418a-a6f1-b10d5d0988e0';
            $url = "https://api.hubapi.com/oauth/v1/token"; 
            $postFields = http_build_query([
                'grant_type' => 'refresh_token',
                'client_id' => $client_id,
                'client_secret' => $client_secret,
                'refresh_token' => $refresh_token,
            ]); 
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $postFields);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); 
            $response = curl_exec($ch);
            curl_close($ch); 
            $newTokenData = json_decode($response, true); 
            $hubspot_token = $newTokenData['access_token'];
            $refresh_token = $newTokenData['refresh_token'];
            $expires_in = time()+$newTokenData['expires_in'];
            DB::table('linkedin_sync_hubspot')->where('linkedin_accont_id',$accountID)->update([
                'hubspot_token' => $hubspot_token,
                'hubspot_refresh_token' => $refresh_token,
                'hubspot_token_time_out' => $expires_in,
            ]);
            return $newTokenData['access_token'];
        }else{ 
            return $access_token;
        }
    } 
    function isLinkedinTokenExpire($access_token,$refresh_token,$expires_in,$accountID){
        if($expires_in < time()){  
            $client_id = '783v0rokori887';
            $client_secret = 'WCqVhx7vuJ2rThH3';
            $url = "https://www.linkedin.com/oauth/v2/accessToken"; 
            $postFields = http_build_query([
                'grant_type' => 'refresh_token',
                'client_id' => $client_id,
                'client_secret' => $client_secret,
                'refresh_token' => $refresh_token,
            ]); 
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $postFields);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); 
            $response = curl_exec($ch);
            curl_close($ch); 
            $newTokenData = json_decode($response, true);   
            $linkedin_token = $newTokenData['access_token']; 
            $linkedin_expires_in = time()+$newTokenData['expires_in']; 
            $linkedin_refresh_token = $newTokenData['refresh_token']; 

            DB::table('linkedin_sync_hubspot')->where('linkedin_accont_id',$accountID)->update([
                'linkedin_token' => $linkedin_token,
                'linkedin_refresh_token' => $linkedin_refresh_token,
                'linkedin_token_time_out' => $linkedin_expires_in,
            ]);
            return $newTokenData['access_token'];
        }else{ 
            return $access_token;
        }
    }
    public function hubspotAccountDetail($token){
        $token_url = "https://api.hubapi.com/oauth/v1/access-tokens/$token";
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $token_url); 
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); 
        $response = curl_exec($ch);
        curl_close($ch); 
        $data = json_decode($response, true);
        return $data;
    }
    public function getUserData($select_account){
        return DB::table('user_account_detail')->select('user_id')->where('account_id',$select_account)->first();
    }
    public function getUserTokenData($user_id){
        return DB::table('user')->select('user_token','user_refresh_token','token_time_out')->where('id',$user_id)->first();
    }

    public function getAccessToken(Request $request){
        try{ 
            $code = $request->input('code');
            $select_account = $request->input('select_account'); 
            $linkedin_account_name = $request->input('linkedin_account_name');

            $client_id = '161315b1-1e34-410a-8b51-8c5bdc52b755';
            $client_secret = '69bbfc00-83e3-418a-a6f1-b10d5d0988e0';
            $redirect_uri = 'https://www.pipelight.io/user/hubspot-token';
            $token_url = 'https://api.hubapi.com/oauth/v1/token'; 
            $params = [
                'grant_type' => 'authorization_code',
                'code' => $code,
                'redirect_uri' => $redirect_uri,
                'client_id' => $client_id,
                'client_secret' => $client_secret,
            ]; 
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $token_url);
            curl_setopt($ch, CURLOPT_POST, 1);
            curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($params));
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); 
            $response = curl_exec($ch);
            curl_close($ch); 
            $data = json_decode($response, true);   
    
            $hubspot_token = $data['access_token'];
            $refresh_token = $data['refresh_token'];
            $expires_in    = time()+$data['expires_in'];

            $hubspot_accont_id = $this->hubspotAccountDetail($hubspot_token);
            $user_information = $this->getUserData($select_account);
            $user_token_data = $this->getUserTokenData($user_information->user_id);
           
            DB::table('linkedin_sync_hubspot')->updateOrInsert(
                [
                    'user_id' => $user_information->user_id,
                    'linkedin_accont_id' => $select_account,
                    'hubspot_accont_id' => $hubspot_accont_id['hub_id']
                ],
                [
                    'user_id' => $user_information->user_id,
                    'linkedin_account_name' => $linkedin_account_name,
                    'linkedin_accont_id' => $select_account,
                    'linkedin_token' => $user_token_data->user_token, 
                    'linkedin_refresh_token' => $user_token_data->user_refresh_token, 
                    'linkedin_token_time_out' => $user_token_data->token_time_out, 
                    'hubspot_accont_id' => $hubspot_accont_id['hub_id'], 
                    'hubspot_account_name' => $hubspot_accont_id['hub_domain'],   
                    'hubspot_token' => $hubspot_token,
                    'hubspot_refresh_token' => $refresh_token, 
                    'hubspot_token_time_out' => $expires_in, 
                ]
            );     
            $data = DB::table('linkedin_sync_hubspot')->where('linkedin_accont_id',$select_account)->first();
            //$this->linkedinSyncHubspot($data);
            return [ 
                'status' => 'success',
                'msg' => "Your account sync with ".$hubspot_accont_id['user']." successfully."
            ];
        }catch(Exception $e){
            return [
                'msg' => $e->getMessage(),
                'status' => 'error'
            ];
        }
    }
    public function isUserLinkWithHubCronData($user_id){
        try{   
            $data = DB::table('linkedin_sync_hubspot_cron_data')->where('user_id',$user_id)->get();
            return [
                'data' => $data,
                'status' => 'success'
            ];
        }catch(Exception $e){
            return [
                'msg' => $e->getMessage(),
                'status' => 'error'
            ];
        }
    }
    public function isUserLinkWithHub($user_id){
        try{   
            $data = DB::table('linkedin_sync_hubspot')->where('user_id',$user_id)->get();
            return [
                'data' => $data,
                'status' => 'success'
            ];
        }catch(Exception $e){
            return [
                'msg' => $e->getMessage(),
                'status' => 'error'
            ];
        }
    }
    public function isAccountLinkWithHub(Request $request){
        try{
            $select_account = $request->input('select_account');
            $data = DB::table('linkedin_sync_hubspot')->where('linkedin_accont_id',$select_account)->get();
            return [
                'data' => $data,
                'status' => 'success'
            ];
        }catch(Exception $e){
            return [
                'msg' => $e->getMessage(),
                'status' => 'error'
            ];
        }
    }
    public function deleteLinkedAccount($accountID){
        try{ 
            $data = DB::table('linkedin_sync_hubspot')->where('linkedin_accont_id',$accountID)->delete();
            return [
                'data' => "Unsynch successfully.",
                'status' => 'success'
            ];
        }catch(Exception $e){
            return [
                'msg' => $e->getMessage(),
                'status' => 'error'
            ];
        }
    }
    public function getHubSpotDataAccountWise($accountID){
        try{
            $data = DB::table('linkedin_sync_hubspot')->where('linkedin_accont_id',$accountID)->first();
            $access_token = $this->isHubSpotTokenExpire($data->hubspot_token,$data->hubspot_refresh_token,$data->hubspot_token_time_out,$accountID); 
            $api_url = "https://api.hubapi.com/crm/v3/objects/companies?limit=100&archived=false&properties=domain,total_linkedin_impression,total_linkedin_click,total_linkedin_spend";
            $headers = [ 
                "Authorization: Bearer $access_token"
            ]; 
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $api_url);
            curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            $response = curl_exec($ch);
            curl_close($ch); 
            return json_decode($response, true)['results'];
        }catch(Exception $e){
            return [
                'msg' => $e->getMessage(),
                'status' => 'error'
            ];
        }
    }
    public function getHubspotData($accountID){
        try{  
            $data = DB::table('linkedin_sync_hubspot')->where('linkedin_accont_id',$accountID)->first();
            //$this->linkedinSyncHubspot($data);
            $hubSpotData = $this->getHubSpotDataAccountWise($accountID);
            //dd($hubSpotData);
            return [
                'data' =>$hubSpotData,
                'status' => 'success'
            ];
        }catch(Exception $e){
            return [
                'msg' => $e->getMessage(),
                'status' => 'error'
            ];
        }
    }
    function getLinkedinData($accountID,$selected_date){ 
        if(empty($selected_date)){
            $currentDate = explode('-',date('Y-m-d'));
            $previousDate = explode('-',date('Y-m-d', strtotime('-7 days')));

            $previous_year = $previousDate[0];
            $previous_month = $previousDate[1];
            $previous_date = $previousDate[2];

            $current_year = $currentDate[0];
            $current_month = $currentDate[1];
            $current_date = $currentDate[2];

        }else{ 
            $update_date = explode('_',$selected_date);
            $previousDate = explode('/',$update_date[0]);
            $currentDate = explode('/',$update_date[1]);

            $previous_month = $previousDate[0];
            $previous_date = $previousDate[1];
            $previous_year = $previousDate[2];

            $current_month = $currentDate[0];
            $current_date = $currentDate[1];
            $current_year = $currentDate[2];
        }
        
        
        
        $data = DB::table('linkedin_sync_hubspot')->where('linkedin_accont_id',$accountID)->first();
        $access_token   =   $this->isLinkedinTokenExpire($data->linkedin_token,$data->linkedin_refresh_token,$data->linkedin_token_time_out,$accountID);
     
        $api_url = "https://api.linkedin.com/v2/adAnalyticsV2?q=analytics&dateRange=(start:(day:$previous_date,month:$previous_month,year:$previous_year),end:(day:$current_date,month:$current_month,year:$current_year))&timeGranularity=ALL&accounts=List(urn%3Ali%3AsponsoredAccount%3A$accountID)&pivot=MEMBER_COMPANY&projection=(*,elements*(*,pivotValue~(vanityName,localizedName,localizedWebsite)))&fields=dateRange,impressions,clicks,landingPageClicks,externalWebsiteConversions,costInLocalCurrency,costInUsd,pivotValue";
         
        $headers = [ 
            "Authorization: Bearer $access_token",
            "Linkedin-Version: 202306",
            "X-Restli-Protocol-Version: 2.0.0"
        ]; 

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $api_url);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $response = curl_exec($ch);
        curl_close($ch);
        return json_decode($response, true);
    }
 
    function createEvent($token,$company_name,$spend,$impression,$click,$total_spend,$total_impression,$total_click){
        try{    
            $current_date = date('Y_m_d_H_i_s'); 
            $event_name = $company_name."_".$current_date;
            $event_data = [
                'propertyDefinitions' => [
                    [
                        'name' => 'linkedin_click',
                        'description' => $click,
                        'label' => 'linkedin_click',
                        'type' => 'number'
                    ], 
                    [
                        'name' => 'linkedin_spend',
                        'description' => $spend,
                        'label' => 'linkedin_spend',
                        'type' => 'number'
                    ], 
                    [
                        'name' => 'linkedin_impression',
                        'description' => $impression,
                        'label' => 'linkedin_impression',
                        'type' => 'number'
                    ], 
                    [
                        'name' => 'total_linkedin_click',
                        'description' => $total_click,
                        'label' => 'total_linkedin_click',
                        'type' => 'number'
                    ], 
                    [
                        'name' => 'total_linkedin_spend',
                        'description' => $total_spend,
                        'label' => 'total_linkedin_spend',
                        'type' => 'number'
                    ], 
                    [
                        'name' => 'total_linkedin_impression',
                        'description' => $total_impression,
                        'label' => 'total_linkedin_impression',
                        'type' => 'number'
                    ], 
                    [
                        'name' => 'created_at',
                        'description' => date('Y-m-d H:i:s'),
                        'label' => 'created_at',
                        'type' => 'datetime'
                    ], 
                  
                ],
                'name' => $event_name,
                'description' => 'Linkedin information data',
                'label' => $event_name,
                'primaryObject' => 'COMPANY'
            ]; 
            $curl = curl_init();
            curl_setopt_array($curl, array(
              CURLOPT_URL => "https://api.hubapi.com/events/v3/event-definitions",
              CURLOPT_RETURNTRANSFER => true,
              CURLOPT_ENCODING => "",
              CURLOPT_MAXREDIRS => 10,
              CURLOPT_TIMEOUT => 30,
              CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
              CURLOPT_CUSTOMREQUEST => "POST",
              CURLOPT_POSTFIELDS => json_encode($event_data), 
              CURLOPT_HTTPHEADER => array(
                "accept: application/json",
                "authorization: Bearer $token",
                "content-type: application/json"
              ),
            ));
            
            $response = curl_exec($curl);
            $err = curl_error($curl); 
            curl_close($curl); 
            if($err){
                return false;
            } 
            return true; 
        }catch(Exception $e){
            dd($e->getMessage()); 
            return false;
        }
    }

    function propertyCreate($company_id,$token){ 
        try{ 
            $url = "https://api.hubapi.com/properties/v1/companies/properties"; 
            $property_data = [ 
                ['name' => "total_linkedin_impression", "label"=> "Total Linkedin Impression","description"=> "","groupName"=> "companyinformation","type"=> "number"],
                ['name' => "total_linkedin_click", "label"=> "Total Linkedin Click","description"=> "","groupName"=> "companyinformation","type"=> "number"],
                ['name' => "total_linkedin_spend", "label"=> "Total Linkedin Spend","description"=> "","groupName"=> "companyinformation","type"=> "number"],
            ];   
            foreach($property_data as $data){
                $ch = curl_init($url);
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                curl_setopt($ch, CURLOPT_HTTPHEADER, array(
                    'Content-Type: application/json',
                    'Authorization: Bearer ' . $token
                ));
                curl_setopt($ch, CURLOPT_POST, 1);
                curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
                $response = curl_exec($ch);
                curl_close($ch);  
            } 
            return true; 
        }catch(Exception $e){
            return false;
        }
    }
    public function manualLinkedinSyncHubspot(Request $request){
        try{ 
            $data = $request->input('data');
            $selected_date = $request->input('selected_date');
            
            $isManualSync = $this->linkedinSyncHubspot($data,$selected_date);
             return $isManualSync;
            if($isManualSync){
                return [
                    'data' => "Maunal sync successfully done.",
                    'status' => 'fail'
                ];
            }
            return [
                'data' => "Some issue to maunal sync.",
                'status' => 'fail'
            ];
        }catch(Exception $e){
            return [
                'msg' => $e->getMessage(),
                'status' => 'error'
            ];
        }
        
    }
    public function linkedinSyncHubspot($userSyncData='',$selected_date=''){
        try{  
             
            $userSyncData = DB::table('linkedin_sync_hubspot')->where('linkedin_accont_id',503269346)->first(); 
            $linkedin_accont_id = $userSyncData->linkedin_accont_id;
            $hubspot_accont_id = $userSyncData->hubspot_accont_id;
            $hubspot_access_token = $userSyncData->hubspot_token;
            $hubspot_refresh_token = $userSyncData->hubspot_refresh_token;
            $hubspot_expires_in = $userSyncData->hubspot_token_time_out;
            $linkedin_access_token = $userSyncData->linkedin_token;
            $linkedin_refresh_token = $userSyncData->linkedin_refresh_token;
            $linkedin_expires_in = $userSyncData->linkedin_token_time_out;
            $user_id = $userSyncData->user_id;
            

            $linkedin_access_token = $this->isLinkedinTokenExpire($linkedin_access_token,$linkedin_refresh_token,$linkedin_expires_in,$linkedin_accont_id); 
            $hubspot_access_token = $this->isHubSpotTokenExpire($hubspot_access_token,$hubspot_refresh_token,$hubspot_expires_in,$linkedin_accont_id);
            
            $company_data = $this->getHubSpotDataAccountWise($linkedin_accont_id);
             
            $user_data = $this->getLinkedinData($linkedin_accont_id,$selected_date);
            //return $user_data; 
            $arr_domain = [];
            if(!empty($company_data)){
                foreach($company_data as $key=>$hubspot_data){
                    $arr_property_list    =   $hubspot_data['properties'];  
                    $get_domain           =   explode('.',$arr_property_list['domain']);
                    if(count($get_domain)>2){ 
                        $arr_domain[] = $get_domain[0].'.'.$get_domain[1]; 
                    }else{
                        $arr_domain[] = $get_domain[0]; 
                    }  
                }
            }     
            if(!empty($user_data['elements'])){ 
                foreach($user_data['elements'] as $key=>$ads_data){
                    $click                  =   '';
                    $spend                  =   '';
                    $impression             =   '';
                    $localizedWebsite       =   '';

                    $click                  =   $ads_data['clicks'];
                    $spend                  =   $ads_data['costInLocalCurrency']; 
                    $impression             =   $ads_data['impressions']; 
                    $localizedWebsite       =   @$ads_data['pivotValue~']['localizedWebsite']; 
                   
                    if(!empty($localizedWebsite)){  
                        $localizedWebsite = str_replace('https://','',$localizedWebsite);
                        $localizedWebsite = str_replace('http://','',$localizedWebsite);
                        $localizedWebsite = str_replace('www.','',$localizedWebsite);
                        $localizedWebsite = explode('.',$localizedWebsite); 
                        if(count($localizedWebsite)>2){  
                            $localizedWebsite = $localizedWebsite[0].'.'.$localizedWebsite[1];
                        }else{
                            $localizedWebsite = $localizedWebsite[0]; 
                        }
                    }else{
                        $localizedWebsite = '';
                    }   
                    if(!in_array($localizedWebsite,$arr_domain)){continue;}
                    if(!empty($company_data)){ 
                        foreach($company_data as $key=>$hubspot_data){ 
                            $company_id           =   $hubspot_data['id'];
                            $arr_property_list    =   $hubspot_data['properties'];
                            $domain               =   explode('.',$arr_property_list['domain']);
                            if(count($domain)>2){ 
                                $domain = $domain[0].'.'.$domain[1];  
                            }else{
                                $domain = $domain[0]; 
                            }   
                            if($localizedWebsite == $domain){  
                                $is_property_created = false;
                                if(!isset($arr_property_list['total_linkedin_impression']) && !isset($arr_property_list['total_linkedin_click']) && !isset($arr_property_list['total_linkedin_spend'])){
                                    $this->propertyCreate($company_id,$hubspot_access_token);    
                                } 
                                $url = "https://api.hubapi.com/crm/v3/objects/companies/$company_id"; 
                                $headers = [ 
                                    "Authorization: Bearer $hubspot_access_token",
                                    "content-type: application/json"
                                ];  

                                $total_linkedin_impression = ($arr_property_list['total_linkedin_impression']??0)+$impression; 
                                $total_linkedin_click = ($arr_property_list['total_linkedin_click']??0)+$click; 
                                $total_linkedin_spend = ($arr_property_list['total_linkedin_spend']??0)+$spend;

                                $params = [
                                    'properties' => [
                                        'total_linkedin_impression'=>$total_linkedin_impression,
                                        'total_linkedin_click'=>$total_linkedin_click,
                                        'total_linkedin_spend'=>$total_linkedin_spend,
                                    ]
                                ];
                                //dd($params);
                                $ch = curl_init();
                                curl_setopt($ch, CURLOPT_URL, $url); 
                                curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PATCH');
                                curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
                                curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($params));
                                curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); 
                                $response = curl_exec($ch);
                                curl_close($ch); 
                                $data = json_decode($response, true);  
                                //dd($data);
                                DB::table('linkedin_sync_hubspot_cron_data')->insert( 
                                    [
                                        'user_id' => $user_id, 
                                        'linkedin_id' => $linkedin_accont_id, 
                                        'hubspot_id' => $hubspot_accont_id, 
                                        'linkedin_spend' => $spend, 
                                        'linkedin_impression' => $impression, 
                                        'linkedin_click' => $click, 
                                        'total_linkedin_spend' => $total_linkedin_spend, 
                                        'total_linkedin_impression' => $total_linkedin_impression, 
                                        'total_linkedin_click' => $total_linkedin_click, 
                                    ]
                                );   
                                $this->createEvent($hubspot_access_token,$domain,$spend,$impression,$click,$total_linkedin_spend,$total_linkedin_impression,$total_linkedin_click);

                                return true; // temp for 1 entry
                            } 
                        }
                    }
                }
            }    
            return true;
        }catch(Exception $e){  
            return $e->getMessage();
            DB::table('error_detail')->insert([
                'message'=>$e->getMessage(),
                'user_token'=>111,
                'error_path'=>'from common hubspot sync function'
            ]);
            return false;
        }
    }

}