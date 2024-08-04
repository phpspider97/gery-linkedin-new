<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;

use Exception;

class LinkedinApi extends Controller
{ 
    //private $accessBearerToken = 'AQWVnNojUHRt96HDoeKUbx0QVrLAOZIenKIHLXHq5Th6RmhghFreYXrst23l5URi8SbAgzTqdFsQSxKlgA0k3DM2UoWgUUygAX6mvkIdHxsEQcywbMtxVh7F0VPfiW8YOO5C6ctjCQvACsNeDw0FQbI8fA17kklKLiQKCeTE89iWw8mEFYa6c5XrlitFdNgkpM-CotFgtviM6oIfzRCaeqdw68o1eA6jfbHc__gdvKbohhCAEY3HecActLi8SCLJKcpMtSbH0TNMvfIveZYt9iPtVaeS6813FZdcH_pjAVD2kSCMHqLxO4vJVCaDYcNf9NmwWLM2WUvhlVMYIjjamtPHeYpkxg';

    private $accessBearerToken = 'AQVmgxyGR_rkoJ-jBeKzPzU85OEvx0UezLIpjcJeIQqt5XAVaU6WY2oXabBmv8MJ-kWRDWHBdT9ZLZeNLXAvJBahBn5UQ7q3Me6uvVXbMisCuaNDvdpgXUcXBk5PmVQs7Ty8wrlNC7WZG5F5hfracJQITYdpzqfelzg_6mbqqtzOzuLGCE6Y4xai423Ydx2g8cQ-x_GLfxE05L-pxG7ba63mF-I8YqxrMhrZvWg-tXacfRM4YATgW8jYlpd2sjVvvpYen1tc6_4ghKo5V5Lp-LRkFUoJ-X4zpTI0Y1hDMna9k04VXUiDekpsOepDKkv8nxvOGVOSxO93iuPSAzmnitA-FmOs2Q';

    

    public function getAcessToken(){

    }
    public function createCampaignGroup($request =''){
        
        //$accessBearerToken = 'AQWZZg1tILuo-h8T_qWqfIs-JLdvPyEE7yyU-Izur5ncI7FWIJDzc8xLG1C-2aALLcLwONprNr5SADWUkyd_HPpWqabf6M6k_uDRLUV0XFQpLlOHwinvgP7TH1wtt74DRqlufxOWyZHnERE_euKf-oX0bZugwj2lswu3AaSVzg4bGoOuDS9CSHZ4CgKIQ-AzxrsBz9lvRxE-SdNKUH7Zmwa6lQXFlYWIAvcrnaWkj_D5zfcUnpDi00O5pczEik-Bd2TUqdZlpqjowdQchIyr94-1aN4jSR26DiCWs7N1A4s5lwsahXYlENiSc7uHELb7GuhXfGeNsKbZ0rlDv4uVxCuXI282qQ';  
        $accessBearerToken = 'AQUleTyme8jUp9yQg4MCrIMNqg1JZnK-pIluHGJuHdMkqp0Pss72HxaOS6OyQrisq1ge9rhHHmdO32y1BfG4TqGUhz2q5AbJdcIER5DzVBmDP59Be08KNkAlJkRvjIBDC5OH9sbnDgzaIWPl9IGN2_36jPhdD0WGOT7Db6ZFanYa0UHw-0TKN6_woYVi7-D65HbH89PKgPdeXnwKbhLippPtOta8hMP5G0LPc3vtcmYaElOmlY48W9QcwDfyJn5k9jWo6fbVexaDXhtLSCb9eO3HgTFct2hjraOlAmnADGcrXUVoj6ZHvtZeZH41be4qu54z2vAJ2Q-bwxC7bw9sVUDE2AIFbw';  

        $url = "https://api.linkedin.com/v2/adCampaignGroupsV2";
        $postMethod = "POST";
        $httpHeader = [
            "content-type: application/json",
            "Authorization: Bearer {$accessBearerToken}"
        ];
        
        $campaign_name = $request->campaign_group;
        $campaign_account_id = $request->linkedin_id??'509030941';

        // $campaign_name = 'test';
        // $campaign_account_id = '509030941';

        $postFields = '{
            "account": "urn:li:sponsoredAccount:'.$campaign_account_id.'",
            "name": "'.$campaign_name.'",
            "runSchedule": {
                "end": 1645266365000,
                "start": 1645179965000
            },
            "status": "ACTIVE",
            "totalBudget": {
                "amount": "5000.00",
                "currencyCode": "INR"
            }
        }';
        //dd($postFields);
        $curl = curl_init();
        curl_setopt_array($curl, [
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_SSL_VERIFYPEER => 0,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => $postMethod,
            CURLOPT_POSTFIELDS =>  $postFields,
            CURLOPT_HTTPHEADER => $httpHeader,
        ]);

        $curlResponse = curl_exec($curl); 
        $errResponse = curl_error($curl);
        curl_close($curl);

        if($errResponse){
            $errResponse;
        }else{
            $curlResponse;
        }
        $curlResponse = json_decode($curlResponse);

        //dd($curlResponse);
    }

    public function getPagination($page_number){
        $per_page_record = 3;
        if(!empty($page_number)){
            $start_from = ($page_number-1)*$per_page_record;
        }else{
            $start_from = $page_number;
        }
        return "&start=$start_from&count=$per_page_record";
    }

    public function searchByDateRange($search_data){
        $a_date_range = explode('_',$search_data);
        $start_date = $a_date_range[0];
        $end_date = $a_date_range[1];

        $a_start_date = explode('@',$start_date);
        $start_month = $a_start_date[0];
        $start_day = $a_start_date[1];
        $start_year = $a_start_date[2];
        

        $a_end_date = explode('@',$end_date);
        $end_month = $a_end_date[0];
        $end_day = $a_end_date[1];
        $end_year = $a_end_date[2]; 

        return "&dateRange.start.year=$start_year&dateRange.start.month=$start_month&dateRange.start.day=$start_day&dateRange.end.year=$end_year&dateRange.end.month=$end_month&dateRange.end.day=$end_day";
    }

    public function commonCurlGetRequest($curl_url,$a_header){ 
        //try {
            $curl = curl_init();    
            curl_setopt_array($curl, array( 
                CURLOPT_URL => "$curl_url", 
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_ENCODING => "",
                CURLOPT_MAXREDIRS => 10,
                CURLOPT_FOLLOWLOCATION => true,
                CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                CURLOPT_TIMEOUT => 300,
                CURLOPT_CUSTOMREQUEST => "GET",
                CURLOPT_HTTPHEADER => $a_header,
            ));
            return json_decode(curl_exec($curl));
        // }catch(Exception $e){
        //     DB::table('error_detail')->insert([
        //         'message'=>$e->getMessage(),
        //         'error_path'=>'from common commonCurlGetRequest function'
        //     ]);
        // }
    }
    public function getPendinAccountDetail($a_remaining_account_id,$a_header,$status_filter){ 
        //try{
            //$basic_final_linkedin_account_id = '';
            if(!empty($a_remaining_account_id)){
                $count = -1;
                $basic_final_linkedin_account_id = '';
                foreach($a_remaining_account_id as $linkedin_account_id_value){
                    $count++;    
                    $basic_final_linkedin_account_id .= "&search.id.values[$count]=$linkedin_account_id_value";
                }
                $curl_url = "https://api.linkedin.com/v2/adAccountsV2?q=search$basic_final_linkedin_account_id$status_filter"; 
                return $this->commonCurlGetRequest($curl_url,$a_header); 
            }else{
                return [];
            }  
        // }catch(Exception $e){
        //     DB::table('error_detail')->insert([
        //         'message'=>$e->getMessage(),
        //         'error_path'=>'from common getPendinAccountDetail function'
        //     ]);
        // }
    }

    public function showUserAccount($a_linkedin_account_id){
        //try{
            $linkedin_account_id = explode('-',$a_linkedin_account_id)[0];
            $encrypt_user_id = explode('-',$a_linkedin_account_id)[1]; 
            $search_data = explode('-',$a_linkedin_account_id)[2];
            $status_data = explode('-',$a_linkedin_account_id)[3];
            
            $current_year = date('Y');
            $current_month = date('m');
            $current_date = date('d');
            $previous_date = date('Y-m-d', strtotime('-29 days'));
            $a_previous_date = explode('-',$previous_date);
            $previous_year = $a_previous_date[0];
            $previous_month = $a_previous_date[1];
            $previous_date = $a_previous_date[2];
            
            $search_date_range = "&dateRange.start.year=$previous_year&dateRange.start.month=$previous_month&dateRange.start.day=$previous_date&dateRange.end.year=$current_year&dateRange.end.month=$current_month&dateRange.end.day=$current_date"; 

            $user_id = Crypt::decryptString($encrypt_user_id);
            $user_data = DB::table('user')->select('user_token','user_refresh_token')->where('id',$user_id)->first();
            $user_token = $user_data->user_token;
            $user_refresh_token = $user_data->user_refresh_token;

            
            $status_filter = '';
            if(!empty($search_data)){
                $search_date_range = $this->searchByDateRange($search_data);
            }
            if(!empty($status_data)){
                $status_filter = "&search.status.values[0]=$status_data";
            }
            
            if(!empty($linkedin_account_id)){
                $a_linkedin_account_id = []; 
                $final_linkedin_account_id = '';
                $basic_final_linkedin_account_id = '';
                $a_linkedin_account_id = explode(',',$linkedin_account_id);
                if(!empty($a_linkedin_account_id)){
                    $count = -1;
                    foreach($a_linkedin_account_id as $linkedin_account_id_value){
                        $count++;   
                        $final_linkedin_account_id .= "&accounts[$count]=urn:li:sponsoredAccount:$linkedin_account_id_value";
                        $basic_final_linkedin_account_id .= "&search.id.values[$count]=$linkedin_account_id_value";
                    }
                }
            }else{
                $final_linkedin_account_id = "&accounts[0]=urn:li:sponsoredAccount:0";
                $basic_final_linkedin_account_id = "/0";
            }  
            $curl_url = "https://api.linkedin.com/v2/adAccountsV2?q=search$basic_final_linkedin_account_id$status_filter"; 
            $a_header = [
                //"X-RestLi-Protocol-Version: 2.0.0",
                "content-type: application/json",
                "Accept: application/json",
                "Authorization: Bearer {$user_token}"
            ];  

            $basic_account_data = $this->commonCurlGetRequest($curl_url,$a_header);
            //dd($basic_account_data);
            if(isset($basic_account_data->elements) && !empty($basic_account_data->elements)){  
                foreach($basic_account_data->elements as $k=>$val){ 
                    //dd($val->id);
                    $pivotValue = "pivotValue~";
                    $curl_url = "https://api.linkedin.com/v2/adAnalyticsV2?q=analytics&pivot=ACCOUNT$search_date_range&accounts[0]=urn%3Ali%3AsponsoredAccount%3A$val->id&timeGranularity=ALL&fields=otherEngagements,externalWebsiteConversions,dateRange,clicks,oneClickLeads,impressions,landingPageClicks,likes,shares,costInLocalCurrency,pivot,pivotValue&projection=(*,elements*(*,pivotValue~()))"; 
                    //echo $curl_url; die;
                    $a_header = [
                        "Authorization: Bearer {$user_token}"
                    ];  
                    $anylatic_account_data =  $this->commonCurlGetRequest($curl_url,$a_header); 
                    //dd($anylatic_account_data->elements[0]->$pivotValue);  
                    
                    $account_id = $basic_account_data->elements[$k]->id;
                    $account_name = $basic_account_data->elements[$k]->name;
                    $account_status = $basic_account_data->elements[$k]->status;
                    //dd($anylatic_account_data->elements);
                    if(isset($anylatic_account_data->elements) && !empty($anylatic_account_data->elements)){  
                        $basic_account_data->elements[$k] = $anylatic_account_data->elements[0];

                        $account_id = $anylatic_account_data->elements[0]->$pivotValue->id;
                        $account_name = $anylatic_account_data->elements[0]->$pivotValue->name;
                        $account_status = $anylatic_account_data->elements[0]->$pivotValue->status;

                    }
                    $basic_account_data->elements[$k]->name = $account_name;
                    $basic_account_data->elements[$k]->id = $account_id;
                    $basic_account_data->elements[$k]->status = $account_status;

                    // if(!empty($status_data)){
                    //     if($status_data != $account_status){ 
                    //         continue;
                    //     }
                    // }

                    //dd(count($basic_account_data->elements));
                    // if(!empty($basic_account_data->elements)){
                    //     foreach($basic_account_data->elements as $k=>$val){  
                    //         $handle = 'pivotValue~';
                    //         $campaign_group_id = $val->$handle->id; 
                    //         $campaign_group_name = $val->$handle->name; 
                    //         $campaign_group_status = $val->$handle->status; 
                    //         $basic_account_data->elements[$k]->name = $campaign_group_name;
                    //         $basic_account_data->elements[$k]->id = $campaign_group_id;
                    //         $basic_account_data->elements[$k]->status = $campaign_group_status;
                            
                    //         $a_used_account_id[] = $campaign_group_id;

                    //         if(!empty($status_data)){
                    //             if($status_data != $campaign_group_status){ 
                    //                 continue;
                    //             }
                    //         }
                    //     }
                    // }
                }
            }
            return $basic_account_data; 
        // }catch(Exception $e){
        //     DB::table('error_detail')->insert([
        //         'message'=>$e->getMessage(),
        //         'error_path'=>'from common showUserAccount function'
        //     ]);
        // }
    } 
    public function getCampaignDetailInMultipleAccountCase($sponser_value,$a_header){
        //try{
            if(isset($sponser_value) && !empty($sponser_value)){
                $campaign_id = explode(":",$sponser_value)[3];
            } 
            $curl_url = "https://api.linkedin.com/v2/adCampaignGroupsV2?q=search&search.id.values[0]=$campaign_id"; 
            return $this->commonCurlGetRequest($curl_url,$a_header);
        // }catch(Exception $e){
        //     DB::table('error_detail')->insert([
        //         'message'=>$e->getMessage(),
        //         'error_path'=>'from common getCampaignDetailInMultipleAccountCase function'
        //     ]);
        // }
    }

    public function getPendinCampaignGroupDetail($a_remaining_account_id,$a_header,$status_filter){ 
        //try{
            if(!empty($a_remaining_account_id)){
                $count = -1;
                $basic_final_linkedin_account_id = '';
                foreach($a_remaining_account_id as $linkedin_account_id_value){
                    $count++;    
                    $basic_final_linkedin_account_id .= "&search.id.values[$count]=$linkedin_account_id_value";
                }
                $curl_url = "https://api.linkedin.com/v2/adCampaignGroupsV2?q=search$basic_final_linkedin_account_id$status_filter"; 
                return $this->commonCurlGetRequest($curl_url,$a_header);    
            }else{
                return [];
            }
        // }catch(Exception $e){
        //     DB::table('error_detail')->insert([
        //         'message'=>$e->getMessage(),
        //         'error_path'=>'from common getPendinCampaignGroupDetail function'
        //     ]);
        // }
    }

    public function showUserCampaignGroup($a_linkedin_account_id){
        //try{
            $linkedin_account_id = explode('-',$a_linkedin_account_id)[0];
            $encrypt_user_id = explode('-',$a_linkedin_account_id)[1];
            $search_data = explode('-',$a_linkedin_account_id)[2];
            $status_data = explode('-',$a_linkedin_account_id)[3];
            //dd($search_data);
            $pagination_range = '';
            $status_filter = '';
            
            $current_year = date('Y');
            $current_month = date('m');
            $current_date = date('d');
            $previous_date = date('Y-m-d', strtotime('-29 days'));
            $a_previous_date = explode('-',$previous_date);
            $previous_year = $a_previous_date[0];
            $previous_month = $a_previous_date[1];
            $previous_date = $a_previous_date[2];
            
            $search_date_range = "&dateRange.start.year=$previous_year&dateRange.start.month=$previous_month&dateRange.start.day=$previous_date&dateRange.end.year=$current_year&dateRange.end.month=$current_month&dateRange.end.day=$current_date";

            //$search_date_range = '&dateRange.start.year=2010&dateRange.start.month=3&dateRange.start.day=1&dateRange.end.year=2022&dateRange.end.month=4&dateRange.end.day=14';
            if(!empty($search_data)){
                $search_date_range = $this->searchByDateRange($search_data);
            }
            if(!empty($status_data)){
                $status_filter = "&search.status.values[0]=$status_data";
                //$status_filter = "&search.status.values[0]=$status_data";
            }
            
            $user_id = Crypt::decryptString($encrypt_user_id);
            $user_data = DB::table('user')->select('user_token','user_refresh_token')->where('id',$user_id)->first();
            $user_token = $user_data->user_token;
            $user_refresh_token = $user_data->user_refresh_token; 

            if(!empty($linkedin_account_id)){
                $a_linkedin_account_id = [];
                $final_linkedin_account_id = '';
                $basic_final_linkedin_account_id = '';
                $a_linkedin_account_id = explode(',',$linkedin_account_id);
                if(!empty($a_linkedin_account_id)){
                    $count = -1;
                    foreach($a_linkedin_account_id as $linkedin_account_id){
                        $count++;   
                        $final_linkedin_account_id .= "&accounts[$count]=urn:li:sponsoredAccount:$linkedin_account_id";
                        $basic_final_linkedin_account_id .= "&search.account.values[$count]=urn:li:sponsoredAccount:$linkedin_account_id";
                    }
                }
            }  
            $curl_url = "https://api.linkedin.com/v2/adAnalyticsV2?q=analytics&pivot=CAMPAIGN_GROUP$search_date_range&timeGranularity=ALL&fields=externalWebsiteConversions,dateRange,impressions,clicks,conversionValueInLocalCurrency,oneClickLeads,landingPageClicks,likes,shares,costInLocalCurrency,pivot,pivotValue$final_linkedin_account_id&projection=(*,elements*(*,pivotValue~(id,name,status)))"; 
        
            $a_header = [
                "content-type: application/json",
                "Accept: application/json",
                "Authorization: Bearer {$user_token}"
            ];  
            $basic_campaign_group_data = $this->commonCurlGetRequest($curl_url,$a_header);
            //dd($basic_campaign_group_data->elements);
            //return $basic_campaign_group_data->elements;
            foreach($basic_campaign_group_data->elements as $k=>$val){ 
                //dd($val->pivotValue);
                $handle = 'pivotValue~';
                if(isset($val->$handle->id)){ //dd($k);
                    if(isset($val->$handle->id)){
                        $campaign_group_id = $val->$handle->id; 
                        $campaign_group_name = $val->$handle->name; 
                        $campaign_group_status = $val->$handle->status; 
                        if(!empty($campaign_group_name) && isset($campaign_group_name)){
                            $basic_campaign_group_data->elements[$k]->name = $campaign_group_name;
                            $basic_campaign_group_data->elements[$k]->id = $campaign_group_id;
                            $basic_campaign_group_data->elements[$k]->status = $campaign_group_status;
                            $a_used_campaign_group_id[] = $campaign_group_id;
                        } 
                    } 
                }else{  
                    //dd($basic_campaign_group_data->elements); 
                    //unset($basic_campaign_group_data->elements[$k]);
                    $seperate_campaign_data = $this->getCampaignDetailInMultipleAccountCase($val->pivotValue,$a_header);
                    
                    if(!empty($seperate_campaign_data->elements) && isset($seperate_campaign_data->elements)){ 
                        
                        $basic_campaign_group_data->elements[$k]->name = $seperate_campaign_data->elements[0]->name??'';
                        $basic_campaign_group_data->elements[$k]->id = $seperate_campaign_data->elements[0]->id??'';
                        $basic_campaign_group_data->elements[$k]->status = $seperate_campaign_data->elements[0]->status??'';
                        $a_used_campaign_group_id[] = $seperate_campaign_data->elements[0]->id;
                    }
                    
                } 
                
                // if(!empty($status_data)){
                //     if($status_data != $campaign_group_status){
                //         continue;
                //     }
                // }
            } 
            $curl_response = $basic_campaign_group_data;
            
            if(empty($curl_response->elements)){
                $curl_url = "https://api.linkedin.com/v2/adCampaignGroupsV2?q=search$basic_final_linkedin_account_id$status_filter"; 
                //echo json_encode($this->commonCurlGetRequest($curl_url,$a_header));
                return $this->commonCurlGetRequest($curl_url,$a_header);
            }else{ 
                $get_all_campaign_account_id = "https://api.linkedin.com/v2/adCampaignGroupsV2?q=search$basic_final_linkedin_account_id"; 
                $a_get_all_campaign_account_id = $this->commonCurlGetRequest($get_all_campaign_account_id,$a_header);
                if(!empty($a_get_all_campaign_account_id->elements) && isset($a_get_all_campaign_account_id->elements)){
                    foreach($a_get_all_campaign_account_id->elements as $kkey=>$campaign_group_data){ 
                        $a_linkedin_campaign_group_id[] = $campaign_group_data->id;
                    }
                } 
                $a_remaining_campaign_group_id = array_diff($a_linkedin_campaign_group_id,$a_used_campaign_group_id);
                
                $a_remaining_campaign_group_data = $this->getPendinCampaignGroupDetail($a_remaining_campaign_group_id,$a_header,$status_filter);  
                // $campaign_group_merge_data =  array_merge($curl_response->elements,$a_remaining_campaign_group_data->elements);

                if(!empty($a_remaining_campaign_group_data)){
                    $campaign_group_merge_data =  array_merge($curl_response->elements,$a_remaining_campaign_group_data->elements);
                    return ['elements'=>$campaign_group_merge_data];
                }else{
                    return ['elements'=>$curl_response->elements];
                }

                return ['elements'=>$campaign_group_merge_data];
                //return $curl_response;
            } 
        // }catch(Exception $e){
        //     DB::table('error_detail')->insert([
        //         'message'=>$e->getMessage(),
        //         'error_path'=>'from common showUserCampaignGroup function'
        //     ]);
        // }
    }
    public function showUserCampaignUnderAccount($a_linkedin_account_id){
        //try{
            $linkedin_account_id = explode('-',$a_linkedin_account_id)[0];
            $encrypt_user_id = explode('-',$a_linkedin_account_id)[1]; 
            $search_data = explode('-',$a_linkedin_account_id)[2];
            $status_data = explode('-',$a_linkedin_account_id)[3];
            
            $user_id = Crypt::decryptString($encrypt_user_id);
            $user_data = DB::table('user')->select('user_token','user_refresh_token')->where('id',$user_id)->first();
            $user_token = $user_data->user_token;
            $user_refresh_token = $user_data->user_refresh_token;

            $current_year = date('Y');
            $current_month = date('m');
            $current_date = date('d');
            $previous_date = date('Y-m-d', strtotime('-29 days'));
            $a_previous_date = explode('-',$previous_date);
            $previous_year = $a_previous_date[0];
            $previous_month = $a_previous_date[1];
            $previous_date = $a_previous_date[2];
            
            $search_date_range = "&dateRange.start.year=$previous_year&dateRange.start.month=$previous_month&dateRange.start.day=$previous_date&dateRange.end.year=$current_year&dateRange.end.month=$current_month&dateRange.end.day=$current_date";

            //$search_date_range = '&dateRange.start.year=2000&dateRange.start.month=3&dateRange.start.day=1&dateRange.end.year=2022&dateRange.end.month=3&dateRange.end.day=22';
            $status_filter = '';
            if(!empty($search_data)){
                $search_date_range = $this->searchByDateRange($search_data);
            }
            if(!empty($status_data)){
                $status_filter = "&search.status.values[0]=$status_data";
            }
            
            if(!empty($linkedin_account_id)){
                $a_linkedin_account_id = [];  
                $basic_final_linkedin_account_id = '';
                $a_linkedin_account_id = explode(',',$linkedin_account_id);
                if(!empty($a_linkedin_account_id)){
                    $count = -1;
                    foreach($a_linkedin_account_id as $linkedin_account_id_value){
                        $count++;    
                        $basic_final_linkedin_account_id .= "&search.account.values[$count]=urn:li:sponsoredAccount:$linkedin_account_id_value";
                    }
                }
            }else{ 
                $basic_final_linkedin_account_id = "/0";
            }  
            $a_header = [
                //"X-RestLi-Protocol-Version: 2.0.0",
                "content-type: application/json",
                "Accept: application/json",
                "Authorization: Bearer {$user_token}"
            ];  
            
            $curl_url = "https://api.linkedin.com/v2/adCampaignsV2?q=search$basic_final_linkedin_account_id$status_filter"; 
            return $this->commonCurlGetRequest($curl_url,$a_header);
        // }catch(Exception $e){
        //     DB::table('error_detail')->insert([
        //         'message'=>$e->getMessage(),
        //         'error_path'=>'from common showUserCampaignUnderAccount function'
        //     ]);
        // }
    } 

    public function showUserCreativeUnderAccount($a_linkedin_campaign_group_id){ 
        //="509080795-eyJpdiI6IkJnUmpGZmg1c3Z6eVNscHVwcWVsc3c9PSIsInZhbHVlIjoib25SVW9RL3gxNUhUNU5EUWNwL3BXdz09IiwibWFjIjoiNTM5MjE1ZmJjZmI2NjZmNmQ4ZmQxNzkwODAwZTdjY2FiZmViODNmNzE2YmVkYmNjNDY3OTlkOWVlZjA3MDZjYiIsInRhZyI6IiJ9--"  
        $linkedin_account_id = explode('-',$a_linkedin_campaign_group_id)[0]; 
        $encrypt_user_id = explode('-',$a_linkedin_campaign_group_id)[1]; 
        $search_data = explode('-',$a_linkedin_campaign_group_id)[2]; 
        $status_data = explode('-',$a_linkedin_campaign_group_id)[3]; 

        $a_campaign_data = $this->showUserCampaignUnderAccount($a_linkedin_campaign_group_id);
        
        $a_campaign_id = [];
        $campaign_id = 0;
        if(!empty($a_campaign_data->elements)){
            foreach($a_campaign_data->elements as $k=>$campaign_value){ 
                $a_campaign_id = $campaign_value->id;
            } 
            // if(!empty($a_campaign_id)){
            //     $campaign_id = implode(',',$a_campaign_id);
            // }
        }
        $update_parameter = $a_campaign_id.'-'.$encrypt_user_id.'-'.$search_data.'-'.$status_data;
        $get_ads_data = $this->showUserCreative($update_parameter);
        return $get_ads_data;  
    }
    public function showUserCreativeUnderAccountold($a_linkedin_campaign_group_id){
        //try{
 
            $linkedin_campaign_group_id = explode('-',$a_linkedin_campaign_group_id)[0];
            $encrypt_user_id = explode('-',$a_linkedin_campaign_group_id)[1];
            $search_data = explode('-',$a_linkedin_campaign_group_id)[2];
            $status_data = explode('-',$a_linkedin_campaign_group_id)[3]; 

            $pagination_range = '';
            $status_filter = '';
            $search_date_range = '&dateRange.start.year=2010&dateRange.start.month=3&dateRange.start.day=1&dateRange.end.year=2022&dateRange.end.month=12&dateRange.end.day=16';
            if(!empty($search_data)){
                $search_date_range = $this->searchByDateRange($search_data);
            }
            if(!empty($status_data)){
                $status_filter = "&search.status.values[0]=$status_data";
            }  

            $user_id = Crypt::decryptString($encrypt_user_id);
            $user_data = DB::table('user')->select('user_token','user_refresh_token')->where('id',$user_id)->first();
            $user_token = $user_data->user_token;
            $user_refresh_token = $user_data->user_refresh_token; 
 
            if(!empty($linkedin_campaign_group_id)){
                $a_linkedin_campaign_group_id = []; 
                $basic_final_linkedin_creative_id = '';
                $a_linkedin_campaign_group_id = explode(',',$linkedin_campaign_group_id);
                if(!empty($a_linkedin_campaign_group_id)){
                    $count = -1;
                    foreach($a_linkedin_campaign_group_id as $linkedin_campaign_group_id){
                        $count++;    
                        $basic_final_linkedin_creative_id .= "&search.account.values[$count]=urn:li:sponsoredAccount:$linkedin_campaign_group_id";
                    }
                }
            } 
            
            $a_header = [
                "content-type: application/json",
                "Accept: application/json",
                "Authorization: Bearer {$user_token}"
            ];  
            //echo  "https://api.linkedin.com/v2/adCreativesV2?q=search$basic_final_linkedin_creative_id$status_filter"; die;
            $curl_url = "https://api.linkedin.com/v2/adCreativesV2?q=search$basic_final_linkedin_creative_id$status_filter";  
                
            $a_creative_data =  $this->commonCurlGetRequest($curl_url,$a_header); 
            
            if(!empty($a_creative_data->elements)){
                foreach($a_creative_data->elements as $k=>$creative_value){ 
                    if(!empty($creative_value->reference)){
                        $curl_share_url = "https://api.linkedin.com/v2/shares/$creative_value->reference";
                        $creative_data_with_name =  $this->commonCurlGetRequest($curl_share_url,$a_header); 
                        
                        if(isset($creative_data_with_name->content->title)){ 
                            $ads_name = $creative_data_with_name->content->title; 
                        }else{
                            $ads_name = 'NA';
                        }
                        $a_creative_data->elements[$k]->ads_name =  $ads_name;
                    }
                } 
            }
            return $a_creative_data;
        // }catch(Exception $e){
        //     DB::table('error_detail')->insert([
        //         'message'=>$e->getMessage(),
        //         'error_path'=>'from common showUserCreativeUnderAccount function'
        //     ]);
        // }
    }
    
    public function getPendinCampaignDetail($a_remaining_account_id,$a_header,$status_filter){
        //try{
            if(!empty($a_remaining_account_id)){
                $count = -1;
                $basic_final_linkedin_account_id = '';
                foreach($a_remaining_account_id as $linkedin_account_id_value){
                    $count++;    
                    $basic_final_linkedin_account_id .= "&search.id.values[$count]=$linkedin_account_id_value";
                }
                $curl_url = "https://api.linkedin.com/v2/adCampaignsV2?q=search$basic_final_linkedin_account_id$status_filter"; 
                return $this->commonCurlGetRequest($curl_url,$a_header); 
            }else{
                //$basic_final_linkedin_account_id .= "&search.id.values[0]=0";
                return [];
            } 
        // }catch(Exception $e){
        //     DB::table('error_detail')->insert([
        //         'message'=>$e->getMessage(),
        //         'error_path'=>'from common getPendinCampaignDetail function'
        //     ]);
        // }
        
    }

    public function showUserCampaign($a_linkedin_campaign_group_id){
        //try{
            $linkedin_campaign_group_id = explode('-',$a_linkedin_campaign_group_id)[0];
            $encrypt_user_id = explode('-',$a_linkedin_campaign_group_id)[1];
            $search_data = explode('-',$a_linkedin_campaign_group_id)[2];
            $status_data = explode('-',$a_linkedin_campaign_group_id)[3]; 

            $pagination_range = '';
            $status_filter = '';

            $current_year = date('Y');
            $current_month = date('m');
            $current_date = date('d');
            $previous_date = date('Y-m-d', strtotime('-29 days'));
            $a_previous_date = explode('-',$previous_date);
            $previous_year = $a_previous_date[0];
            $previous_month = $a_previous_date[1];
            $previous_date = $a_previous_date[2];
            
            $search_date_range = "&dateRange.start.year=$previous_year&dateRange.start.month=$previous_month&dateRange.start.day=$previous_date&dateRange.end.year=$current_year&dateRange.end.month=$current_month&dateRange.end.day=$current_date";

            //$search_date_range = '&dateRange.start.year=2020&dateRange.start.month=3&dateRange.start.day=1&dateRange.end.year=2022&dateRange.end.month=04&dateRange.end.day=20';
            if(!empty($search_data)){
                $search_date_range = $this->searchByDateRange($search_data);
            }
            if(!empty($status_data)){
                $status_filter = "&search.status.values[0]=$status_data";
            } 
            $user_id = Crypt::decryptString($encrypt_user_id);
            $user_data = DB::table('user')->select('user_token','user_refresh_token')->where('id',$user_id)->first();
            $user_token = $user_data->user_token;
            $user_refresh_token = $user_data->user_refresh_token; 

            if(!empty($linkedin_campaign_group_id)){
                $a_linkedin_campaign_group_id = [];
                $final_linkedin_campaign_group_id = '';
                $basic_final_linkedin_campaign_group_id = '';
                $a_linkedin_campaign_group_id = explode(',',$linkedin_campaign_group_id);
                if(!empty($a_linkedin_campaign_group_id)){
                    $count = -1;
                    foreach($a_linkedin_campaign_group_id as $linkedin_campaign_group_id){
                        $count++;   
                        $final_linkedin_campaign_group_id .= "&campaignGroups[$count]=urn:li:sponsoredCampaignGroup:$linkedin_campaign_group_id";
                        $basic_final_linkedin_campaign_group_id .= "&search.campaignGroup.values[$count]=urn:li:sponsoredCampaignGroup:$linkedin_campaign_group_id";
                    }
                }
            }
            
            $curl_url = "https://api.linkedin.com/v2/adAnalyticsV2?q=analytics&pivot=CAMPAIGN$search_date_range&timeGranularity=ALL&fields=oneClickLeadFormOpens,externalWebsiteConversions,dateRange,impressions,clicks,oneClickLeads,landingPageClicks,likes,shares,costInLocalCurrency,pivot,pivotValue$final_linkedin_campaign_group_id&projection=(*,elements*(*,pivotValue~(id,name,status)))";
            
            $a_header = [
                "content-type: application/json",
                "Accept: application/json",
                "Authorization: Bearer {$user_token}"
            ];  
            $basic_campaign_data = $this->commonCurlGetRequest($curl_url,$a_header);
            // dd($basic_campaign_data->elements);
            foreach($basic_campaign_data->elements as $k=>$val){ 
                $handle = 'pivotValue~';
                $a_used_campaign_id[] = 0;
                if(isset($val->$handle->status)){
                    $campaign_status = $val->$handle->status; 
                    // if(!empty($status_data)){
                    //     if($status_data != $campaign_status){
                    //         continue;
                    //     }
                    // } 
                    $campaign_id = $val->$handle->id; 
                    $campaign_name = $val->$handle->name; 
                    
                    $basic_campaign_data->elements[$k]->name = $campaign_name;
                    $basic_campaign_data->elements[$k]->id = $campaign_id;
                    $basic_campaign_data->elements[$k]->status = $campaign_status;
                    $a_used_campaign_id[] = $campaign_id;
                }
            } 
            $curl_response =  $basic_campaign_data; 
            if(empty($curl_response->elements)){
                $curl_url = "https://api.linkedin.com/v2/adCampaignsV2?q=search$basic_final_linkedin_campaign_group_id$status_filter"; 
                return $this->commonCurlGetRequest($curl_url,$a_header);
            }else{ 
                $get_all_campaign_account_id = "https://api.linkedin.com/v2/adCampaignsV2?q=search$basic_final_linkedin_campaign_group_id$status_filter"; 
                $a_linkedin_campaign_id = [];
                $a_get_all_campaign_account_id = $this->commonCurlGetRequest($get_all_campaign_account_id,$a_header);
                if(!empty($a_get_all_campaign_account_id->elements) && isset($a_get_all_campaign_account_id->elements)){
                    foreach($a_get_all_campaign_account_id->elements as $kkey=>$campaign_data){ 
                        $a_linkedin_campaign_id[] = $campaign_data->id;
                    }
                }  

                $a_remaining_campaign_id = array_diff($a_linkedin_campaign_id,$a_used_campaign_id); 
                $a_remaining_campaign_data = $this->getPendinCampaignDetail($a_remaining_campaign_id,$a_header,$status_filter);  

                if(!empty($a_remaining_campaign_data)){
                    $campaign_merge_data =  array_merge($curl_response->elements,$a_remaining_campaign_data->elements);
                    return ['elements'=>$campaign_merge_data];
                }else{
                    return ['elements'=>$curl_response->elements];
                }

                $campaign_merge_data =  array_merge($curl_response->elements,$a_remaining_campaign_data->elements);
                return ['elements'=>$campaign_merge_data];

                //return $curl_response;
            } 
        // }catch(Exception $e){
        //     DB::table('error_detail')->insert([
        //         'message'=>$e->getMessage(),
        //         'error_path'=>'from common showUserCampaign function'
        //     ]);
        // }
    }
    

    public function showUserCreative($a_linkedin_campaign_group_id){  
        //try{
            //dd($a_linkedin_campaign_group_id);
            $linkedin_campaign_group_id = explode('-',$a_linkedin_campaign_group_id)[0];
            $encrypt_user_id = explode('-',$a_linkedin_campaign_group_id)[1];
            $search_data = explode('-',$a_linkedin_campaign_group_id)[2];
            $status_data = explode('-',$a_linkedin_campaign_group_id)[3]; 
            $pagination_range = '';
            $status_filter = '';

            $current_year = date('Y');
            $current_month = date('m');
            $current_date = date('d');
            $previous_date = date('Y-m-d', strtotime('-29 days'));
            $a_previous_date = explode('-',$previous_date);
            $previous_year = $a_previous_date[0];
            $previous_month = $a_previous_date[1];
            $previous_date = $a_previous_date[2];
            
            $search_date_range = "&dateRange.start.year=$previous_year&dateRange.start.month=$previous_month&dateRange.start.day=$previous_date&dateRange.end.year=$current_year&dateRange.end.month=$current_month&dateRange.end.day=$current_date";

            //$search_date_range = '&dateRange.start.year=2010&dateRange.start.month=3&dateRange.start.day=1&dateRange.end.year=2022&dateRange.end.month=3&dateRange.end.day=16';
            if(!empty($search_data)){
                $search_date_range = $this->searchByDateRange($search_data);
            } 
            if(!empty($status_data)){
                $status_filter = "&search.status.values[0]=$status_data";
            } 
            $user_id = Crypt::decryptString($encrypt_user_id);
            $user_data = DB::table('user')->select('user_token','user_refresh_token')->where('id',$user_id)->first();
            $user_token = $user_data->user_token;
            $user_refresh_token = $user_data->user_refresh_token; 

            if(!empty($linkedin_campaign_group_id)){
                $a_linkedin_campaign_group_id = [];
                $final_linkedin_creative_id = '';
                $basic_final_linkedin_creative_id = '';
                $a_linkedin_campaign_group_id = explode(',',$linkedin_campaign_group_id); 
                if(!empty($a_linkedin_campaign_group_id)){
                    $count = -1;
                    foreach($a_linkedin_campaign_group_id as $linkedin_campaign_group_id){ 
                        if(!empty($linkedin_campaign_group_id)){
                            $count++;   
                            $final_linkedin_creative_id .= "&campaigns[$count]=urn:li:sponsoredCampaign:$linkedin_campaign_group_id";
                            $basic_final_linkedin_creative_id .= "&search.campaign.values[$count]=urn:li:sponsoredCampaign:$linkedin_campaign_group_id";
                            
                        }
                    }
                }
            }  

            $curl_url = "https://api.linkedin.com/v2/adCreativesV2?q=search$basic_final_linkedin_creative_id$status_filter";

            $a_header = [
                "content-type: application/json",
                "Accept: application/json",
                "Authorization: Bearer {$user_token}"
            ];  
            $basic_campaign_data = $this->commonCurlGetRequest($curl_url,$a_header);
            //dd($basic_campaign_data->elements[0]->type);
            if(isset($basic_campaign_data->elements) && !empty($basic_campaign_data->elements)){  
                foreach($basic_campaign_data->elements as $k=>$val){ 
                    //dd($val);
                    $pivotValue = "pivotValue~";
                    $curl_url = "https://api.linkedin.com/v2/adAnalyticsV2?q=analytics&pivot=CREATIVE$search_date_range&timeGranularity=ALL&fields=externalWebsiteConversions,dateRange,oneClickLeads,impressions,landingPageClicks,clicks,likes,shares,costInLocalCurrency,pivot,pivotValue&creatives[0]=urn%3Ali%3AsponsoredCreative%3A$val->id&projection=(*,elements(*(*,pivotValue~(id,type,status,variables(data(*,com.linkedin.ads.SponsoredUpdateCarouselCreativeVariables(share~(subject)),com.linkedin.ads.SponsoredVideoCreativeVariables(*),com.linkedin.ads.SponsoredUpdateCreativeVariables(*,share~(subject))))))))"; 
                    $a_header = [
                        "content-type: application/json", 
                        "LinkedIn-Version:202206",
                        "Authorization: Bearer {$user_token}"
                    ];  
                    $anylatic_campaign_data = $this->commonCurlGetRequest($curl_url,$a_header);
                    //dd($anylatic_campaign_data->elements[0]->$pivotValue);
                    if(isset($anylatic_campaign_data->elements[0]->$pivotValue->id)){ 
                        $basic_campaign_data->elements[$k] = $anylatic_campaign_data->elements[0]; 
                        $basic_campaign_data->elements[$k]->id = $anylatic_campaign_data->elements[0]->$pivotValue->id;
                        $basic_campaign_data->elements[$k]->type = $anylatic_campaign_data->elements[0]->$pivotValue->type;
                        $basic_campaign_data->elements[$k]->status = $anylatic_campaign_data->elements[0]->$pivotValue->status;
                    }

                    $basic_campaign_data->elements[$k]->ads_name = '';
                    if(isset($val->reference)){ 
                        //dd($basic_campaign_data->elements[$k]); 
                        if(isset($basic_campaign_data->elements[$k]->type)){
                            if($basic_campaign_data->elements[$k]->type == 'SPONSORED_STATUS_UPDATE' || $basic_campaign_data->elements[$k]->type == 'SPONSORED_UPDATE_CAROUSEL'){
                                $curl_share_url = "https://api.linkedin.com/v2/shares/$val->reference";
                                $creative_data_with_name =  $this->commonCurlGetRequest($curl_share_url,$a_header);
                            
                                if(isset($creative_data_with_name->subject)){
                                    $ads_name = $creative_data_with_name->subject;
                                }else{
                                    $ads_name = '';
                                }
                                $basic_campaign_data->elements[$k]->ads_name =  $ads_name;
                            }
                        }
                        
                        if(isset($basic_campaign_data->elements[$k]->type)){  
                            if($basic_campaign_data->elements[$k]->type == 'SPONSORED_VIDEO'){  
                                $curl_url = "https://api.linkedin.com/v2/adDirectSponsoredContents/$val->reference";  
                                $a_creative_data_basic =  $this->commonCurlGetRequest($curl_url,$a_header); 
                                if(isset($a_creative_data_basic->name)){
                                    $ads_name = $a_creative_data_basic->name;
                                }else{
                                    $ads_name = '';
                                }
                                $basic_campaign_data->elements[$k]->ads_name =  $ads_name;
                            }
                        }
                        if(isset($basic_campaign_data->elements[$k]->type)){
                            if($basic_campaign_data->elements[$k]->type == 'SPONSORED_INMAILS' || $basic_campaign_data->elements[$k]->type == 'SPONSORED_MESSAGE'){  
                                $curl_share_url = "https://api.linkedin.com/rest/inMailContents/$val->reference";
                                $a_header = [
                                    "content-type: application/json", 
                                    "LinkedIn-Version:202206",
                                    //"X-Restli-Protocol-Version:2.0.0",
                                    "Authorization: Bearer {$user_token}"
                                ];
                                $creative_data_with_name =  $this->commonCurlGetRequest($curl_share_url,$a_header);
                                //dd($creative_data_with_name);
                                if(isset($creative_data_with_name->subject)){
                                    $ads_name = $creative_data_with_name->subject;
                                }else{
                                    $ads_name = '';
                                }
                                $basic_campaign_data->elements[$k]->ads_name =  $ads_name;
                            }
                        }

                    }else{
                        $additional_parameter_spotlight = 'com.linkedin.ads.SpotlightCreativeVariablesV2';
                        $additional_parameter_text_ads = 'com.linkedin.ads.TextAdCreativeVariables';
                        if(isset($basic_campaign_data->elements[$k]->type)){
                            if($basic_campaign_data->elements[$k]->type == 'SPOTLIGHT_V2'){
                                $basic_campaign_data->elements[$k]->ads_name =  @$basic_campaign_data->elements[$k]->variables->data->$additional_parameter_spotlight->headline;
                            }
                        }
                        if(isset($basic_campaign_data->elements[$k]->type)){
                            if($basic_campaign_data->elements[$k]->type == 'TEXT_AD'){
                                $basic_campaign_data->elements[$k]->ads_name =  $basic_campaign_data->elements[$k]->variables->data->$additional_parameter_text_ads->title;
                            }
                        }
                    }

                } 
            }
            return $basic_campaign_data; 
        // }catch(Exception $e){
        //     DB::table('error_detail')->insert([
        //         'message'=>$e->getMessage(),
        //         'error_path'=>'from common showUserCreative function'
        //     ]);
        // }
    }
    
    public function adsTypeData($a_linkedin_campaign_group_id){  
        //try{ 
            $linkedin_campaign_group_id = explode('-',$a_linkedin_campaign_group_id)[0];
            $encrypt_user_id = explode('-',$a_linkedin_campaign_group_id)[1];
            $search_data = explode('-',$a_linkedin_campaign_group_id)[2];
            $status_data = explode('-',$a_linkedin_campaign_group_id)[3]; 
            $pagination_range = '';
            $status_filter = '';

            $current_year = date('Y');
            $current_month = date('m');
            $current_date = date('d');
            $previous_date = date('Y-m-d', strtotime('-29 days'));
            $a_previous_date = explode('-',$previous_date);
            $previous_year = $a_previous_date[0];
            $previous_month = $a_previous_date[1];
            $previous_date = $a_previous_date[2];
            
            $search_date_range = "&dateRange.start.year=$previous_year&dateRange.start.month=$previous_month&dateRange.start.day=$previous_date&dateRange.end.year=$current_year&dateRange.end.month=$current_month&dateRange.end.day=$current_date"; 

            if(!empty($search_data)){
                $search_date_range = $this->searchByDateRange($search_data);
            } 
            //dd($search_date_range);
            if(!empty($status_data)){
                $status_filter = "&search.status.values[0]=$status_data";
            } 
            $user_id = Crypt::decryptString($encrypt_user_id);
            $user_data = DB::table('user')->select('user_token','user_refresh_token')->where('id',$user_id)->first();
            $user_token = $user_data->user_token;
            $user_refresh_token = $user_data->user_refresh_token; 

            if(!empty($linkedin_campaign_group_id)){
                $basic_final_linkedin_creative_id = "&search.account.values[0]=urn:li:sponsoredAccount:$linkedin_campaign_group_id";
            }  

            $curl_url = "https://api.linkedin.com/v2/adCreativesV2?q=search$basic_final_linkedin_creative_id$status_filter";
            //dd($curl_url);
            $a_header = [
                "content-type: application/json",
                "Accept: application/json",
                "Authorization: Bearer {$user_token}"
            ];  
            $basic_campaign_data = $this->commonCurlGetRequest($curl_url,$a_header);

 //dateRange=(start:(day:1,month:11,year:2022),end:(day:30,month:11,year:2022))


            $curl_url   =  "https://api.linkedin.com/v2/adAnalyticsV2?q=analytics$search_date_range&timeGranularity=ALL&accounts[0]=urn%3Ali%3AsponsoredAccount%3A$linkedin_campaign_group_id&pivot=CREATIVE&fields=costInLocalCurrency,oneClickLeads,pivotValue,impressions,likes,clicks,externalWebsiteConversions&projection=(*,elements(*(*,pivotValue~(variables(data(*,com.linkedin.ads.FollowCompanyCreativeVariablesV2(*,organizationLogo~:playableStreams),com.linkedin.ads.JobsCreativeVariablesV2(*,logo~:playableStreams),com.linkedin.ads.SpotlightCreativeVariablesV2(*,logo~:playableStreams),com.linkedin.ads.TextAdCreativeVariables(*,vectorImage~:playableStreams),com.linkedin.ads.SponsoredInMailCreativeVariables(*,content(*)),com.linkedin.ads.SponsoredVideoCreativeVariables(*,mediaAsset~:playableStreams),com.linkedin.ads.SponsoredUpdateCarouselCreativeVariables(share~(subject,id,text(text),content(*,contentEntities(*(entityLocation,title,landingPageUrl,entity))))),com.linkedin.ads.SponsoredUpdateCreativeVariables(*,share~(subject,text(text,type),content(*,contentEntities(*(type,description,entityLocation,thumbnails,title,id)))))))))))"; 
            
            $a_header = [
                "content-type: application/json",  
                "LinkedIn-Version:202206",
                //"X-Restli-Protocol-Version: 2.0.0",
                "Authorization: Bearer {$user_token}"
            ];  

            $anylatic_campaign_data = $this->commonCurlGetRequest($curl_url,$a_header); 
            $count = 0; 
            $pv_value = "pivotValue~"; 
            $follow_ads_type_enum = "com.linkedin.ads.FollowCompanyCreativeVariablesV2";
            $job_ads_type_enum = "com.linkedin.ads.JobsCreativeVariablesV2";
            $text_ads_type_enum = "com.linkedin.ads.TextAdCreativeVariables";
            $spotlight_ads_type_enum = "com.linkedin.ads.SpotlightCreativeVariablesV2";
            $mail_ads_type_enum = "com.linkedin.ads.SponsoredInMailCreativeVariables";
            $video_ads_type_enum = "com.linkedin.ads.SponsoredVideoCreativeVariables";
            $carousel_ads_type_enum = "com.linkedin.ads.SponsoredUpdateCarouselCreativeVariables";
            $creative_ads_type_enum = "com.linkedin.ads.SponsoredUpdateCreativeVariables";
            
            $total_impression_follow_ads = 0;
            $total_clicks_follow_ads = 0;
            $total_leads_follow_ads = 0;
            $total_ctr_follow_ads = 0;
            $total_result_follow_ads = 0;
            $total_cost_per_follow_ads = 0;
            $total_spend_follow_ads = 0;

            $total_impression_job_ads = 0;
            $total_clicks_job_ads = 0;
            $total_leads_job_ads = 0;
            $total_ctr_job_ads = 0;
            $total_result_job_ads = 0;
            $total_cost_per_job_ads = 0;
            $total_spend_job_ads = 0;

            $total_impression_text_ads = 0;
            $total_clicks_text_ads = 0;
            $total_leads_text_ads = 0;
            $total_ctr_text_ads = 0;
            $total_result_text_ads = 0;
            $total_cost_per_text_ads = 0;
            $total_spend_text_ads = 0;

            $total_impression_spotlight_ads = 0;
            $total_clicks_spotlight_ads = 0;
            $total_leads_spotlight_ads = 0;
            $total_ctr_spotlight_ads = 0;
            $total_result_spotlight_ads = 0;
            $total_cost_per_spotlight_ads = 0;
            $total_spend_spotlight_ads = 0;

            $total_impression_mail_ads = 0;
            $total_clicks_mail_ads = 0;
            $total_leads_mail_ads = 0;
            $total_ctr_mail_ads = 0;
            $total_result_mail_ads = 0;
            $total_cost_per_mail_ads = 0;
            $total_spend_mail_ads = 0;

            $total_impression_video_ads = 0;
            $total_clicks_video_ads = 0;
            $total_leads_video_ads = 0;
            $total_ctr_video_ads = 0;
            $total_result_video_ads = 0;
            $total_cost_per_video_ads = 0;
            $total_spend_video_ads = 0;

            $total_impression_carousel_ads = 0;
            $total_clicks_carousel_ads = 0;
            $total_leads_carousel_ads = 0;
            $total_ctr_carousel_ads = 0;
            $total_result_carousel_ads = 0;
            $total_cost_per_carousel_ads = 0;
            $total_spend_carousel_ads = 0;

            $total_impression_creative_ads = 0;
            $total_clicks_creative_ads = 0;
            $total_leads_creative_ads = 0;
            $total_ctr_creative_ads = 0;
            $total_result_creative_ads = 0;
            $total_cost_per_creative_ads = 0;
            $total_spend_creative_ads = 0;
            
            $ads_type_total = []; 
            foreach($anylatic_campaign_data->elements as $kk=>$vv){ 
                $impression = $vv->impressions;
                $clicks = $vv->clicks;
                $leads = $vv->oneClickLeads;
                $ctr = ($impression)?($clicks/$impression)*100:0;
                $result = $vv->oneClickLeads;
                $spend = $vv->costInLocalCurrency;
                $costperresult = (!empty($vv->oneClickLeads))?$vv->costInLocalCurrency/$vv->oneClickLeads:0;
  
                if(isset($vv->$pv_value->variables->data->$follow_ads_type_enum)){ 
                    $total_impression_follow_ads += $impression;
                    $total_clicks_follow_ads += $clicks;
                    $total_leads_follow_ads += $leads;
                    $total_ctr_follow_ads += $ctr;
                    $total_result_follow_ads += $result;
                    $total_cost_per_follow_ads += $costperresult;
                    $total_spend_follow_ads += $spend;


                    $ads_type_total['follow_ads'] = [
                        "impression" => $total_impression_follow_ads,
                        "clicks" => $total_clicks_follow_ads,
                        "leads" => $total_leads_follow_ads,
                        "ctr" => round($total_ctr_follow_ads,2),
                        "result" => $total_result_follow_ads,
                        "costperresult" => round($total_cost_per_follow_ads,2),
                        "spend" => round($total_spend_follow_ads,2)
                    ]; 

                }elseif(isset($vv->$pv_value->variables->data->$job_ads_type_enum)){  
                    $total_impression_job_ads += $impression;
                    $total_clicks_job_ads += $clicks;
                    $total_leads_job_ads += $leads;
                    $total_ctr_job_ads += $ctr;
                    $total_result_job_ads += $result;
                    $total_cost_per_job_ads += $costperresult;
                    $total_spend_job_ads += $spend;

                    $ads_type_total['job_ads'] = [
                        "impression" => $total_impression_job_ads,
                        "clicks" => $total_clicks_job_ads,
                        "leads" => $total_leads_job_ads,
                        "ctr" => round($total_ctr_job_ads,2),
                        "result" => $total_result_job_ads,
                        "costperresult" => round($total_cost_per_job_ads,2),
                        "spend" => round($total_spend_job_ads,2)
                    ]; 
                }elseif(isset($vv->$pv_value->variables->data->$text_ads_type_enum)){ 
                    $total_impression_text_ads += $impression;
                    $total_clicks_text_ads += $clicks;
                    $total_leads_text_ads += $leads;
                    $total_ctr_text_ads += $ctr;
                    $total_result_text_ads += $result;
                    $total_cost_per_text_ads += $costperresult;
                    $total_spend_text_ads += $spend;

                    $ads_type_total['text_ads'] = [
                        "impression" => $total_impression_text_ads,
                        "clicks" => $total_clicks_text_ads,
                        "leads" => $total_leads_text_ads,
                        "ctr" => round($total_ctr_text_ads,2),
                        "result" => $total_result_text_ads,
                        "costperresult" => round($total_cost_per_text_ads,2),
                        "spend" => round($total_spend_text_ads,2)
                    ]; 
                }elseif(isset($vv->$pv_value->variables->data->$spotlight_ads_type_enum)){ 
                    $total_impression_spotlight_ads += $impression;
                    $total_clicks_spotlight_ads += $clicks;
                    $total_leads_spotlight_ads += $leads;
                    $total_ctr_spotlight_ads += $ctr;
                    $total_result_spotlight_ads += $result;
                    $total_cost_per_spotlight_ads += $costperresult;
                    $total_spend_spotlight_ads += $spend;

                    $ads_type_total['spotlight_ads'] = [
                        "impression" => $total_impression_spotlight_ads,
                        "clicks" => $total_clicks_spotlight_ads,
                        "leads" => $total_leads_spotlight_ads,
                        "ctr" => round($total_ctr_spotlight_ads,2),
                        "result" => $total_result_spotlight_ads,
                        "costperresult" => round($total_cost_per_spotlight_ads,2),
                        "spend" => round($total_spend_spotlight_ads,2)
                    ]; 
                }elseif(isset($vv->$pv_value->variables->data->$mail_ads_type_enum)){ 
                    $total_impression_mail_ads += $impression;
                    $total_clicks_mail_ads += $clicks;
                    $total_leads_mail_ads += $leads;
                    $total_ctr_mail_ads += $ctr;
                    $total_result_mail_ads += $result;
                    $total_cost_per_mail_ads += $costperresult;
                    $total_spend_mail_ads += $spend;

                    $ads_type_total['mail_ads'] = [
                        "impression" => $total_impression_mail_ads,
                        "clicks" => $total_clicks_mail_ads,
                        "leads" => $total_leads_mail_ads,
                        "ctr" => round($total_ctr_mail_ads,2),
                        "result" => $total_result_mail_ads,
                        "costperresult" => round($total_cost_per_mail_ads,2),
                        "spend" => round($total_spend_mail_ads,2)
                    ]; 
                }elseif(isset($vv->$pv_value->variables->data->$video_ads_type_enum)){ 
                    $total_impression_video_ads += $impression;
                    $total_clicks_video_ads += $clicks;
                    $total_leads_video_ads += $leads;
                    $total_ctr_video_ads += $ctr;
                    $total_result_video_ads += $result;
                    $total_cost_per_video_ads += $costperresult;
                    $total_spend_video_ads += $spend;

                    $ads_type_total['video_ads'] = [
                        "impression" => $total_impression_video_ads,
                        "clicks" => $total_clicks_video_ads,
                        "leads" => $total_leads_video_ads,
                        "ctr" => round($total_ctr_video_ads,2),
                        "result" => $total_result_video_ads,
                        "costperresult" => round($total_cost_per_video_ads,2),
                        "spend" => round($total_spend_video_ads,2)
                    ]; 
                }elseif(isset($vv->$pv_value->variables->data->$carousel_ads_type_enum)){ 
                    $total_impression_carousel_ads += $impression;
                    $total_clicks_carousel_ads += $clicks;
                    $total_leads_carousel_ads += $leads;
                    $total_ctr_carousel_ads += $ctr;
                    $total_result_carousel_ads += $result;
                    $total_cost_per_carousel_ads += $costperresult;
                    $total_spend_carousel_ads += $spend;

                    $ads_type_total['carousel_ads'] = [
                        "impression" => $total_impression_carousel_ads,
                        "clicks" => $total_clicks_carousel_ads,
                        "leads" => $total_leads_carousel_ads,
                        "ctr" => round($total_ctr_carousel_ads,2),
                        "result" => $total_result_carousel_ads,
                        "costperresult" => round($total_cost_per_carousel_ads,2),
                        "spend" => round($total_spend_carousel_ads,2)
                    ]; 
                }elseif(isset($vv->$pv_value->variables->data->$creative_ads_type_enum)){ 
                    $total_impression_creative_ads += $impression;
                    $total_clicks_creative_ads += $clicks;
                    $total_leads_creative_ads += $leads;
                    $total_ctr_creative_ads += $ctr;
                    $total_result_creative_ads += $result;
                    $total_cost_per_creative_ads += $costperresult;
                    $total_spend_creative_ads += $spend;

                    $ads_type_total['creative_ads'] = [
                        "impression" => $total_impression_creative_ads,
                        "clicks" => $total_clicks_creative_ads,
                        "leads" => $total_leads_creative_ads,
                        "ctr" => round($total_ctr_creative_ads,2),
                        "result" => $total_result_creative_ads,
                        "costperresult" => round($total_cost_per_creative_ads,2),
                        "spend" => round($total_spend_creative_ads,2)
                    ]; 
                }    
                
            }

            return $ads_type_total; 
            //return $ads_type_total;
             
        // }catch(Exception $e){
        //     DB::table('error_detail')->insert([
        //         'message'=>$e->getMessage(),
        //         'error_path'=>'from common showUserCreative function'
        //     ]);
        // }
    }

    public function adsLandingData($a_linkedin_campaign_group_id){  
        //try{ 
            $linkedin_campaign_group_id = explode('-',$a_linkedin_campaign_group_id)[0];
            $encrypt_user_id = explode('-',$a_linkedin_campaign_group_id)[1];
            $search_data = explode('-',$a_linkedin_campaign_group_id)[2];
            $ads_type = explode('-',$a_linkedin_campaign_group_id)[3]; 
            $pagination_range = '';
            $status_filter = '';

            $current_year = date('Y');
            $current_month = date('m');
            $current_date = date('d');
            $previous_date = date('Y-m-d', strtotime('-29 days'));
            $a_previous_date = explode('-',$previous_date);
            $previous_year = $a_previous_date[0];
            $previous_month = $a_previous_date[1];
            $previous_date = $a_previous_date[2];
            
            $search_date_range = "&dateRange.start.year=$previous_year&dateRange.start.month=$previous_month&dateRange.start.day=$previous_date&dateRange.end.year=$current_year&dateRange.end.month=$current_month&dateRange.end.day=$current_date"; 

            if(!empty($search_data)){
                $search_date_range = $this->searchByDateRange($search_data);
            } 
            
            // if(!empty($status_data)){
            //     $status_filter = "&search.status.values[0]=$status_data";
            // } 
            $user_id = Crypt::decryptString($encrypt_user_id);
            $user_data = DB::table('user')->select('user_token','user_refresh_token')->where('id',$user_id)->first();
            $user_token = $user_data->user_token;
            $user_refresh_token = $user_data->user_refresh_token; 

            if(!empty($linkedin_campaign_group_id)){
                $basic_final_linkedin_creative_id = "&search.account.values[0]=urn:li:sponsoredAccount:$linkedin_campaign_group_id";
            }  

            $curl_url = "https://api.linkedin.com/v2/adCreativesV2?q=search$basic_final_linkedin_creative_id$status_filter";
            //dd($curl_url);
            $a_header = [
                "content-type: application/json",
                "Accept: application/json",
                "Authorization: Bearer {$user_token}"
            ];  
            $basic_campaign_data = $this->commonCurlGetRequest($curl_url,$a_header); 
            
            $dynamic_filter = "analytics&pivot=CREATIVE";
            if($ads_type == 'com.linkedin.ads.SponsoredUpdateLeadAds'){
                $dynamic_filter = "statistics&objectiveType=LEAD_GENERATION&pivots[0]=CREATIVE";
                $ads_type = 'all';
            }

            $curl_url   =  "https://api.linkedin.com/v2/adAnalyticsV2?q=$dynamic_filter$search_date_range&timeGranularity=ALL&accounts[0]=urn%3Ali%3AsponsoredAccount%3A$linkedin_campaign_group_id&fields=costInLocalCurrency,pivotValue,impressions,likes,clicks,externalWebsiteConversions,oneClickLeads&projection=(*,elements(*(*,pivotValue~(variables(data(*,com.linkedin.ads.FollowCompanyCreativeVariablesV2(*,organizationLogo~:playableStreams),com.linkedin.ads.JobsCreativeVariablesV2(*,logo~:playableStreams),com.linkedin.ads.SpotlightCreativeVariablesV2(*,logo~:playableStreams),com.linkedin.ads.TextAdCreativeVariables(*,vectorImage~:playableStreams),com.linkedin.ads.SponsoredInMailCreativeVariables(*,content(*)),com.linkedin.ads.SponsoredVideoCreativeVariables(*,mediaAsset~:playableStreams),com.linkedin.ads.SponsoredUpdateCarouselCreativeVariables(share~(subject,id,text(text),content(*,contentEntities(*(entityLocation,title,landingPageUrl,entity))))),com.linkedin.ads.SponsoredUpdateCreativeVariables(*,share~(subject,text(text,type),content(*,contentEntities(*(type,description,entityLocation,thumbnails,title,id)))))))))))"; 
            
            //https://api.linkedin.com/v2/adCreativesV2?ids=List({$creative_id})&projection=(results(*(variables(*,data(*,com.linkedin.ads.SpotlightCreativeVariablesV2(*,share~(*)))))))
            
            $a_header = [
                "content-type: application/json",  
                "LinkedIn-Version:202210",
                //"X-Restli-Protocol-Version: 2.0.0",
                "Authorization: Bearer {$user_token}"
            ];  

            $anylatic_campaign_data = $this->commonCurlGetRequest($curl_url,$a_header); 
            $count = 0; 
            $pv_value = "pivotValue~"; 
            $follow_ads_type_enum = "com.linkedin.ads.FollowCompanyCreativeVariablesV2";
            $job_ads_type_enum = "com.linkedin.ads.JobsCreativeVariablesV2";
            $text_ads_type_enum = "com.linkedin.ads.TextAdCreativeVariables";
            $spotlight_ads_type_enum = "com.linkedin.ads.SpotlightCreativeVariablesV2";
            $mail_ads_type_enum = "com.linkedin.ads.SponsoredInMailCreativeVariables";
            $video_ads_type_enum = "com.linkedin.ads.SponsoredVideoCreativeVariables";
            $carousel_ads_type_enum = "com.linkedin.ads.SponsoredUpdateCarouselCreativeVariables";
            $creative_ads_type_enum = "com.linkedin.ads.SponsoredUpdateCreativeVariables";
            
            $total_impression_follow_ads = 0;
            $total_clicks_follow_ads = 0;
            $total_leads_follow_ads = 0;
            $total_ctr_follow_ads = 0;
            $total_result_follow_ads = 0;
            $total_cost_per_follow_ads = 0;

            $total_impression_job_ads = 0;
            $total_clicks_job_ads = 0;
            $total_leads_job_ads = 0;
            $total_ctr_job_ads = 0;
            $total_result_job_ads = 0;
            $total_cost_per_job_ads = 0;

            $total_impression_text_ads = 0;
            $total_clicks_text_ads = 0;
            $total_leads_text_ads = 0;
            $total_ctr_text_ads = 0;
            $total_result_text_ads = 0;
            $total_cost_per_text_ads = 0;

            $total_impression_spotlight_ads = 0;
            $total_clicks_spotlight_ads = 0;
            $total_leads_spotlight_ads = 0;
            $total_ctr_spotlight_ads = 0;
            $total_result_spotlight_ads = 0;
            $total_cost_per_spotlight_ads = 0;

            $total_impression_mail_ads = 0;
            $total_clicks_mail_ads = 0;
            $total_leads_mail_ads = 0;
            $total_ctr_mail_ads = 0;
            $total_result_mail_ads = 0;
            $total_cost_per_mail_ads = 0;

            $total_impression_video_ads = 0;
            $total_clicks_video_ads = 0;
            $total_leads_video_ads = 0;
            $total_ctr_video_ads = 0;
            $total_result_video_ads = 0;
            $total_cost_per_video_ads = 0;

            $total_impression_carousel_ads = 0;
            $total_clicks_carousel_ads = 0;
            $total_leads_carousel_ads = 0;
            $total_ctr_carousel_ads = 0;
            $total_result_carousel_ads = 0;
            $total_cost_per_carousel_ads = 0;

            $total_impression_creative_ads = 0;
            $total_clicks_creative_ads = 0;
            $total_leads_creative_ads = 0;
            $total_ctr_creative_ads = 0; 
            $total_result_creative_ads = 0;
            $total_cost_per_creative_ads = 0;

            $total_follow_ads_count = 0;
            $total_job_ads_count = 0;
            $total_text_ads_count = 0;
            $total_spotlight_ads_count = 0;
            $total_mail_ads_count = 0;
            $total_video_ads_count = 0;
            $total_carousel_ads_count = 0;
            $total_creative_ads_count = 0;

            //echo "<pre>";
            $share_enum = 'share~';
            $ads_name = 'NA';
            $landing_page_base_url = "NA";

            //dd($anylatic_campaign_data->elements);
            //echo "<pre>";
            $count = 0;
            $ads_type_total = [];
            foreach($anylatic_campaign_data->elements as $kk=>$vv){ 
                //print_r($vv);
                if($ads_type != 'all'){ 
                    if(!isset($vv->$pv_value->variables->data->$ads_type)){ 
                        continue;
                    }
                }

                $ads_name = 'NA';
                $landing_page_base_url = "NA";
                
                //print_r($vv);
                //dd($vv->$pv_value->variables->data->$creative_ads_type_enum->$share_enum->subject);
                //dd(explode('?',$vv->$pv_value->variables->data->$creative_ads_type_enum->$share_enum->content->contentEntities[0]->entityLocation)[0]);

                // $impression = $vv->impressions;
                // $clicks = $vv->clicks;
                // $leads = $vv->costInLocalCurrency;
                // $ctr = ($impression)?($clicks/$impression)*100:0; 
                
                if(isset($vv->$pv_value->variables->data->$follow_ads_type_enum)){ 
                    $total_follow_ads_count++;
                    if(isset($vv->$pv_value->variables->data->$follow_ads_type_enum->$share_enum->subject)){
                        $ads_name = $vv->$pv_value->variables->data->$follow_ads_type_enum->$share_enum->subject;
                        $landing_page_base_url = explode('?',$vv->$pv_value->variables->data->$follow_ads_type_enum->$share_enum->content->contentEntities[0]->entityLocation)[0];
                    } 
                
                    if(!isset(${"total_impression_follow_ads" . $landing_page_base_url})){
                        ${"total_impression_follow_ads" . $landing_page_base_url} = 0;
                    } 
                    if(!isset(${"total_clicks_follow_ads" . $landing_page_base_url})){
                        ${"total_clicks_follow_ads" . $landing_page_base_url} = 0;
                    } 
                    if(!isset(${"total_leads_follow_ads" . $landing_page_base_url})){
                        ${"total_leads_follow_ads" . $landing_page_base_url} = 0;
                    } 
                    if(!isset(${"total_ctr_follow_ads" . $landing_page_base_url})){
                        ${"total_ctr_follow_ads" . $landing_page_base_url} = 0;
                    } 
                    if(!isset(${"total_result_follow_ads" . $landing_page_base_url})){
                        ${"total_result_follow_ads" . $landing_page_base_url} = 0;
                    } 
                    if(!isset(${"total_costperresult_follow_ads" . $landing_page_base_url})){
                        ${"total_costperresult_follow_ads" . $landing_page_base_url} = 0;
                    } 

                    ${"impression" . $landing_page_base_url} = $vv->impressions;
                    ${"clicks" . $landing_page_base_url} = $vv->clicks;
                    ${"leads" . $landing_page_base_url} = $vv->costInLocalCurrency;
                    ${"ctr" . $landing_page_base_url} = (${"impression" . $landing_page_base_url})?(${"clicks" . $landing_page_base_url}/${"impression" . $landing_page_base_url})*100:0;
                    ${"result" . $landing_page_base_url} = $vv->oneClickLeads;
                    ${"costperresult" . $landing_page_base_url} = (!empty($vv->oneClickLeads))?$vv->costInLocalCurrency/$vv->oneClickLeads:0;

                    ${"total_impression_follow_ads" . $landing_page_base_url} += ${"impression" . $landing_page_base_url};
                    ${"total_clicks_follow_ads" . $landing_page_base_url} += ${"clicks" . $landing_page_base_url}; 
                    ${"total_leads_follow_ads" . $landing_page_base_url} += ${"leads" . $landing_page_base_url};
                    ${"total_ctr_follow_ads" . $landing_page_base_url} += ${"ctr" . $landing_page_base_url};  
                    ${"total_result_follow_ads" . $landing_page_base_url} += ${"result" . $landing_page_base_url};  
                    ${"total_costperresult_follow_ads" . $landing_page_base_url} += ${"costperresult" . $landing_page_base_url};

                    $ads_type_total[$landing_page_base_url] = [
                        "impression" => ${"total_impression_follow_ads" . $landing_page_base_url},
                        "clicks" => ${"total_clicks_follow_ads" . $landing_page_base_url},
                        "spend" => round(${"total_leads_follow_ads" . $landing_page_base_url},2),
                        "ctr" => round(${"total_ctr_follow_ads" . $landing_page_base_url},2),
                        "ads_type" => "follow_ads",
                        "loop_count" => $total_follow_ads_count,
                        "result" => round(${"total_result_follow_ads" . $landing_page_base_url},2),
                        "per_click_result" => round(${"total_costperresult_follow_ads" . $landing_page_base_url},2)
                    ]; 

                }elseif(isset($vv->$pv_value->variables->data->$job_ads_type_enum)){
                    $total_job_ads_count++;  
                    if(isset($vv->$pv_value->variables->data->$job_ads_type_enum->$share_enum->subject)){
                        $ads_name = $vv->$pv_value->variables->data->$job_ads_type_enum->$share_enum->subject;
                        $landing_page_base_url = explode('?',$vv->$pv_value->variables->data->$job_ads_type_enum->$share_enum->content->contentEntities[0]->entityLocation)[0];
                    }

                    if(!isset(${"total_impression_job_ads" . $landing_page_base_url})){
                        ${"total_impression_job_ads" . $landing_page_base_url} = 0;
                    } 
                    if(!isset(${"total_clicks_job_ads" . $landing_page_base_url})){
                        ${"total_clicks_job_ads" . $landing_page_base_url} = 0;
                    } 
                    if(!isset(${"total_leads_job_ads" . $landing_page_base_url})){
                        ${"total_leads_job_ads" . $landing_page_base_url} = 0;
                    } 
                    if(!isset(${"total_ctr_job_ads" . $landing_page_base_url})){
                        ${"total_ctr_job_ads" . $landing_page_base_url} = 0;
                    } 
                    if(!isset(${"total_result_job_ads" . $landing_page_base_url})){
                        ${"total_result_job_ads" . $landing_page_base_url} = 0;
                    } 
                    if(!isset(${"total_costperresult_job_ads" . $landing_page_base_url})){
                        ${"total_costperresult_job_ads" . $landing_page_base_url} = 0;
                    } 

                    ${"impression" . $landing_page_base_url} = $vv->impressions;
                    ${"clicks" . $landing_page_base_url} = $vv->clicks;
                    ${"leads" . $landing_page_base_url} = $vv->costInLocalCurrency;
                    ${"ctr" . $landing_page_base_url} = (${"impression" . $landing_page_base_url})?(${"clicks" . $landing_page_base_url}/${"impression" . $landing_page_base_url})*100:0;
                    ${"result" . $landing_page_base_url} = $vv->oneClickLeads;
                    ${"costperresult" . $landing_page_base_url} = (!empty($vv->oneClickLeads))?$vv->costInLocalCurrency/$vv->oneClickLeads:0;

                    ${"total_impression_job_ads" . $landing_page_base_url} += ${"impression" . $landing_page_base_url};
                    ${"total_clicks_job_ads" . $landing_page_base_url} += ${"clicks" . $landing_page_base_url}; 
                    ${"total_leads_job_ads" . $landing_page_base_url} += ${"leads" . $landing_page_base_url};
                    ${"total_ctr_job_ads" . $landing_page_base_url} += ${"ctr" . $landing_page_base_url}; 
                    ${"total_result_job_ads" . $landing_page_base_url} += ${"result" . $landing_page_base_url};  
                    ${"total_costperresult_job_ads" . $landing_page_base_url} += ${"costperresult" . $landing_page_base_url};

                    $ads_type_total[$landing_page_base_url] = [
                        "impression" => ${"total_impression_job_ads" . $landing_page_base_url},
                        "clicks" => ${"total_clicks_job_ads" . $landing_page_base_url},
                        "spend" => round(${"total_leads_job_ads" . $landing_page_base_url},2),
                        "ctr" => round(${"total_ctr_job_ads" . $landing_page_base_url},2),
                        "ads_type" => "job_ads",
                        "loop_count" => $total_job_ads_count,
                        "result" => round(${"total_result_job_ads" . $landing_page_base_url},2),
                        "per_click_result" => round(${"total_costperresult_job_ads" . $landing_page_base_url},2)
                    ];  

                }elseif(isset($vv->$pv_value->variables->data->$text_ads_type_enum)){ 
                    $total_text_ads_count++;
                    if(isset($vv->$pv_value->variables->data->$text_ads_type_enum->$share_enum->subject)){
                        $ads_name = $vv->$pv_value->variables->data->$text_ads_type_enum->$share_enum->subject;
                        $landing_page_base_url = explode('?',$vv->$pv_value->variables->data->$text_ads_type_enum->$share_enum->content->contentEntities[0]->entityLocation)[0];
                    }

                    if(!isset(${"total_impression_text_ads" . $landing_page_base_url})){
                        ${"total_impression_text_ads" . $landing_page_base_url} = 0;
                    } 
                    if(!isset(${"total_clicks_text_ads" . $landing_page_base_url})){
                        ${"total_clicks_text_ads" . $landing_page_base_url} = 0;
                    } 
                    if(!isset(${"total_leads_text_ads" . $landing_page_base_url})){
                        ${"total_leads_text_ads" . $landing_page_base_url} = 0;
                    } 
                    if(!isset(${"total_ctr_text_ads" . $landing_page_base_url})){
                        ${"total_ctr_text_ads" . $landing_page_base_url} = 0;
                    } 
                    if(!isset(${"total_result_text_ads" . $landing_page_base_url})){
                        ${"total_result_text_ads" . $landing_page_base_url} = 0;
                    } 
                    if(!isset(${"total_costperresult_text_ads" . $landing_page_base_url})){
                        ${"total_costperresult_text_ads" . $landing_page_base_url} = 0;
                    } 

                    ${"impression" . $landing_page_base_url} = $vv->impressions;
                    ${"clicks" . $landing_page_base_url} = $vv->clicks;
                    ${"leads" . $landing_page_base_url} = $vv->costInLocalCurrency;
                    ${"ctr" . $landing_page_base_url} = (${"impression" . $landing_page_base_url})?(${"clicks" . $landing_page_base_url}/${"impression" . $landing_page_base_url})*100:0;
                    ${"result" . $landing_page_base_url} = $vv->oneClickLeads;
                    ${"costperresult" . $landing_page_base_url} = (!empty($vv->oneClickLeads))?$vv->costInLocalCurrency/$vv->oneClickLeads:0;

                    ${"total_impression_text_ads" . $landing_page_base_url} += ${"impression" . $landing_page_base_url};
                    ${"total_clicks_text_ads" . $landing_page_base_url} += ${"clicks" . $landing_page_base_url}; 
                    ${"total_leads_text_ads" . $landing_page_base_url} += ${"leads" . $landing_page_base_url};
                    ${"total_ctr_text_ads" . $landing_page_base_url} += ${"ctr" . $landing_page_base_url};  
                    ${"total_result_text_ads" . $landing_page_base_url} += ${"result" . $landing_page_base_url};  
                    ${"total_costperresult_text_ads" . $landing_page_base_url} += ${"costperresult" . $landing_page_base_url};

                    $ads_type_total[$landing_page_base_url] = [
                        "impression" => ${"total_impression_text_ads" . $landing_page_base_url},
                        "clicks" => ${"total_clicks_text_ads" . $landing_page_base_url},
                        "spend" => round(${"total_leads_text_ads" . $landing_page_base_url},2),
                        "ctr" => round(${"total_ctr_text_ads" . $landing_page_base_url},2),
                        "ads_type" => "text_ads",
                        "loop_count" => $total_text_ads_count,
                        "result" => round(${"total_result_text_ads" . $landing_page_base_url},2),
                        "per_click_result" => round(${"total_costperresult_text_ads" . $landing_page_base_url},2)
                    ];
 
                }elseif(isset($vv->$pv_value->variables->data->$spotlight_ads_type_enum)){ 
                    $total_spotlight_ads_count++;
                    if(isset($vv->$pv_value->variables->data->$spotlight_ads_type_enum->$share_enum->subject)){
                        $ads_name = $vv->$pv_value->variables->data->$spotlight_ads_type_enum->$share_enum->subject;
                        $landing_page_base_url = explode('?',$vv->$pv_value->variables->data->$spotlight_ads_type_enum->$share_enum->content->contentEntities[0]->entityLocation)[0];
                    }

                    if(!isset(${"total_impression_spotlight_ads" . $landing_page_base_url})){
                        ${"total_impression_spotlight_ads" . $landing_page_base_url} = 0;
                    } 
                    if(!isset(${"total_clicks_spotlight_ads" . $landing_page_base_url})){
                        ${"total_clicks_spotlight_ads" . $landing_page_base_url} = 0;
                    } 
                    if(!isset(${"total_leads_spotlight_ads" . $landing_page_base_url})){
                        ${"total_leads_spotlight_ads" . $landing_page_base_url} = 0;
                    } 
                    if(!isset(${"total_ctr_spotlight_ads" . $landing_page_base_url})){
                        ${"total_ctr_spotlight_ads" . $landing_page_base_url} = 0;
                    } 
                    if(!isset(${"total_result_spotlight_ads" . $landing_page_base_url})){
                        ${"total_result_spotlight_ads" . $landing_page_base_url} = 0;
                    } 
                    if(!isset(${"total_costperresult_spotlight_ads" . $landing_page_base_url})){
                        ${"total_costperresult_spotlight_ads" . $landing_page_base_url} = 0;
                    } 

                    ${"impression" . $landing_page_base_url} = $vv->impressions;
                    ${"clicks" . $landing_page_base_url} = $vv->clicks;
                    ${"leads" . $landing_page_base_url} = $vv->costInLocalCurrency;
                    ${"ctr" . $landing_page_base_url} = (${"impression" . $landing_page_base_url})?(${"clicks" . $landing_page_base_url}/${"impression" . $landing_page_base_url})*100:0;
                    ${"result" . $landing_page_base_url} = $vv->oneClickLeads;
                    ${"costperresult" . $landing_page_base_url} = (!empty($vv->oneClickLeads))?$vv->costInLocalCurrency/$vv->oneClickLeads:0;

                    ${"total_impression_spotlight_ads" . $landing_page_base_url} += ${"impression" . $landing_page_base_url};
                    ${"total_clicks_spotlight_ads" . $landing_page_base_url} += ${"clicks" . $landing_page_base_url}; 
                    ${"total_leads_spotlight_ads" . $landing_page_base_url} += ${"leads" . $landing_page_base_url};
                    ${"total_ctr_spotlight_ads" . $landing_page_base_url} += ${"ctr" . $landing_page_base_url};   
                    ${"total_result_spotlight_ads" . $landing_page_base_url} += ${"result" . $landing_page_base_url};  
                    ${"total_costperresult_spotlight_ads" . $landing_page_base_url} += ${"costperresult" . $landing_page_base_url};

                    $ads_type_total[$landing_page_base_url] = [
                        "impression" => ${"total_impression_spotlight_ads" . $landing_page_base_url},
                        "clicks" => ${"total_clicks_spotlight_ads" . $landing_page_base_url},
                        "spend" => round(${"total_leads_spotlight_ads" . $landing_page_base_url},2),
                        "ctr" => round(${"total_ctr_spotlight_ads" . $landing_page_base_url},2),
                        "ads_type" => "spotlight_ads",
                        "loop_count" => $total_spotlight_ads_count,
                        "result" => round(${"total_result_spotlight_ads" . $landing_page_base_url},2),
                        "per_click_result" => round(${"total_costperresult_spotlight_ads" . $landing_page_base_url},2)
                    ]; 
 
                }elseif(isset($vv->$pv_value->variables->data->$mail_ads_type_enum)){ 
                    $total_mail_ads_count++; 
                    if(isset($vv->$pv_value->variables->data->$mail_ads_type_enum->$share_enum->subject)){
                        $ads_name = $vv->$pv_value->variables->data->$mail_ads_type_enum->$share_enum->subject;
                        $landing_page_base_url = explode('?',$vv->$pv_value->variables->data->$mail_ads_type_enum->$share_enum->content->contentEntities[0]->entityLocation)[0];
                    }

                    if(!isset(${"total_impression_mail_ads" . $landing_page_base_url})){
                        ${"total_impression_mail_ads" . $landing_page_base_url} = 0;
                    } 
                    if(!isset(${"total_clicks_mail_ads" . $landing_page_base_url})){
                        ${"total_clicks_mail_ads" . $landing_page_base_url} = 0;
                    } 
                    if(!isset(${"total_leads_mail_ads" . $landing_page_base_url})){
                        ${"total_leads_mail_ads" . $landing_page_base_url} = 0;
                    } 
                    if(!isset(${"total_ctr_mail_ads" . $landing_page_base_url})){
                        ${"total_ctr_mail_ads" . $landing_page_base_url} = 0;
                    } 
                    if(!isset(${"total_result_mail_ads" . $landing_page_base_url})){
                        ${"total_result_mail_ads" . $landing_page_base_url} = 0;
                    } 
                    if(!isset(${"total_costperresult_mail_ads" . $landing_page_base_url})){
                        ${"total_costperresult_mail_ads" . $landing_page_base_url} = 0;
                    } 

                    ${"impression" . $landing_page_base_url} = $vv->impressions;
                    ${"clicks" . $landing_page_base_url} = $vv->clicks;
                    ${"leads" . $landing_page_base_url} = $vv->costInLocalCurrency;
                    ${"ctr" . $landing_page_base_url} = (${"impression" . $landing_page_base_url})?(${"clicks" . $landing_page_base_url}/${"impression" . $landing_page_base_url})*100:0;
                    ${"result" . $landing_page_base_url} = $vv->oneClickLeads;
                    ${"costperresult" . $landing_page_base_url} = (!empty($vv->oneClickLeads))?$vv->costInLocalCurrency/$vv->oneClickLeads:0;

                    ${"total_impression_mail_ads" . $landing_page_base_url} += ${"impression" . $landing_page_base_url};
                    ${"total_clicks_mail_ads" . $landing_page_base_url} += ${"clicks" . $landing_page_base_url}; 
                    ${"total_leads_mail_ads" . $landing_page_base_url} += ${"leads" . $landing_page_base_url};
                    ${"total_ctr_mail_ads" . $landing_page_base_url} += ${"ctr" . $landing_page_base_url};
                    ${"total_result_mail_ads" . $landing_page_base_url} += ${"result" . $landing_page_base_url};  
                    ${"total_costperresult_mail_ads" . $landing_page_base_url} += ${"costperresult" . $landing_page_base_url};

                    $ads_type_total[$landing_page_base_url] = [
                        "impression" => ${"total_impression_mail_ads" . $landing_page_base_url},
                        "clicks" => ${"total_clicks_mail_ads" . $landing_page_base_url},
                        "spend" => round(${"total_leads_mail_ads" . $landing_page_base_url},2),
                        "ctr" => round(${"total_ctr_mail_ads" . $landing_page_base_url},2),
                        "ads_type" => "mail_ads",
                        "loop_count" => $total_mail_ads_count,
                        "result" => round(${"total_result_mail_ads" . $landing_page_base_url},2),
                        "per_click_result" => round(${"total_costperresult_mail_ads" . $landing_page_base_url},2)
                    ];  

                }elseif(isset($vv->$pv_value->variables->data->$video_ads_type_enum)){ 
                    $total_video_ads_count++;
                    if(isset($vv->$pv_value->variables->data->$video_ads_type_enum->$share_enum->subject)){
                        $ads_name = $vv->$pv_value->variables->data->$video_ads_type_enum->$share_enum->subject;
                        $landing_page_base_url = explode('?',$vv->$pv_value->variables->data->$video_ads_type_enum->$share_enum->content->contentEntities[0]->entityLocation)[0];
                    }

                    if(!isset(${"total_impression_video_ads" . $landing_page_base_url})){
                        ${"total_impression_video_ads" . $landing_page_base_url} = 0;
                    } 
                    if(!isset(${"total_clicks_video_ads" . $landing_page_base_url})){
                        ${"total_clicks_video_ads" . $landing_page_base_url} = 0;
                    } 
                    if(!isset(${"total_leads_video_ads" . $landing_page_base_url})){
                        ${"total_leads_video_ads" . $landing_page_base_url} = 0;
                    } 
                    if(!isset(${"total_ctr_video_ads" . $landing_page_base_url})){
                        ${"total_ctr_video_ads" . $landing_page_base_url} = 0;
                    } 
                    if(!isset(${"total_result_video_ads" . $landing_page_base_url})){
                        ${"total_result_video_ads" . $landing_page_base_url} = 0;
                    } 
                    if(!isset(${"total_costperresult_video_ads" . $landing_page_base_url})){
                        ${"total_costperresult_video_ads" . $landing_page_base_url} = 0;
                    } 

                    ${"impression" . $landing_page_base_url} = $vv->impressions;
                    ${"clicks" . $landing_page_base_url} = $vv->clicks;
                    ${"leads" . $landing_page_base_url} = $vv->costInLocalCurrency;
                    ${"ctr" . $landing_page_base_url} = (${"impression" . $landing_page_base_url})?(${"clicks" . $landing_page_base_url}/${"impression" . $landing_page_base_url})*100:0;
                    ${"result" . $landing_page_base_url} = $vv->oneClickLeads;
                    ${"costperresult" . $landing_page_base_url} = (!empty($vv->oneClickLeads))?$vv->costInLocalCurrency/$vv->oneClickLeads:0;

                    ${"total_impression_video_ads" . $landing_page_base_url} += ${"impression" . $landing_page_base_url};
                    ${"total_clicks_video_ads" . $landing_page_base_url} += ${"clicks" . $landing_page_base_url}; 
                    ${"total_leads_video_ads" . $landing_page_base_url} += ${"leads" . $landing_page_base_url};
                    ${"total_ctr_video_ads" . $landing_page_base_url} += ${"ctr" . $landing_page_base_url};   
                    ${"total_result_video_ads" . $landing_page_base_url} += ${"result" . $landing_page_base_url};  
                    ${"total_costperresult_video_ads" . $landing_page_base_url} += ${"costperresult" . $landing_page_base_url};

                    $ads_type_total[$landing_page_base_url] = [
                        "impression" => ${"total_impression_video_ads" . $landing_page_base_url},
                        "clicks" => ${"total_clicks_video_ads" . $landing_page_base_url},
                        "spend" => round(${"total_leads_video_ads" . $landing_page_base_url},2),
                        "ctr" => round(${"total_ctr_video_ads" . $landing_page_base_url},2),
                        "ads_type" => "video_ads",
                        "loop_count" => $total_video_ads_count,
                        "result" => round(${"total_result_video_ads" . $landing_page_base_url},2),
                        "per_click_result" => round(${"total_costperresult_video_ads" . $landing_page_base_url},2)
                    ]; 

                       
                }elseif(isset($vv->$pv_value->variables->data->$carousel_ads_type_enum)){
                    $total_carousel_ads_count++;
                    if(isset($vv->$pv_value->variables->data->$carousel_ads_type_enum->$share_enum->subject)){ 
                        $ads_name = $vv->$pv_value->variables->data->$carousel_ads_type_enum->$share_enum->subject;
                        $landing_page_base_url = explode('?',$vv->$pv_value->variables->data->$carousel_ads_type_enum->$share_enum->content->contentEntities[0]->entityLocation)[0];
                    }

                    if(!isset(${"total_impression_carousel_ads" . $landing_page_base_url})){
                        ${"total_impression_carousel_ads" . $landing_page_base_url} = 0;
                    } 
                    if(!isset(${"total_clicks_carousel_ads" . $landing_page_base_url})){
                        ${"total_clicks_carousel_ads" . $landing_page_base_url} = 0;
                    } 
                    if(!isset(${"total_leads_carousel_ads" . $landing_page_base_url})){
                        ${"total_leads_carousel_ads" . $landing_page_base_url} = 0;
                    } 
                    if(!isset(${"total_ctr_carousel_ads" . $landing_page_base_url})){
                        ${"total_ctr_carousel_ads" . $landing_page_base_url} = 0;
                    } 
                    if(!isset(${"total_result_carousel_ads" . $landing_page_base_url})){
                        ${"total_result_carousel_ads" . $landing_page_base_url} = 0;
                    } 
                    if(!isset(${"total_costperresult_carousel_ads" . $landing_page_base_url})){
                        ${"total_costperresult_carousel_ads" . $landing_page_base_url} = 0;
                    } 

                    ${"impression" . $landing_page_base_url} = $vv->impressions;
                    ${"clicks" . $landing_page_base_url} = $vv->clicks;
                    ${"leads" . $landing_page_base_url} = $vv->costInLocalCurrency;
                    ${"ctr" . $landing_page_base_url} = (${"impression" . $landing_page_base_url})?(${"clicks" . $landing_page_base_url}/${"impression" . $landing_page_base_url})*100:0;
                    ${"result" . $landing_page_base_url} = $vv->oneClickLeads;
                    ${"costperresult" . $landing_page_base_url} = (!empty($vv->oneClickLeads))?$vv->costInLocalCurrency/$vv->oneClickLeads:0;

                    ${"total_impression_carousel_ads" . $landing_page_base_url} += ${"impression" . $landing_page_base_url};
                    ${"total_clicks_carousel_ads" . $landing_page_base_url} += ${"clicks" . $landing_page_base_url}; 
                    ${"total_leads_carousel_ads" . $landing_page_base_url} += ${"leads" . $landing_page_base_url};
                    ${"total_ctr_carousel_ads" . $landing_page_base_url} += ${"ctr" . $landing_page_base_url};   
                    ${"total_result_carousel_ads" . $landing_page_base_url} += ${"result" . $landing_page_base_url};  
                    ${"total_costperresult_carousel_ads" . $landing_page_base_url} += ${"costperresult" . $landing_page_base_url};

                    $ads_type_total[$landing_page_base_url] = [
                        "impression" => ${"total_impression_carousel_ads" . $landing_page_base_url},
                        "clicks" => ${"total_clicks_carousel_ads" . $landing_page_base_url},
                        "spend" => round(${"total_leads_carousel_ads" . $landing_page_base_url},2),
                        "ctr" => round(${"total_ctr_carousel_ads" . $landing_page_base_url},2),
                        "ads_type" => "carousel_ads",
                        "loop_count" => $total_carousel_ads_count,
                        "result" => round(${"total_result_carousel_ads" . $landing_page_base_url},2),
                        "per_click_result" => round(${"total_costperresult_carousel_ads" . $landing_page_base_url},2)
                    ];  
 
                }elseif(isset($vv->$pv_value->variables->data->$creative_ads_type_enum)){ 
                    $total_creative_ads_count++; 
                    if(isset($vv->$pv_value->variables->data->$creative_ads_type_enum->$share_enum->subject)){
                        $ads_name = $vv->$pv_value->variables->data->$creative_ads_type_enum->$share_enum->subject;
                        $landing_page_base_url = explode('?',$vv->$pv_value->variables->data->$creative_ads_type_enum->$share_enum->content->contentEntities[0]->entityLocation)[0];
                    }

                    //ad_title
                    if(isset($vv->$pv_value->variables->data->$creative_ads_type_enum->$share_enum->content->title)){
                        $ad_title = $vv->$pv_value->variables->data->$creative_ads_type_enum->$share_enum->content->title;
                    }
                    //ad_title

                    if(!isset(${"total_impression_creative_ads" . $landing_page_base_url})){
                        ${"total_impression_creative_ads" . $landing_page_base_url} = 0;
                    } 
                    if(!isset(${"total_clicks_creative_ads" . $landing_page_base_url})){
                        ${"total_clicks_creative_ads" . $landing_page_base_url} = 0;
                    } 
                    if(!isset(${"total_leads_creative_ads" . $landing_page_base_url})){
                        ${"total_leads_creative_ads" . $landing_page_base_url} = 0;
                    } 
                    if(!isset(${"total_ctr_creative_ads" . $landing_page_base_url})){
                        ${"total_ctr_creative_ads" . $landing_page_base_url} = 0;
                    } 
                    if(!isset(${"total_result_creative_ads" . $landing_page_base_url})){
                        ${"total_result_creative_ads" . $landing_page_base_url} = 0;
                    } 
                    if(!isset(${"total_costperresult_creative_ads" . $landing_page_base_url})){
                        ${"total_costperresult_creative_ads" . $landing_page_base_url} = 0;
                    } 

                    ${"impression" . $landing_page_base_url} = $vv->impressions;
                    ${"clicks" . $landing_page_base_url} = $vv->clicks;
                    ${"leads" . $landing_page_base_url} = $vv->costInLocalCurrency;
                    ${"ctr" . $landing_page_base_url} = (${"impression" . $landing_page_base_url})?(${"clicks" . $landing_page_base_url}/${"impression" . $landing_page_base_url})*100:0;
                    ${"result" . $landing_page_base_url} = $vv->oneClickLeads;
                    ${"costperresult" . $landing_page_base_url} = (!empty($vv->oneClickLeads))?$vv->costInLocalCurrency/$vv->oneClickLeads:0;

                    ${"total_impression_creative_ads" . $landing_page_base_url} += ${"impression" . $landing_page_base_url};
                    ${"total_clicks_creative_ads" . $landing_page_base_url} += ${"clicks" . $landing_page_base_url}; 
                    ${"total_leads_creative_ads" . $landing_page_base_url} += ${"leads" . $landing_page_base_url};
                    ${"total_ctr_creative_ads" . $landing_page_base_url} += ${"ctr" . $landing_page_base_url};  
                    ${"total_result_creative_ads" . $landing_page_base_url} += ${"result" . $landing_page_base_url};  
                    ${"total_costperresult_creative_ads" . $landing_page_base_url} += ${"costperresult" . $landing_page_base_url};

                    $ads_type_total[$landing_page_base_url] = [
                        "ad_title" => @$ad_title,
                        "impression" => ${"total_impression_creative_ads" . $landing_page_base_url},
                        "clicks" => ${"total_clicks_creative_ads" . $landing_page_base_url},
                        "spend" => round(${"total_leads_creative_ads" . $landing_page_base_url},2),
                        "ctr" => round(${"total_ctr_creative_ads" . $landing_page_base_url},2),
                        "ads_type" => "creative_ads",
                        "loop_count" => $total_creative_ads_count,
                        "result" => round(${"total_result_creative_ads" . $landing_page_base_url},2),
                        "per_click_result" => round(${"total_costperresult_creative_ads" . $landing_page_base_url},2)
                    ];  
                } 
                 
            }  
            function array_sort_by_column(&$arr, $col, $dir = SORT_DESC) {
                $sort_col = array(); 
                foreach ($arr as $key => $row) {
                    if($key>5){ continue; }
                    $sort_col[$key] = $row[$col];
                } 
                array_multisort($sort_col, $dir, $arr);
            }
            if(!empty($ads_type_total)){
                array_sort_by_column($ads_type_total, 'spend');
            }
            return $ads_type_total; 
    }

    public function adsPerformingData($a_linkedin_campaign_group_id){  
        //try{ 
            $linkedin_campaign_group_id = explode('-',$a_linkedin_campaign_group_id)[0];
            $encrypt_user_id = explode('-',$a_linkedin_campaign_group_id)[1];
            $search_data = explode('-',$a_linkedin_campaign_group_id)[2];
            $ads_type = explode('-',$a_linkedin_campaign_group_id)[3]; 
            $pagination_range = '';
            $status_filter = '';

            $current_year = date('Y');
            $current_month = date('m');
            $current_date = date('d');
            $previous_date = date('Y-m-d', strtotime('-29 days'));
            $a_previous_date = explode('-',$previous_date);
            $previous_year = $a_previous_date[0];
            $previous_month = $a_previous_date[1];
            $previous_date = $a_previous_date[2];
            
            $search_date_range = "&dateRange.start.year=$previous_year&dateRange.start.month=$previous_month&dateRange.start.day=$previous_date&dateRange.end.year=$current_year&dateRange.end.month=$current_month&dateRange.end.day=$current_date"; 

            if(!empty($search_data)){
                $search_date_range = $this->searchByDateRange($search_data);
            } 
            // if(!empty($status_data)){
            //     $status_filter = "&search.status.values[0]=$status_data";
            // } 
            $user_id = Crypt::decryptString($encrypt_user_id);
            $user_data = DB::table('user')->select('user_token','user_refresh_token')->where('id',$user_id)->first();
            $user_token = $user_data->user_token;
            $user_refresh_token = $user_data->user_refresh_token; 

            if(!empty($linkedin_campaign_group_id)){
                $basic_final_linkedin_creative_id = "&search.account.values[0]=urn:li:sponsoredAccount:$linkedin_campaign_group_id";
            }  

            $curl_url = "https://api.linkedin.com/v2/adCreativesV2?q=search$basic_final_linkedin_creative_id$status_filter";
            //dd($curl_url);
            $a_header = [
                "content-type: application/json",
                "Accept: application/json",
                "Authorization: Bearer {$user_token}"
            ];  
            $basic_campaign_data = $this->commonCurlGetRequest($curl_url,$a_header); 
            
            $dynamic_filter = "analytics&pivot=CREATIVE";
            if($ads_type == 'com.linkedin.ads.SponsoredUpdateLeadAds'){
                $dynamic_filter = "statistics&objectiveType=LEAD_GENERATION&pivots[0]=CREATIVE";
                $ads_type = 'all';
            }

            $curl_url   =  "https://api.linkedin.com/v2/adAnalyticsV2?q=$dynamic_filter$search_date_range&timeGranularity=ALL&accounts[0]=urn%3Ali%3AsponsoredAccount%3A$linkedin_campaign_group_id&fields=costInLocalCurrency,pivotValue,impressions,likes,clicks,externalWebsiteConversions,oneClickLeads,pivot&projection=(*,elements(*(*,pivotValue~(variables(data(*,com.linkedin.ads.FollowCompanyCreativeVariablesV2(*,organizationLogo~:playableStreams),com.linkedin.ads.JobsCreativeVariablesV2(*,logo~:playableStreams),com.linkedin.ads.SpotlightCreativeVariablesV2(*,logo~:playableStreams),com.linkedin.ads.TextAdCreativeVariables(*,vectorImage~:playableStreams),com.linkedin.ads.SponsoredInMailCreativeVariables(*,content(*)),com.linkedin.ads.SponsoredVideoCreativeVariables(*,mediaAsset~:playableStreams),com.linkedin.ads.SponsoredUpdateCarouselCreativeVariables(share~(subject,id,text(text),content(*,contentEntities(*(entityLocation,title,landingPageUrl,entity))))),com.linkedin.ads.SponsoredUpdateCreativeVariables(*,share~(subject,text(text,type),content(*,contentEntities(*(type,description,entityLocation,thumbnails,title,id)))))))))))"; 

            //$curl_url = "https://api.linkedin.com/v2/adAnalyticsV2?q=statistics$search_date_range&timeGranularity=ALL&accounts[0]=urn%3Ali%3AsponsoredAccount%3A$linkedin_campaign_group_id&pivots[0]=CREATIVE&objectiveType=LEAD_GENERATION&fields=costInLocalCurrency,pivotValue,impressions,likes,clicks,externalWebsiteConversions,oneClickLeads,pivot&projection=(*,elements(*(*,pivotValue~(variables(data(*,com.linkedin.ads.FollowCompanyCreativeVariablesV2(*,organizationLogo~:playableStreams),com.linkedin.ads.JobsCreativeVariablesV2(*,logo~:playableStreams),com.linkedin.ads.SpotlightCreativeVariablesV2(*,logo~:playableStreams),com.linkedin.ads.TextAdCreativeVariables(*,vectorImage~:playableStreams),com.linkedin.ads.SponsoredInMailCreativeVariables(*,content(*)),com.linkedin.ads.SponsoredVideoCreativeVariables(*,mediaAsset~:playableStreams),com.linkedin.ads.SponsoredUpdateCarouselCreativeVariables(share~(subject,id,text(text),content(*,contentEntities(*(entityLocation,title,landingPageUrl,entity))))),com.linkedin.ads.SponsoredUpdateCreativeVariables(*,share~(subject,text(text,type),content(*,contentEntities(*(type,description,entityLocation,thumbnails,title,id)))))))))))";
            
            //https://api.linkedin.com/v2/adCreativesV2?ids=List({$creative_id})&projection=(results(*(variables(*,data(*,com.linkedin.ads.SpotlightCreativeVariablesV2(*,share~(*)))))))
            
            $a_header = [
                "content-type: application/json",  
                "LinkedIn-Version:202210",
                //"X-Restli-Protocol-Version: 2.0.0",
                "Authorization: Bearer {$user_token}"
            ];  

            $anylatic_campaign_data = $this->commonCurlGetRequest($curl_url,$a_header); 
            // dd($anylatic_campaign_data);
            $count = 0; 
            $pv_value = "pivotValue~"; 
            $follow_ads_type_enum = "com.linkedin.ads.FollowCompanyCreativeVariablesV2";
            $job_ads_type_enum = "com.linkedin.ads.JobsCreativeVariablesV2";
            $text_ads_type_enum = "com.linkedin.ads.TextAdCreativeVariables";
            $spotlight_ads_type_enum = "com.linkedin.ads.SpotlightCreativeVariablesV2";
            $mail_ads_type_enum = "com.linkedin.ads.SponsoredInMailCreativeVariables";
            $video_ads_type_enum = "com.linkedin.ads.SponsoredVideoCreativeVariables";
            $carousel_ads_type_enum = "com.linkedin.ads.SponsoredUpdateCarouselCreativeVariables";
            $creative_ads_type_enum = "com.linkedin.ads.SponsoredUpdateCreativeVariables";
            
            $total_impression_follow_ads = 0;
            $total_clicks_follow_ads = 0;
            $total_leads_follow_ads = 0;
            $total_ctr_follow_ads = 0;
            $total_result_follow_ads = 0;
            $total_cost_per_follow_ads = 0;

            $total_impression_job_ads = 0;
            $total_clicks_job_ads = 0;
            $total_leads_job_ads = 0;
            $total_ctr_job_ads = 0;
            $total_result_job_ads = 0;
            $total_cost_per_job_ads = 0;

            $total_impression_text_ads = 0;
            $total_clicks_text_ads = 0;
            $total_leads_text_ads = 0;
            $total_ctr_text_ads = 0;
            $total_result_text_ads = 0;
            $total_cost_per_text_ads = 0;

            $total_impression_spotlight_ads = 0;
            $total_clicks_spotlight_ads = 0;
            $total_leads_spotlight_ads = 0;
            $total_ctr_spotlight_ads = 0;
            $total_result_spotlight_ads = 0;
            $total_cost_per_spotlight_ads = 0;

            $total_impression_mail_ads = 0;
            $total_clicks_mail_ads = 0;
            $total_leads_mail_ads = 0;
            $total_ctr_mail_ads = 0;
            $total_result_mail_ads = 0;
            $total_cost_per_mail_ads = 0;

            $total_impression_video_ads = 0;
            $total_clicks_video_ads = 0;
            $total_leads_video_ads = 0;
            $total_ctr_video_ads = 0;
            $total_result_video_ads = 0;
            $total_cost_per_video_ads = 0;

            $total_impression_carousel_ads = 0;
            $total_clicks_carousel_ads = 0;
            $total_leads_carousel_ads = 0;
            $total_ctr_carousel_ads = 0;
            $total_result_carousel_ads = 0;
            $total_cost_per_carousel_ads = 0;

            $total_impression_creative_ads = 0;
            $total_clicks_creative_ads = 0;
            $total_leads_creative_ads = 0;
            $total_ctr_creative_ads = 0; 
            $total_result_creative_ads = 0;
            $total_cost_per_creative_ads = 0;

            $total_follow_ads_count = 0;
            $total_job_ads_count = 0;
            $total_text_ads_count = 0;
            $total_spotlight_ads_count = 0;
            $total_mail_ads_count = 0;
            $total_video_ads_count = 0;
            $total_carousel_ads_count = 0;
            $total_creative_ads_count = 0;
            //$total_result_follow_ads = 0;
            //$total_cost_per_follow_ads = 0;
            $total_costperresult_follow_adsNA=0;

            //echo "<pre>";
            $share_enum = 'share~';
            $ads_name = 'NA';
            $landing_page_base_url = "NA";

            //dd($anylatic_campaign_data->elements);
            //echo "<pre>";
            $count = 0;
            $ads_type_total = [];
            foreach($anylatic_campaign_data->elements as $kk=>$vv){  
                //dd($vv->$pv_value->variables->data->$ads_type);
               //print_r($vv);
                if($ads_type != 'all'){
                    if(!isset($vv->$pv_value->variables->data->$ads_type)){ 
                        continue;
                    }
                }

                $ads_name = 'NA';
                $landing_page_base_url = "NA"; 

                $impression = $vv->impressions;
                $clicks = $vv->clicks;
                $leads = $vv->costInLocalCurrency;
                $ctr = ($impression)?($clicks/$impression)*100:0; 

                if(isset($vv->$pv_value->variables->data->$follow_ads_type_enum)){ 
                    
                    $total_follow_ads_count++;
                    if(isset($vv->$pv_value->variables->data->$follow_ads_type_enum->$share_enum->subject)){
                        $ads_name = $vv->$pv_value->variables->data->$follow_ads_type_enum->$share_enum->subject;
                        //$landing_page_base_url = explode('?',$vv->$pv_value->variables->data->$follow_ads_type_enum->$share_enum->content->contentEntities[0]->entityLocation)[0];
                    } 
                
                    if(!isset(${"total_impression_follow_ads" . $ads_name})){
                        ${"total_impression_follow_ads" . $ads_name} = 0;
                    } 
                    if(!isset(${"total_clicks_follow_ads" . $ads_name})){
                        ${"total_clicks_follow_ads" . $ads_name} = 0;
                    } 
                    if(!isset(${"total_leads_follow_ads" . $ads_name})){
                        ${"total_leads_follow_ads" . $ads_name} = 0;
                    } 
                    if(!isset(${"total_ctr_follow_ads" . $ads_name})){
                        ${"total_ctr_follow_ads" . $ads_name} = 0;
                    } 
                    if(!isset(${"total_result_follow_ads" . $ads_name})){
                        ${"total_result_follow_ads" . $ads_name} = 0;
                    } 
                    if(!isset(${"total_cost_per_follow_ads" . $ads_name})){
                        ${"total_cost_per_follow_ads" . $ads_name} = 0;
                    } 

                    ${"impression" . $ads_name} = $vv->impressions;
                    ${"clicks" . $ads_name} = $vv->clicks;
                    ${"leads" . $ads_name} = $vv->costInLocalCurrency;
                    ${"ctr" . $ads_name} = (${"impression" . $ads_name})?(${"clicks" . $ads_name}/${"impression" . $ads_name})*100:0;
                    ${"result" . $ads_name} = $vv->oneClickLeads;
                    ${"costperresult" . $ads_name} = (!empty($vv->oneClickLeads))?$vv->costInLocalCurrency/$vv->oneClickLeads:0;
                      
                    ${"total_impression_follow_ads" . $ads_name} += ${"impression" . $ads_name};
                    ${"total_clicks_follow_ads" . $ads_name} += ${"clicks" . $ads_name}; 
                    ${"total_leads_follow_ads" . $ads_name} += ${"leads" . $ads_name};
                    ${"total_ctr_follow_ads" . $ads_name} += ${"ctr" . $ads_name};  
                    ${"total_result_follow_ads" . $ads_name} += ${"result" . $ads_name}; 
                
                    //dd('ads-name',$ads_name);
                    ${"total_costperresult_follow_ads" . $ads_name} += ${"costperresult" . $ads_name}; 
                    //dd('ads-name',${"total_costperresult_follow_ads" . $ads_name});

                    $ads_type_total[$ads_name] = [
                        "impression" => ${"total_impression_follow_ads" . $ads_name},
                        "clicks" => ${"total_clicks_follow_ads" . $ads_name},
                        "spend" => round(${"total_leads_follow_ads" . $ads_name},2),
                        "ctr" => round(${"total_ctr_follow_ads" . $ads_name},2),
                        "ads_type" => "follow_ads",
                        "loop_count" => $total_follow_ads_count,
                        "result" => round(${"total_result_follow_ads" . $ads_name},2),
                        "per_click_result" => round(${"total_costperresult_follow_ads" . $ads_name},2)
                    ];   

                }elseif(isset($vv->$pv_value->variables->data->$job_ads_type_enum)){
                    $total_job_ads_count++;  
                    if(isset($vv->$pv_value->variables->data->$job_ads_type_enum->$share_enum->subject)){
                        $ads_name = $vv->$pv_value->variables->data->$job_ads_type_enum->$share_enum->subject;
                        //$landing_page_base_url = explode('?',$vv->$pv_value->variables->data->$job_ads_type_enum->$share_enum->content->contentEntities[0]->entityLocation)[0];
                    }

                    if(!isset(${"total_impression_job_ads" . $ads_name})){
                        ${"total_impression_job_ads" . $ads_name} = 0;
                    } 
                    if(!isset(${"total_clicks_job_ads" . $ads_name})){
                        ${"total_clicks_job_ads" . $ads_name} = 0;
                    } 
                    if(!isset(${"total_leads_job_ads" . $ads_name})){
                        ${"total_leads_job_ads" . $ads_name} = 0;
                    } 
                    if(!isset(${"total_ctr_job_ads" . $ads_name})){
                        ${"total_ctr_job_ads" . $ads_name} = 0;
                    } 
                    if(!isset(${"total_result_job_ads" . $ads_name})){
                        ${"total_result_job_ads" . $ads_name} = 0;
                    } 
                    if(!isset(${"total_cost_per_job_ads" . $ads_name})){
                        ${"total_cost_per_job_ads" . $ads_name} = 0;
                    } 
                    
                    ${"impression" . $ads_name} = $vv->impressions;
                    ${"clicks" . $ads_name} = $vv->clicks;
                    ${"leads" . $ads_name} = $vv->costInLocalCurrency;
                    ${"ctr" . $ads_name} = (${"impression" . $ads_name})?(${"clicks" . $ads_name}/${"impression" . $ads_name})*100:0;
                    ${"result" . $ads_name} = $vv->oneClickLeads;
                    ${"costperresult" . $ads_name} = (!empty($vv->oneClickLeads))?$vv->costInLocalCurrency/$vv->oneClickLeads:0;
                    
                      
                    ${"total_impression_job_ads" . $ads_name} += ${"impression" . $ads_name};
                    ${"total_clicks_job_ads" . $ads_name} += ${"clicks" . $ads_name}; 
                    ${"total_leads_job_ads" . $ads_name} += ${"leads" . $ads_name};
                    ${"total_ctr_job_ads" . $ads_name} += ${"ctr" . $ads_name}; 
                    ${"total_result_job_ads" . $ads_name} += ${"result" . $ads_name};  
                    ${"total_cost_per_job_ads" . $ads_name} += ${"costperresult" . $ads_name};

                    $ads_type_total[$ads_name] = [
                        "impression" => ${"total_impression_job_ads" . $ads_name},
                        "clicks" => ${"total_clicks_job_ads" . $ads_name},
                        "spend" => round(${"total_leads_job_ads" . $ads_name},2),
                        "ctr" => round(${"total_ctr_job_ads" . $ads_name},2),
                        "ads_type" => "job_ads",
                        "loop_count" => $total_job_ads_count,
                        "result" => round(${"total_result_job_ads" . $ads_name},2),
                        "per_click_result" => round(${"total_cost_per_job_ads" . $ads_name},2)
                    ];  
                }elseif(isset($vv->$pv_value->variables->data->$text_ads_type_enum)){ 
                    $total_text_ads_count++;
                    if(isset($vv->$pv_value->variables->data->$text_ads_type_enum->$share_enum->subject)){
                        $ads_name = $vv->$pv_value->variables->data->$text_ads_type_enum->$share_enum->subject;
                        //$landing_page_base_url = explode('?',$vv->$pv_value->variables->data->$text_ads_type_enum->$share_enum->content->contentEntities[0]->entityLocation)[0];
                    }

                    if(!isset(${"total_impression_text_ads" . $ads_name})){
                        ${"total_impression_text_ads" . $ads_name} = 0;
                    } 
                    if(!isset(${"total_clicks_text_ads" . $ads_name})){
                        ${"total_clicks_text_ads" . $ads_name} = 0;
                    } 
                    if(!isset(${"total_leads_text_ads" . $ads_name})){
                        ${"total_leads_text_ads" . $ads_name} = 0;
                    } 
                    if(!isset(${"total_ctr_text_ads" . $ads_name})){
                        ${"total_ctr_text_ads" . $ads_name} = 0;
                    } 
                    if(!isset(${"total_result_text_ads" . $ads_name})){
                        ${"total_result_text_ads" . $ads_name} = 0;
                    } 
                    if(!isset(${"total_cost_per_text_ads" . $ads_name})){
                        ${"total_cost_per_text_ads" . $ads_name} = 0;
                    } 

                    ${"impression" . $ads_name} = $vv->impressions;
                    ${"clicks" . $ads_name} = $vv->clicks;
                    ${"leads" . $ads_name} = $vv->costInLocalCurrency;
                    ${"ctr" . $ads_name} = (${"impression" . $ads_name})?(${"clicks" . $ads_name}/${"impression" . $ads_name})*100:0;
                    ${"result" . $ads_name} = $vv->oneClickLeads;
                    ${"costperresult" . $ads_name} = (!empty($vv->oneClickLeads))?$vv->costInLocalCurrency/$vv->oneClickLeads:0;

                      
                    ${"total_impression_text_ads" . $ads_name} += ${"impression" . $ads_name};
                    ${"total_clicks_text_ads" . $ads_name} += ${"clicks" . $ads_name}; 
                    ${"total_leads_text_ads" . $ads_name} += ${"leads" . $ads_name};
                    ${"total_ctr_text_ads" . $ads_name} += ${"ctr" . $ads_name};  
                    ${"total_result_text_ads" . $ads_name} += ${"result" . $ads_name};  
                    ${"total_cost_per_text_ads" . $ads_name} += ${"costperresult" . $ads_name};

                    $ads_type_total[$ads_name] = [
                        "impression" => ${"total_impression_text_ads" . $ads_name},
                        "clicks" => ${"total_clicks_text_ads" . $ads_name},
                        "spend" => round(${"total_leads_text_ads" . $ads_name},2),
                        "ctr" => round(${"total_ctr_text_ads" . $ads_name},2),
                        "ads_type" => "text_ads",
                        "loop_count" => $total_text_ads_count,
                        "result" => round(${"total_result_text_ads" . $ads_name},2),
                        "per_click_result" => round(${"total_cost_per_text_ads" . $ads_name},2)
                    ];  
                }elseif(isset($vv->$pv_value->variables->data->$spotlight_ads_type_enum)){ 
                    //dd($vv);
                    $total_spotlight_ads_count++;
                    if(isset($vv->$pv_value->variables->data->$spotlight_ads_type_enum->forumName)){
                        $ads_name = $vv->$pv_value->variables->data->$spotlight_ads_type_enum->forumName;
                        //$landing_page_base_url = explode('?',$vv->$pv_value->variables->data->$spotlight_ads_type_enum->$share_enum->content->contentEntities[0]->entityLocation)[0];
                    }

                    if(!isset(${"total_impression_spotlight_ads" . $ads_name})){
                        ${"total_impression_spotlight_ads" . $ads_name} = 0;
                    } 
                    if(!isset(${"total_clicks_spotlight_ads" . $ads_name})){
                        ${"total_clicks_spotlight_ads" . $ads_name} = 0;
                    } 
                    if(!isset(${"total_leads_spotlight_ads" . $ads_name})){
                        ${"total_leads_spotlight_ads" . $ads_name} = 0;
                    } 
                    if(!isset(${"total_ctr_spotlight_ads" . $ads_name})){
                        ${"total_ctr_spotlight_ads" . $ads_name} = 0;
                    } 
                    if(!isset(${"total_result_spotlight_ads" . $ads_name})){
                        ${"total_result_spotlight_ads" . $ads_name} = 0;
                    } 
                    if(!isset(${"total_cost_per_spotlight_ads" . $ads_name})){
                        ${"total_cost_per_spotlight_ads" . $ads_name} = 0;
                    } 

                    ${"impression" . $ads_name} = $vv->impressions;
                    ${"clicks" . $ads_name} = $vv->clicks;
                    ${"leads" . $ads_name} = $vv->costInLocalCurrency;
                    ${"ctr" . $ads_name} = (${"impression" . $ads_name})?(${"clicks" . $ads_name}/${"impression" . $ads_name})*100:0;
                    ${"result" . $ads_name} = $vv->oneClickLeads;
                    ${"costperresult" . $ads_name} = (!empty($vv->oneClickLeads))?$vv->costInLocalCurrency/$vv->oneClickLeads:0;

                      
                    ${"total_impression_spotlight_ads" . $ads_name} += ${"impression" . $ads_name};
                    ${"total_clicks_spotlight_ads" . $ads_name} += ${"clicks" . $ads_name}; 
                    ${"total_leads_spotlight_ads" . $ads_name} += ${"leads" . $ads_name};
                    ${"total_ctr_spotlight_ads" . $ads_name} += ${"ctr" . $ads_name}; 
                    ${"total_result_spotlight_ads" . $ads_name} += ${"result" . $ads_name};  
                    ${"total_cost_per_spotlight_ads" . $ads_name} += ${"costperresult" . $ads_name};

                    $ads_type_total[$ads_name] = [
                        "impression" => ${"total_impression_spotlight_ads" . $ads_name},
                        "clicks" => ${"total_clicks_spotlight_ads" . $ads_name},
                        "spend" => round(${"total_leads_spotlight_ads" . $ads_name},2),
                        "ctr" => round(${"total_ctr_spotlight_ads" . $ads_name},2),
                        "ads_type" => "spotlight_ads",
                        "loop_count" => $total_spotlight_ads_count,
                        "result" => round(${"total_result_spotlight_ads" . $ads_name},2),
                        "per_click_result" => round(${"total_cost_per_spotlight_ads" . $ads_name},2)
                    ]; 
  
                }elseif(isset($vv->$pv_value->variables->data->$mail_ads_type_enum)){ 
                    //print_r($vv);
                    $total_mail_ads_count++; 
                    if(isset($vv->$pv_value->variables->data->$mail_ads_type_enum->$share_enum->subject)){
                        $ads_name = $vv->$pv_value->variables->data->$mail_ads_type_enum->$share_enum->subject;
                        //$landing_page_base_url = explode('?',$vv->$pv_value->variables->data->$mail_ads_type_enum->$share_enum->content->contentEntities[0]->entityLocation)[0];
                    }

                    if(!isset(${"total_impression_mail_ads" . $ads_name})){
                        ${"total_impression_mail_ads" . $ads_name} = 0;
                    } 
                    if(!isset(${"total_clicks_mail_ads" . $ads_name})){
                        ${"total_clicks_mail_ads" . $ads_name} = 0;
                    } 
                    if(!isset(${"total_leads_mail_ads" . $ads_name})){
                        ${"total_leads_mail_ads" . $ads_name} = 0;
                    } 
                    if(!isset(${"total_ctr_mail_ads" . $ads_name})){
                        ${"total_ctr_mail_ads" . $ads_name} = 0;
                    } 
                    if(!isset(${"total_result_mail_ads" . $ads_name})){
                        ${"total_result_mail_ads" . $ads_name} = 0;
                    } 
                    if(!isset(${"total_cost_per_mail_ads" . $ads_name})){
                        ${"total_cost_per_mail_ads" . $ads_name} = 0;
                    } 

                    ${"impression" . $ads_name} = $vv->impressions;
                    ${"clicks" . $ads_name} = $vv->clicks;
                    ${"leads" . $ads_name} = $vv->costInLocalCurrency;
                    ${"ctr" . $ads_name} = (${"impression" . $ads_name})?(${"clicks" . $ads_name}/${"impression" . $ads_name})*100:0;
                    ${"result" . $ads_name} = $vv->oneClickLeads;
                    ${"costperresult" . $ads_name} = (!empty($vv->oneClickLeads))?$vv->costInLocalCurrency/$vv->oneClickLeads:0;

                      
                    ${"total_impression_mail_ads" . $ads_name} += ${"impression" . $ads_name};
                    ${"total_clicks_mail_ads" . $ads_name} += ${"clicks" . $ads_name}; 
                    ${"total_leads_mail_ads" . $ads_name} += ${"leads" . $ads_name};
                    ${"total_ctr_mail_ads" . $ads_name} += ${"ctr" . $ads_name};   
                    ${"total_result_mail_ads" . $ads_name} += ${"result" . $ads_name};  
                    ${"total_cost_per_mail_ads" . $ads_name} += ${"costperresult" . $ads_name};

                    $ads_type_total[$ads_name] = [
                        "impression" => ${"total_impression_mail_ads" . $ads_name},
                        "clicks" => ${"total_clicks_mail_ads" . $ads_name},
                        "spend" => round(${"total_leads_mail_ads" . $ads_name},2),
                        "ctr" => round(${"total_ctr_mail_ads" . $ads_name},2),
                        "ads_type" => "mail_ads",
                        "loop_count" => $total_mail_ads_count,
                        "result" => round(${"total_result_mail_ads" . $ads_name},2),
                        "per_click_result" => round(${"total_cost_per_mail_ads" . $ads_name},2)
                    ]; 
 
                }elseif(isset($vv->$pv_value->variables->data->$video_ads_type_enum)){ 
                    $total_video_ads_count++;
                    if(isset($vv->$pv_value->variables->data->$video_ads_type_enum->$share_enum->subject)){
                        $ads_name = $vv->$pv_value->variables->data->$video_ads_type_enum->$share_enum->subject;
                       // $landing_page_base_url = explode('?',$vv->$pv_value->variables->data->$video_ads_type_enum->$share_enum->content->contentEntities[0]->entityLocation)[0];
                    }

                    if(!isset(${"total_impression_video_ads" . $ads_name})){
                        ${"total_impression_video_ads" . $ads_name} = 0;
                    } 
                    if(!isset(${"total_clicks_video_ads" . $ads_name})){
                        ${"total_clicks_video_ads" . $ads_name} = 0;
                    } 
                    if(!isset(${"total_leads_video_ads" . $ads_name})){
                        ${"total_leads_video_ads" . $ads_name} = 0;
                    } 
                    if(!isset(${"total_ctr_video_ads" . $ads_name})){
                        ${"total_ctr_video_ads" . $ads_name} = 0;
                    } 
                    if(!isset(${"total_result_video_ads" . $ads_name})){
                        ${"total_result_video_ads" . $ads_name} = 0;
                    } 
                    if(!isset(${"total_cost_per_video_ads" . $ads_name})){
                        ${"total_cost_per_video_ads" . $ads_name} = 0;
                    } 

                    ${"impression" . $ads_name} = $vv->impressions;
                    ${"clicks" . $ads_name} = $vv->clicks;
                    ${"leads" . $ads_name} = $vv->costInLocalCurrency;
                    ${"ctr" . $ads_name} = (${"impression" . $ads_name})?(${"clicks" . $ads_name}/${"impression" . $ads_name})*100:0;
                    ${"result" . $ads_name} = $vv->oneClickLeads;
                    ${"costperresult" . $ads_name} = (!empty($vv->oneClickLeads))?$vv->costInLocalCurrency/$vv->oneClickLeads:0;

                      
                    ${"total_impression_video_ads" . $ads_name} += ${"impression" . $ads_name};
                    ${"total_clicks_video_ads" . $ads_name} += ${"clicks" . $ads_name}; 
                    ${"total_leads_video_ads" . $ads_name} += ${"leads" . $ads_name};
                    ${"total_ctr_video_ads" . $ads_name} += ${"ctr" . $ads_name};   
                    ${"total_result_video_ads" . $ads_name} += ${"result" . $ads_name};  
                    ${"total_cost_per_video_ads" . $ads_name} += ${"costperresult" . $ads_name};

                    $ads_type_total[$ads_name] = [
                        "impression" => ${"total_impression_video_ads" . $ads_name},
                        "clicks" => ${"total_clicks_video_ads" . $ads_name},
                        "spend" => round(${"total_leads_video_ads" . $ads_name},2),
                        "ctr" => round(${"total_ctr_video_ads" . $ads_name},2),
                        "ads_type" => "video_ads",
                        "loop_count" => $total_video_ads_count,
                        "result" => round(${"total_result_video_ads" . $ads_name},2),
                        "per_click_result" => round(${"total_cost_per_video_ads" . $ads_name},2)
                    ]; 

                }elseif(isset($vv->$pv_value->variables->data->$carousel_ads_type_enum)){
                    $total_carousel_ads_count++;
                    if(isset($vv->$pv_value->variables->data->$carousel_ads_type_enum->$share_enum->subject)){ 
                        $ads_name = $vv->$pv_value->variables->data->$carousel_ads_type_enum->$share_enum->subject;
                        //$landing_page_base_url = explode('?',$vv->$pv_value->variables->data->$carousel_ads_type_enum->$share_enum->content->contentEntities[0]->entityLocation)[0];
                    }

                    if(!isset(${"total_impression_carousel_ads" . $ads_name})){
                        ${"total_impression_carousel_ads" . $ads_name} = 0;
                    } 
                    if(!isset(${"total_clicks_carousel_ads" . $ads_name})){
                        ${"total_clicks_carousel_ads" . $ads_name} = 0;
                    } 
                    if(!isset(${"total_leads_carousel_ads" . $ads_name})){
                        ${"total_leads_carousel_ads" . $ads_name} = 0;
                    } 
                    if(!isset(${"total_ctr_carousel_ads" . $ads_name})){
                        ${"total_ctr_carousel_ads" . $ads_name} = 0;
                    } 
                    if(!isset(${"total_result_carousel_ads" . $ads_name})){
                        ${"total_result_carousel_ads" . $ads_name} = 0;
                    } 
                    if(!isset(${"total_cost_per_carousel_ads" . $ads_name})){
                        ${"total_cost_per_carousel_ads" . $ads_name} = 0;
                    } 

                    ${"impression" . $ads_name} = $vv->impressions;
                    ${"clicks" . $ads_name} = $vv->clicks;
                    ${"leads" . $ads_name} = $vv->costInLocalCurrency;
                    ${"ctr" . $ads_name} = (${"impression" . $ads_name})?(${"clicks" . $ads_name}/${"impression" . $ads_name})*100:0;
                    ${"result" . $ads_name} = $vv->oneClickLeads;
                    ${"costperresult" . $ads_name} = (!empty($vv->oneClickLeads))?$vv->costInLocalCurrency/$vv->oneClickLeads:0;

                    ${"total_impression_carousel_ads" . $ads_name} += ${"impression" . $ads_name};
                    ${"total_clicks_carousel_ads" . $ads_name} += ${"clicks" . $ads_name}; 
                    ${"total_leads_carousel_ads" . $ads_name} += ${"leads" . $ads_name};
                    ${"total_ctr_carousel_ads" . $ads_name} += ${"ctr" . $ads_name};
                    ${"total_result_carousel_ads" . $ads_name} += ${"result" . $ads_name};  
                    ${"total_cost_per_carousel_ads" . $ads_name} += ${"costperresult" . $ads_name};

                    $ads_type_total[$ads_name] = [
                        "impression" => ${"total_impression_carousel_ads" . $ads_name},
                        "clicks" => ${"total_clicks_carousel_ads" . $ads_name},
                        "spend" => round(${"total_leads_carousel_ads" . $ads_name},2),
                        "ctr" => round(${"total_ctr_carousel_ads" . $ads_name},2),
                        "ads_type" => "carousel_ads",
                        "loop_count" => $total_carousel_ads_count,
                        "result" => round(${"total_result_carousel_ads" . $ads_name},2),
                        "per_click_result" => round(${"total_cost_per_carousel_ads" . $ads_name},2)
                    ];  
                }elseif(isset($vv->$pv_value->variables->data->$creative_ads_type_enum)){ //dd(1);
                    $total_creative_ads_count++; 
                    if(isset($vv->$pv_value->variables->data->$creative_ads_type_enum->$share_enum->subject)){
                        $ads_name = $vv->$pv_value->variables->data->$creative_ads_type_enum->$share_enum->subject;
                        //$landing_page_base_url = explode('?',$vv->$pv_value->variables->data->$creative_ads_type_enum->$share_enum->content->contentEntities[0]->entityLocation)[0];
                    }

                    if(!isset(${"total_impression_creative_ads" . $ads_name})){
                        ${"total_impression_creative_ads" . $ads_name} = 0;
                    } 
                    if(!isset(${"total_clicks_creative_ads" . $ads_name})){
                        ${"total_clicks_creative_ads" . $ads_name} = 0;
                    } 
                    if(!isset(${"total_leads_creative_ads" . $ads_name})){
                        ${"total_leads_creative_ads" . $ads_name} = 0;
                    } 
                    if(!isset(${"total_ctr_creative_ads" . $ads_name})){
                        ${"total_ctr_creative_ads" . $ads_name} = 0;
                    } 
                    if(!isset(${"total_result_creative_ads" . $ads_name})){
                        ${"total_result_creative_ads" . $ads_name} = 0;
                    } 
                    if(!isset(${"total_cost_per_creative_ads" . $ads_name})){
                        ${"total_cost_per_creative_ads" . $ads_name} = 0;
                    } 

                    ${"impression" . $ads_name} = $vv->impressions;
                    ${"clicks" . $ads_name} = $vv->clicks;
                    ${"leads" . $ads_name} = $vv->costInLocalCurrency;
                    ${"ctr" . $ads_name} = (${"impression" . $ads_name})?(${"clicks" . $ads_name}/${"impression" . $ads_name})*100:0;
                    ${"result" . $ads_name} = $vv->oneClickLeads;
                    ${"costperresult" . $ads_name} = (!empty($vv->oneClickLeads))?$vv->costInLocalCurrency/$vv->oneClickLeads:0;

                    ${"total_impression_creative_ads" . $ads_name} += ${"impression" . $ads_name};
                    ${"total_clicks_creative_ads" . $ads_name} += ${"clicks" . $ads_name}; 
                    ${"total_leads_creative_ads" . $ads_name} += ${"leads" . $ads_name};
                    ${"total_ctr_creative_ads" . $ads_name} += ${"ctr" . $ads_name}; 
                    ${"total_result_creative_ads" . $ads_name} += ${"result" . $ads_name};  
                    ${"total_cost_per_creative_ads" . $ads_name} += ${"costperresult" . $ads_name}; 

                    $ads_type_total[$ads_name] = [
                        "impression" => ${"total_impression_creative_ads" . $ads_name},
                        "clicks" => ${"total_clicks_creative_ads" . $ads_name},
                        "spend" => round(${"total_leads_creative_ads" . $ads_name},2),
                        "ctr" => round(${"total_ctr_creative_ads" . $ads_name},2),
                        "ads_type" => "creative_ads",
                        "loop_count" => $total_creative_ads_count,
                        "result" => round(${"total_result_creative_ads" . $ads_name},2),
                        "per_click_result" => round(${"total_cost_per_creative_ads" . $ads_name},2)
                    ];  
                }    
            } 
            //dd($ads_type_total);
            //dd(1);
            function array_sort_by_column(&$arr, $col, $dir = SORT_DESC) {
                $sort_col = array(); 
                    foreach ($arr as $key => $row) {
                        if($key>10){ continue; }
                        $sort_col[$key] = $row[$col];
                    }  
                    array_multisort($sort_col, $dir, $arr); 
            } 
            if(!empty($ads_type_total)){
                array_sort_by_column($ads_type_total, 'ctr');
            }
 
            return $ads_type_total; 
    }

    public function accountSpendData($a_linkedin_campaign_group_id){  
        //try{ 
            $linkedin_campaign_group_id = explode('-',$a_linkedin_campaign_group_id)[0];
            $encrypt_user_id = explode('-',$a_linkedin_campaign_group_id)[1];
            $search_data = explode('-',$a_linkedin_campaign_group_id)[2];
            $status_data = explode('-',$a_linkedin_campaign_group_id)[3]; 
            $pagination_range = '';
            $status_filter = '';

            $current_year = date('Y');
            $current_month = date('m');
            $current_date = date('d');
            $previous_date = date('Y-m-d', strtotime('-29 days'));
            $a_previous_date = explode('-',$previous_date);
            $previous_year = $a_previous_date[0];
            $previous_month = $a_previous_date[1];
            $previous_date = $a_previous_date[2];
            
            $search_date_range = "&dateRange.start.year=$previous_year&dateRange.start.month=$previous_month&dateRange.start.day=$previous_date&dateRange.end.year=$current_year&dateRange.end.month=$current_month&dateRange.end.day=$current_date"; 

            if(!empty($search_data)){
                $search_date_range = $this->searchByDateRange($search_data);
            } 
            if(!empty($status_data)){
                $status_filter = "&search.status.values[0]=$status_data";
            } 
            $user_id = Crypt::decryptString($encrypt_user_id);
            $user_data = DB::table('user')->select('user_token','user_refresh_token')->where('id',$user_id)->first();
            $user_token = $user_data->user_token;
            $user_refresh_token = $user_data->user_refresh_token; 

            
            $curl_url   =  "https://api.linkedin.com/v2/adAnalyticsV2?q=analytics$search_date_range&timeGranularity=DAILY&accounts[0]=urn%3Ali%3AsponsoredAccount%3A$linkedin_campaign_group_id&pivot=CREATIVE&fields=dateRange,costInLocalCurrency"; 
              
            $a_header = [
                "content-type: application/json",  
                "LinkedIn-Version:202210",
                //"X-Restli-Protocol-Version: 2.0.0",
                "Authorization: Bearer {$user_token}"
            ];  

            $anylatic_campaign_data = $this->commonCurlGetRequest($curl_url,$a_header); 

            $count = 0; 
            $daily_spend = [];
            foreach($anylatic_campaign_data->elements as $kk=>$vv){   
                $spend_date = $anylatic_campaign_data->elements[$kk]->dateRange->start->year.'-'.$anylatic_campaign_data->elements[$kk]->dateRange->start->month.'-'.$anylatic_campaign_data->elements[$kk]->dateRange->start->day;
 
                $update_spend_date = date_format(date_create($spend_date),"Y-m-d"); 
                $day_spend = round($anylatic_campaign_data->elements[$kk]->costInLocalCurrency,2); 
                if(isset($daily_spend[$update_spend_date])){ 
                    $update_spend = $daily_spend[$update_spend_date]+$day_spend;
                    $daily_spend[$update_spend_date] = $update_spend;
                }else{ 
                    $daily_spend[$update_spend_date] = $day_spend;
                }  
            } 
            ksort($daily_spend);
            return $daily_spend;
            // function array_sort_by_column(&$arr, $col, $dir = SORT_DESC) {
            //     $sort_col = array(); 
            //     foreach ($arr as $key => $row) {
            //         if($key>5){ continue; }
            //         $sort_col[$key] = $row[$col];
            //     } 
            //     array_multisort($sort_col, $dir, $arr);
            // }
            
            // array_sort_by_column($ads_type_total, 'ctr');
 
            return $ads_type_total; 
    }

    public function randomPassword() {
        $alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
        $pass = array(); //remember to declare $pass as an array
        $alphaLength = strlen($alphabet) - 1; //put the length -1 in cache
        for ($i = 0; $i < 8; $i++) {
            $n = rand(0, $alphaLength);
            $pass[] = $alphabet[$n];
        }
        return implode($pass); //turn the array into a string
    }

    public function getUserDetail($accessBearerToken='', $refresh_token = '', $encrypt_user_id='',$token_expire_time,$isVisabili){
        //try{
            $user_id = 0;
            $account_id = 0; 
            if(!empty($encrypt_user_id)){
                $user_id = Crypt::decryptString($encrypt_user_id);
            }
            // Get the email address
            $email_curl = curl_init();  
            curl_setopt_array($email_curl, array(
            // CURLOPT_URL => 'https://api.linkedin.com/v2/me',
                CURLOPT_URL => "https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))",
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_ENCODING => "",
                CURLOPT_MAXREDIRS => 10,
                CURLOPT_FOLLOWLOCATION => true,
                CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                CURLOPT_TIMEOUT => 300,
                CURLOPT_CUSTOMREQUEST => "GET",
                CURLOPT_HTTPHEADER => array("content-type: application/x-www-form-urlencoded",
            "Authorization: Bearer {$accessBearerToken}"),
            ));
            $email_response = json_decode(curl_exec($email_curl));
            $handle = 'handle~';
            $email_address = $email_response->elements[0]->$handle->emailAddress;
            $random_password = $this->randomPassword();

            // Get the user name 
            $profile_curl = curl_init();  
            curl_setopt_array($profile_curl, array(
                CURLOPT_URL => 'https://api.linkedin.com/v2/me',
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_ENCODING => "",
                CURLOPT_MAXREDIRS => 10,
                CURLOPT_FOLLOWLOCATION => true,
                CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                CURLOPT_TIMEOUT => 300,
                CURLOPT_CUSTOMREQUEST => "GET",
                CURLOPT_HTTPHEADER => array("content-type: application/x-www-form-urlencoded",
            "Authorization: Bearer {$accessBearerToken}"),
            ));
            $profile_response = json_decode(curl_exec($profile_curl));
            //return $profile_response;
            $first_name = $profile_response->firstName->localized->en_US??'';
            $last_name = $profile_response->lastName->localized->en_US??'';
            
            $is_user_exist = DB::table('user')->where('user_email',$email_address)->orWhere('id', $user_id)->first();
        //dd($is_user_exist);
            if(empty($is_user_exist->id)){ 
                $is_user_created = User::create([
                    'added_by' => 0,
                    'first_name' => $first_name,
                    'last_name' => $last_name,
                    'user_email' => $email_address,
                    'user_password' => md5($random_password),
                    'login_level' => 2, 
                    'user_token' => $accessBearerToken,
                    'user_refresh_token' => $refresh_token,
                    'token_time_out'   => $token_expire_time,
                    'isVisabiliUser' => $isVisabili,
                    'is_active' => 1
                ]); 
                $linkedin_user_id = $is_user_created->id;
                $ecrypt_user_id = Crypt::encryptString($is_user_created->id); 
            }else{ 
                //validation for one account access
                if($email_address != $is_user_exist->user_email){
                    return [
                        'msg' => 'You have not permission to access another account.',
                        'status' => 'error'
                    ];
                }
                if(empty($user_id)){ 
                    User::where('user_email',$email_address)->update([
                        'added_by' => 0,
                        'first_name' => $first_name,
                        'last_name' => $last_name,
                        'user_email' => $email_address, 
                        'login_level' => 2,
                        'user_token' => $accessBearerToken,
                        'user_refresh_token' => $refresh_token,
                        'token_time_out'   => $token_expire_time,
                    ]); 
                    $linkedin_user_id = $is_user_exist->id;
                    $ecrypt_user_id = Crypt::encryptString($is_user_exist->id);
                }else{
                    User::where('id',$user_id)->update([
                        'user_token' => $accessBearerToken,
                        'user_refresh_token' => $refresh_token
                    ]); 
                    $first_name = $is_user_exist->first_name;
                    $last_name = $is_user_exist->last_name;
                    $linkedin_user_id = $user_id;
                    $ecrypt_user_id = Crypt::encryptString($user_id);
                }
            
            }

            $ads_account_curl = curl_init();  
            curl_setopt_array($ads_account_curl, array(
                CURLOPT_URL => 'https://api.linkedin.com/v2/adAccountsV2?q=search',
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_ENCODING => "",
                CURLOPT_MAXREDIRS => 10,
                CURLOPT_FOLLOWLOCATION => true,
                CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                CURLOPT_TIMEOUT => 300,
                CURLOPT_CUSTOMREQUEST => "GET",
                CURLOPT_HTTPHEADER => array("content-type: application/x-www-form-urlencoded",
            "Authorization: Bearer {$accessBearerToken}"),
            ));
            $account_list_response = json_decode(curl_exec($ads_account_curl));
            // echo "<pre>";
            //dd($account_list_response->elements);

            if(!empty($account_list_response->elements)){
                $user_account_data = $account_list_response->elements;
                $a_account_id = [];
                $a_fetch_account_id = [];
                foreach($user_account_data as $account_data){
                    $account_name = $account_data->name;
                    $account_id = $account_data->id; 
                    $a_fetch_account_id[] = $account_data->id;

                    $is_account_exist = DB::table('user_account_detail')->where([
                        'account_id' => $account_id,
                        'user_id' => $linkedin_user_id
                    ])->first(); 

                    if(!empty($is_account_exist->id)){
                        DB::table('user_account_detail')->where('id',$is_account_exist->id)->update([ 
                            'account_name'=>$account_name
                        ]);  
                        if(!empty($is_account_exist->is_active) && empty($is_account_exist->is_delete)){
                            $a_account_id[] = $account_id;
                        }
                    }else{  
                        DB::table('user_account_detail')->insert([
                            'user_id'=>$linkedin_user_id,
                            'account_name'=>$account_name,
                            'account_id'=>$account_id,
                            'is_active'=>1
                        ]);
                        $a_account_id[] = $account_id;
                    }
                }
                if(!empty($a_fetch_account_id)){ 
                    $deleted_account_id = DB::table('user_account_detail')->where('user_id',$linkedin_user_id)->whereNotIn('account_id',$a_fetch_account_id)->delete(); 
                }
                if(!empty($a_account_id)){
                    $account_id = implode(',',$a_account_id);
                }else{
                    $account_id = 0;
                }
            }
            // die;
            if(!empty($linkedin_user_id)){
                return [
                    'token' => $ecrypt_user_id,
                    'user_name' => $first_name.' '.$last_name,
                    'linkedin_id' => $account_id,
                    'redirect' => 'user',
                    'status' => 'success',
                    'msg' => 'Your account create successfully.'
                ];
            }else{ 
                return [
                    'msg' => 'Your credential not correct or not active by admin.',
                    'status' => 'error'
                ];
            }
        // }catch(Exception $e){
        //     DB::table('error_detail')->insert([
        //         'message'=>$e->getMessage(),
        //         'error_path'=>'from common getUserDetail function'
        //     ]);
        // }
    }

    public function createAccount(Request $request){
        //try{
            $encrypt_user_id = 0;

            $linkedin_code = $request->input('code');
            $linkedin_state = $request->input('state'); 
            $redirect_url = $request->input('redirect_url');
            $isVisabili = $request->input('isVisabili');

            if(empty($redirect_url)){
                //$redirect_url = 'http://localhost:3000/login';
                $redirect_url = 'https://www.pipelight.io/login';
            }
            if(!empty($request->input('user_id'))){
                $encrypt_user_id = $request->input('user_id');
            } 

            $url = "https://www.linkedin.com/oauth/v2/accessToken";
            $postMethod = "POST";
            $httpHeader = [
                "content-type: application/x-www-form-urlencoded"
            ];
            $postFields = "grant_type=authorization_code&code=$linkedin_code&redirect_uri=$redirect_url&client_id=783v0rokori887&client_secret=WCqVhx7vuJ2rThH3";           

            $curl = curl_init();
            curl_setopt_array($curl, [
                CURLOPT_URL => $url,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_ENCODING => "",
                CURLOPT_MAXREDIRS => 10,
                CURLOPT_TIMEOUT => 30,
                CURLOPT_SSL_VERIFYPEER => 0,
                CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                CURLOPT_CUSTOMREQUEST => $postMethod,
                CURLOPT_POSTFIELDS =>  $postFields,
                CURLOPT_HTTPHEADER => $httpHeader,
            ]);

            $curlResponse = curl_exec($curl); 
            $errResponse = curl_error($curl);
            curl_close($curl);

            if($errResponse){
                $errResponse;
            }else{
                $curlResponse;
            }
            $curlResponse = json_decode($curlResponse);
            // dd($curlResponse);
            //return $curlResponse->access_token;
            if(isset($curlResponse->access_token)){
                $return_response = $this->getUserDetail($curlResponse->access_token, $curlResponse->refresh_token,$encrypt_user_id,$curlResponse->expires_in,$isVisabili);   
                return response()->json($return_response,200); 
            }else{ 
                return response()->json([
                    'msg' => 'Varification failed.',
                    'status' => 'error'
                ],200); 
            }
        // }catch(Exception $e){
        //     DB::table('error_detail')->insert([
        //         'message'=>$e->getMessage(),
        //         'error_path'=>'from common createAccount function'
        //     ]);
        // }
    }

    public function totalCampaignAds($a_linkedin_campaign_id){
        //try{
            $linkedin_campaign_group_id = explode('-',$a_linkedin_campaign_id)[0];
            $encrypt_user_id = explode('-',$a_linkedin_campaign_id)[1]; 
            
            $current_year = date('Y');
            $current_month = date('m');
            $current_date = date('d');
            $previous_date = date('Y-m-d', strtotime('-29 days'));
            $a_previous_date = explode('-',$previous_date);
            $previous_year = $a_previous_date[0];
            $previous_month = $a_previous_date[1];
            $previous_date = $a_previous_date[2];
            
            $search_date_range = "&dateRange.start.year=2010&dateRange.start.month=3&dateRange.start.day=1&dateRange.end.year=$current_year&dateRange.end.month=$current_month&dateRange.end.day=$current_date";

            //$search_date_range = '&dateRange.start.year=2010&dateRange.start.month=3&dateRange.start.day=1&dateRange.end.year=2022&dateRange.end.month=3&dateRange.end.day=16';
            if(!empty($search_data)){
                $search_date_range = $this->searchByDateRange($search_data);
            }

            $user_id = Crypt::decryptString($encrypt_user_id);
            $user_data = DB::table('user')->select('user_token','user_refresh_token')->where('id',$user_id)->first();
            $user_token = $user_data->user_token;
            $user_refresh_token = $user_data->user_refresh_token; 

            if(!empty($linkedin_campaign_group_id)){
                $a_linkedin_campaign_group_id = [];
                $final_linkedin_creative_id = '';
                $basic_final_linkedin_creative_id = '';
                $a_linkedin_campaign_group_id = explode(',',$linkedin_campaign_group_id);
                if(!empty($a_linkedin_campaign_group_id)){
                    $count = -1;
                    foreach($a_linkedin_campaign_group_id as $linkedin_campaign_group_id){
                        $count++;   
                        if(!empty($linkedin_campaign_group_id)){
                            $final_linkedin_creative_id .= "&campaigns[$count]=urn:li:sponsoredCampaign:$linkedin_campaign_group_id";
                        
                            $basic_final_linkedin_creative_id .= "&search.campaign.values[$count]=urn:li:sponsoredCampaign:$linkedin_campaign_group_id";
                        }
                    }
                }
            } 
            $curl_url = "https://api.linkedin.com/v2/adAnalyticsV2?q=analytics&pivot=CREATIVE$search_date_range&timeGranularity=ALL&fields=externalWebsiteConversions,dateRange,oneClickLeads,impressions,landingPageClicks,clicks,likes,shares,costInLocalCurrency,pivot,pivotValue$final_linkedin_creative_id&projection=(*,elements*(*,pivotValue~(variables,id,type,status)))";
            //dd($curl_url);
            //$curl_url = "https://api.linkedin.com/v2/adCreativesV2?q=search&search.campaign.values[0]=urn:li:sponsoredCampaign:177661453";
        
            $a_header = [
                "content-type: application/json",
                "Accept: application/json",
                "Authorization: Bearer {$user_token}"
            ];  
            $basic_campaign_data = $this->commonCurlGetRequest($curl_url,$a_header);
            //dd($basic_campaign_data);
            if(isset($basic_campaign_data->elements) && !empty($basic_campaign_data->elements)){
                foreach($basic_campaign_data->elements as $k=>$val){ 
                    $handle = 'pivotValue~';
                    $id = $val->$handle->id; 
                    $status = $val->$handle->status; 
                    $basic_campaign_data->elements[$k]->status = $status;
                    $basic_campaign_data->elements[$k]->id = $id;
                } 
            }
            $curl_response = $basic_campaign_data;
            if(empty($curl_response->elements)){  
                $curl_url = "https://api.linkedin.com/v2/adCreativesV2?q=search$basic_final_linkedin_creative_id";  
                return $this->commonCurlGetRequest($curl_url,$a_header);
            }else{
                return $curl_response;
            }
        // }catch(Exception $e){
        //     DB::table('error_detail')->insert([
        //         'message'=>$e->getMessage(),
        //         'error_path'=>'from common totalCampaignAds function'
        //     ]);
        // }
    }
    public function getAccountValiableDetail($account_varialble,$sponsered_utm_capmaign_id,$user_token){
        //try{ 
            if(!empty($sponsered_utm_capmaign_id)){
                $campaign_id = explode(':',$sponsered_utm_capmaign_id)[3];
            }
            $a_header = [
                "content-type: application/json",
                "Accept: application/json",
                "Authorization: Bearer {$user_token}"
            ];  
            $campaign_curl_url = "https://api.linkedin.com/v2/adCampaignsV2/?q=search&search.id.values[0]=$campaign_id"; 
            $campaign_data = $this->commonCurlGetRequest($campaign_curl_url,$a_header);
            
            if(!empty($campaign_data->elements[0]->account)){
                $sponser_account = $campaign_data->elements[0]->account;
                if(!empty($sponser_account)){
                    $account_id = explode(':',$sponser_account)[3];
                }
                $account_curl_url = "https://api.linkedin.com/v2/adAccountsV2/?q=search&search.id.values[0]=$account_id";    
                $account_data = $this->commonCurlGetRequest($account_curl_url,$a_header); 
                //dd($account_data);
                if($account_varialble == 'account_name'){
                    return str_replace(' ','_',strtolower($account_data->elements[0]->name));
                }
                if($account_varialble == 'account_id'){
                    return $account_data->elements[0]->id;
                }
            } 
        // }catch(Exception $e){
        //     DB::table('error_detail')->insert([
        //         'message'=>$e->getMessage(),
        //         'error_path'=>'from common getAccountValiableDetail function'
        //     ]);
        // }
    }
    public function getCampaignValiableDetail($campaign_varialble,$sponsered_utm_capmaign_id,$user_token){
        //try{
            if(!empty($sponsered_utm_capmaign_id)){
                $campaign_id = explode(':',$sponsered_utm_capmaign_id)[3];
            }
            $a_header = [
                "content-type: application/json",
                "Accept: application/json",
                "Authorization: Bearer {$user_token}"
            ];  
            $campaign_curl_url = "https://api.linkedin.com/v2/adCampaignsV2/?q=search&search.id.values[0]=$campaign_id";    
            $campaign_data = $this->commonCurlGetRequest($campaign_curl_url,$a_header); 
            if($campaign_varialble == 'campaign_name'){
                return str_replace(' ','_',strtolower($campaign_data->elements[0]->name));
            }
            if($campaign_varialble == 'campaign_id'){
                return $campaign_data->elements[0]->id;
            }
        // }catch(Exception $e){
        //     DB::table('error_detail')->insert([
        //         'message'=>$e->getMessage(),
        //         'error_path'=>'from common getCampaignValiableDetail function'
        //     ]);
        // }
    }
    public function getCreativeValiableDetail($creative_varialble,$sponsered_utm_capmaign_id,$user_token,$creative_id){ 
        //try{
            //dd($creative_varialble);
            $a_header = [
                "content-type: application/json",
                "Accept: application/json",
                "Authorization: Bearer {$user_token}"
            ];  
            $curl_url = "https://api.linkedin.com/v2/adCreativesV2?q=search&search.id.values[0]=$creative_id";  
            $basic_campaign_data =  $this->commonCurlGetRequest($curl_url,$a_header);
            //dd($a_creative_data);
            //181120596
            if(!empty($basic_campaign_data->elements)){
                foreach($basic_campaign_data->elements as $k=>$val){ 
                    //dd($creative_value);
                    // get ads name and id 
                    if(isset($val->reference)){ 
                        //dd($basic_campaign_data->elements[$k]); 
                        if(isset($basic_campaign_data->elements[$k]->type)){
                            if($basic_campaign_data->elements[$k]->type == 'SPONSORED_STATUS_UPDATE' || $basic_campaign_data->elements[$k]->type == 'SPONSORED_UPDATE_CAROUSEL'){
                                $curl_share_url = "https://api.linkedin.com/v2/shares/$val->reference";
                                $creative_data_with_name =  $this->commonCurlGetRequest($curl_share_url,$a_header);
                            
                                if(isset($creative_data_with_name->subject)){
                                    $ads_name = $creative_data_with_name->subject;
                                }else{
                                    $ads_name = '';
                                }
                                $basic_campaign_data->elements[$k]->ads_name =  $ads_name;
                            }
                        }
                        
                        if(isset($basic_campaign_data->elements[$k]->type)){  
                            if($basic_campaign_data->elements[$k]->type == 'SPONSORED_VIDEO'){  
                                $curl_url = "https://api.linkedin.com/v2/adDirectSponsoredContents/$val->reference";  
                                $a_creative_data_basic =  $this->commonCurlGetRequest($curl_url,$a_header); 
                                if(isset($a_creative_data_basic->name)){
                                    $ads_name = $a_creative_data_basic->name;
                                }else{
                                    $ads_name = '';
                                }
                                $basic_campaign_data->elements[$k]->ads_name =  $ads_name;
                            }
                        }
                        if(isset($basic_campaign_data->elements[$k]->type)){
                            if($basic_campaign_data->elements[$k]->type == 'SPONSORED_INMAILS' || $basic_campaign_data->elements[$k]->type == 'SPONSORED_MESSAGE'){  
                                $curl_share_url = "https://api.linkedin.com/rest/inMailContents/$val->reference";
                                $a_header = [
                                    "content-type: application/json", 
                                    "LinkedIn-Version:202206",
                                    //"X-Restli-Protocol-Version:2.0.0",
                                    "Authorization: Bearer {$user_token}"
                                ];
                                $creative_data_with_name =  $this->commonCurlGetRequest($curl_share_url,$a_header);
                                //dd($creative_data_with_name);
                                if(isset($creative_data_with_name->subject)){
                                    $ads_name = $creative_data_with_name->subject;
                                }else{
                                    $ads_name = '';
                                }
                                $basic_campaign_data->elements[$k]->ads_name =  $ads_name;
                            }
                        }
                    
                    }else{
                        $additional_parameter_spotlight = 'com.linkedin.ads.SpotlightCreativeVariablesV2';
                        $additional_parameter_text_ads = 'com.linkedin.ads.TextAdCreativeVariables';
                        if(isset($basic_campaign_data->elements[$k]->type)){
                            if($basic_campaign_data->elements[$k]->type == 'SPOTLIGHT_V2'){
                                $basic_campaign_data->elements[$k]->ads_name =  $basic_campaign_data->elements[$k]->variables->data->$additional_parameter_spotlight->headline;
                            }
                        }
                        if(isset($basic_campaign_data->elements[$k]->type)){
                            if($basic_campaign_data->elements[$k]->type == 'TEXT_AD'){
                                $basic_campaign_data->elements[$k]->ads_name =  $basic_campaign_data->elements[$k]->variables->data->$additional_parameter_text_ads->title;
                            }
                        }
                    }
                    // $a_creative_data->elements[$k]->ads_name =  $ads_name;
                    // if(!empty($creative_value->reference)){
                    //     if($creative_value->type == 'SPONSORED_VIDEO'){
                    //         $curl_url = "https://api.linkedin.com/v2/adDirectSponsoredContents/$creative_value->reference";  
                    //         $a_creative_data_basic =  $this->commonCurlGetRequest($curl_url,$a_header);
                    //         //dd($a_creative_data->name);
                    //         if(isset($a_creative_data_basic->name)){
                    //             $ads_name = $a_creative_data_basic->name;
                    //         }else{
                    //             $ads_name = '';
                    //         }
                    //     }else{
                    //         $curl_share_url = "https://api.linkedin.com/v2/shares/$creative_value->reference";
                    //         $creative_data_with_name =  $this->commonCurlGetRequest($curl_share_url,$a_header);
                    //         //dd($creative_data_with_name);
                    //         if(isset($creative_data_with_name->subject)){
                    //             $ads_name = $creative_data_with_name->subject;
                    //         }else{
                    //             $ads_name = '';
                    //         }
                    //     }
                    //     //dd($ads_name);
                    //     $a_creative_data->elements[$k]->ads_name =  $ads_name;
                        
                    // }
                } 
            } 

            if($creative_varialble == 'creative_name'){
                return str_replace(' ','_',strtolower((isset($basic_campaign_data->elements[0]->ads_name))?$basic_campaign_data->elements[0]->ads_name:'not_found'));
            }
            if($creative_varialble == 'ad_id'){
                return $basic_campaign_data->elements[0]->id;
            }
        // }catch(Exception $e){
        //     DB::table('error_detail')->insert([
        //         'message'=>$e->getMessage(),
        //         'error_path'=>'from common getCreativeValiableDetail function'
        //     ]);
        // }
    }
    public function getVariableLevelDynamicData($level,$sponsered_utm_capmaign_id,$a_utm_parameter,$user_token,$creative_id){
        //try{
            if($level == 'campaign'){
                //dd($a_utm_parameter);
                if(!empty($a_utm_parameter)){
                    foreach($a_utm_parameter as $parameter_key=>$encode_parameter_value){
                        $parameter_value = trim($encode_parameter_value, "{{}}");
                        if($parameter_value == 'account_name'){
                            $a_utm_parameter[$parameter_key] = $this->getAccountValiableDetail($parameter_value,$sponsered_utm_capmaign_id,$user_token);
                        }
                        if($parameter_value == 'account_id'){
                            $a_utm_parameter[$parameter_key] = $this->getAccountValiableDetail($parameter_value,$sponsered_utm_capmaign_id,$user_token);
                        }
                        if($parameter_value == 'campaign_name'){
                            $a_utm_parameter[$parameter_key] = $this->getCampaignValiableDetail($parameter_value,$sponsered_utm_capmaign_id,$user_token);
                        }
                        if($parameter_value == 'campaign_id'){
                            $a_utm_parameter[$parameter_key] = $this->getCampaignValiableDetail($parameter_value,$sponsered_utm_capmaign_id,$user_token);
                        }
                        if($parameter_value == 'creative_name'){  
                            $a_utm_parameter[$parameter_key] = $this->getCreativeValiableDetail($parameter_value,$sponsered_utm_capmaign_id,$user_token,$creative_id);
                        }
                        if($parameter_value == 'ad_id'){
                            $a_utm_parameter[$parameter_key] = $this->getCreativeValiableDetail($parameter_value,$sponsered_utm_capmaign_id,$user_token,$creative_id);
                        }
                    }  
                    if(!empty($a_utm_parameter)){
                        return $a_utm_parameter;
                    }
                }
            }
            if($level == 'creative'){
                if(!empty($a_utm_parameter)){
                    //dd($a_utm_parameter);
                    foreach($a_utm_parameter as $parameter_key=>$encode_parameter_value){
                        $parameter_value = trim($encode_parameter_value, "{{}}");
                        if($parameter_value == 'account_name'){
                            $a_utm_parameter[$parameter_key] = $this->getAccountValiableDetail($parameter_value,$sponsered_utm_capmaign_id,$user_token);
                        }
                        if($parameter_value == 'account_id'){
                            $a_utm_parameter[$parameter_key] = $this->getAccountValiableDetail($parameter_value,$sponsered_utm_capmaign_id,$user_token);
                        }
                        if($parameter_value == 'campaign_name'){
                            $a_utm_parameter[$parameter_key] = $this->getCampaignValiableDetail($parameter_value,$sponsered_utm_capmaign_id,$user_token);
                        }
                        if($parameter_value == 'campaign_id'){ 
                            $a_utm_parameter[$parameter_key] = $this->getCampaignValiableDetail($parameter_value,$sponsered_utm_capmaign_id,$user_token); 
                        }
                        if($parameter_value == 'creative_name'){  
                            $a_utm_parameter[$parameter_key] = $this->getCreativeValiableDetail($parameter_value,$sponsered_utm_capmaign_id,$user_token,$creative_id);
                        }
                        if($parameter_value == 'ad_id'){
                            $a_utm_parameter[$parameter_key] = $this->getCreativeValiableDetail($parameter_value,$sponsered_utm_capmaign_id,$user_token,$creative_id);
                        }
                    }  
                    // dd($a_utm_parameter);
                    if(!empty($a_utm_parameter)){
                        return $a_utm_parameter;
                    }
                } 
            }
        // }catch(Exception $e){
        //     DB::table('error_detail')->insert([
        //         'message'=>$e->getMessage(),
        //         'error_path'=>'from common getVariableLevelDynamicData function'
        //     ]);
        // }
    }

    public function storeCampaignCronData(Request $request){ 
        //try{
            $utm_capmaign_id = $request->utm_capmaign_id;
            $selected_utm = $request->selected_utm;
            $encrypt_user_id = $request->user_token;
            $a_utm_capmaign_id = explode(',',$utm_capmaign_id);
            
            if(!empty($a_utm_capmaign_id)){
                foreach($a_utm_capmaign_id as $campaign_key=>$campaign_id){
                    $a_ads_detail =  $this->totalCampaignAds($campaign_id.'-'.$encrypt_user_id);
                    if(!empty($a_ads_detail->elements)){
                        foreach($a_ads_detail->elements as $ads_key=>$ads_id){
                            $ads_id =  $ads_id->id;
                            DB::table('utm_parameter_cron')->insert([
                                'utm_capmaign_id' => $campaign_id,
                                'utm_creative_id' => $ads_id,
                                'selected_utm' => $selected_utm,
                                'user_token' => $encrypt_user_id,
                                'utm_type' => 1
                            ]);
                        }
                    }
                }
            }
            
            // DB::table('utm_parameter_cron')->insert([
            //     'utm_capmaign_id' => $utm_capmaign_id,
            //     'selected_utm' => $selected_utm,
            //     'user_token' => $encrypt_user_id,
            //     'utm_type' => 1
            // ]);->delete
        // }catch(Exception $e){
        //     DB::table('error_detail')->insert([
        //         'message'=>$e->getMessage(),
        //         'error_path'=>'from common storeCampaignCronData function'
        //     ]);
        // }

    }
    //public function updateCampaignUtm(Request $request){ 
    public function updateCampaignUtm($utm_capmaign_id,$selected_utm,$encrypt_user_id){
        ////try{
            // $utm_capmaign_id = $request->utm_capmaign_id;
            // $selected_utm = $request->selected_utm;
            // $encrypt_user_id = $request->user_token;
    
            $user_id = Crypt::decryptString($encrypt_user_id);
            $user_data = DB::table('user')->select('user_token','user_refresh_token')->where('id',$user_id)->first();
            $user_token = $user_data->user_token; 
            
            $a_utm_parameter = DB::table('utm_parameter')->where('utm_name_id',$selected_utm)->get()->pluck('parameter_value','parameter_key'); 
            //dd($a_utm_parameter);
            $a_utm_parameter = json_decode(json_encode($a_utm_parameter), true);
            //dd($a_utm_parameter);
            
            $a_share_detail =  $this->getCampaignShareDetail($user_token,$utm_capmaign_id,$selected_utm);
            //dd($a_share_detail);
            //dd(count($a_share_detail));
            if(!empty($a_share_detail)){
                $ads_update_count = 0;
                //dd($a_share_detail);
                foreach($a_share_detail as $a_creative_id=>$share_data){ 
                    $creative_id = explode('|',$a_creative_id)[0];
                    $sponsered_utm_capmaign_id = explode('|',$a_creative_id)[1];
                    $ads_type = explode('|',$a_creative_id)[2]; 
                    $a_update_utm_parameter = $this->getVariableLevelDynamicData('campaign',$sponsered_utm_capmaign_id,$a_utm_parameter,$user_token,$creative_id);
                    // dd($a_update_utm_parameter);
                    
                    $is_update =  $this->getCampaignUpdateShareDetail($user_token,$share_data,$a_update_utm_parameter,$user_id,$selected_utm,$creative_id,$ads_type); 
                    if($is_update){
                        $ads_update_count++; 
                    }else{
                        DB::table('utm_parameter_cron')->where('utm_creative_id',$creative_id)->delete();
                    }
                }
                //dd($a_update_utm_parameter);
                return response()->json([
                    'msg' => "Total $ads_update_count ads parameter effected.",
                    'status' => 200
                ],200);
            }else{
                return response()->json([
                    'msg' => "No ads for this campaign.",
                    'status' => 'error'
                ],200);
            }
        // }catch(Exception $e){
        //     DB::table('error_detail')->insert([
        //         'message'=>$e->getMessage(),
        //         'error_path'=>'from common updateCampaignUtm function'
        //     ]);
        // }
    } 
    public function storeCreativeCronData(Request $request){ 
        //try{
            $utm_creative_id = $request->utm_creative_id;
            $selected_utm = $request->selected_utm;
            $encrypt_user_id = $request->user_token;

            $a_utm_creative_id = explode(',',$utm_creative_id);
            
            if(!empty($a_utm_creative_id)){
                foreach($a_utm_creative_id as $creative_key=>$creative_id){
                    DB::table('utm_parameter_cron')->insert([
                        'utm_creative_id' => $creative_id,
                        'selected_utm' => $selected_utm,
                        'user_token' => $encrypt_user_id,
                        'utm_type' => 2
                    ]);
                }
            } 
        // }catch(Exception $e){
        //     DB::table('error_detail')->insert([
        //         'message'=>$e->getMessage(),
        //         'error_path'=>'from common storeCreativeCronData function'
        //     ]);
        // }
    }
    public function updateCreativeUtm($utm_creative_id,$selected_utm,$encrypt_user_id){
    //public function updateCreativeUtm(Request $request){
        //try{
            // $utm_creative_id = $request->utm_creative_id;
            // $selected_utm = $request->selected_utm;
            // $encrypt_user_id = $request->user_token;

            $user_id = Crypt::decryptString($encrypt_user_id);
            $user_data = DB::table('user')->select('user_token','user_refresh_token')->where('id',$user_id)->first();
            $user_token = $user_data->user_token; 

            $a_utm_parameter = DB::table('utm_parameter')->where('utm_name_id',$selected_utm)->get()->pluck('parameter_value','parameter_key'); 
            $a_utm_parameter = json_decode(json_encode($a_utm_parameter), true);

            // dd('1212');
            
            $a_share_detail =  $this->getCreativeShareDetail($user_token,$utm_creative_id,$selected_utm);

            
            if(!empty($a_share_detail)){
            
                $ads_update_count = 0;
                foreach($a_share_detail as $a_creative_id=>$share_data){

                    $creative_id = explode('|',$a_creative_id)[0];

                    $sponsered_utm_capmaign_id = explode('|',$a_creative_id)[1];
                    $ads_type = explode('|',$a_creative_id)[2]; 

                    // dd($ads_type);

                    $a_update_utm_parameter = $this->getVariableLevelDynamicData('creative',$sponsered_utm_capmaign_id,$a_utm_parameter,$user_token,$creative_id); 
                    // dd($a_update_utm_parameter);
                    $is_update =  $this->getCampaignUpdateShareDetail($user_token,$share_data,$a_update_utm_parameter,$user_id,$selected_utm,$creative_id,$ads_type);
                    // dd($is_update);
                    $is_update =  true; 
                    if($is_update){
                        $ads_update_count++; 
                    }else{
                        // DB::table('utm_parameter_cron')->where('utm_creative_id',$creative_id)->delete();
                    }
                    
                }
                return response()->json([
                    'msg' => "Total $ads_update_count ads parameter effected.",
                    'status' => 200
                ],200);
            }else{
                return response()->json([
                    'msg' => "No ads for this campaign.",
                    'status' => 'error'
                ],200);
            }
        // }catch(Exception $e){
        //     DB::table('error_detail')->insert([
        //         'message'=>$e->getMessage(),
        //         'error_path'=>'from common updateCreativeUtm function'
        //     ]);
        // }
    } 
    public function convertDesireParameter($current_full_parameter,$a_utm_parameter){  
        //try{
            //dd($current_full_parameter);
            $base_url = explode('?',$current_full_parameter)[0];
            // convert online parameter to array
            $a_explode_current_parameter = [];
            // if(!empty($current_full_parameter)){
            //     $base_url = explode('?',$current_full_parameter)[0];
            //     $current_parameter = @explode('?',$current_full_parameter)[1];
            //     if(!empty($current_parameter)){
            //         $explode_current_parameter = explode('&',$current_parameter);
            //         if(!empty($explode_current_parameter)){
            //             foreach($explode_current_parameter as $explode_value){
            //                 if(!empty($explode_value)){
            //                     $parameter_key = explode('=',$explode_value)[0];
            //                     $parameter_value = explode('=',$explode_value)[1];
            //                     $a_explode_current_parameter[$parameter_key] = $parameter_value;
            //                 }
            //             }
            //         }
            //     }
            // }
            // echo "<pre>"; 
            // print_r($a_explode_current_parameter);
            // dd();
            // print_r($a_utm_parameter);
            //dd($a_utm_parameter);
            $a_desired_parameter = array_merge($a_explode_current_parameter,$a_utm_parameter);
            //dd($a_desired_parameter);
            if(!empty($a_desired_parameter)){
                $desired_utm_parameter = '';
                $parameter_count = 0;
                foreach($a_desired_parameter as $parameter_key=>$parameter_value){
                    $parameter_count++;
                    if($parameter_count == 1){
                        $desired_utm_parameter .= $parameter_key.'='.$parameter_value;
                    }else{
                        $desired_utm_parameter .= '&'.$parameter_key.'='.$parameter_value;
                    }
                }
            }
            //dd($base_url.'?'.$desired_utm_parameter);
            return $base_url.'?'.$desired_utm_parameter;
        // }catch(Exception $e){
        //     DB::table('error_detail')->insert([
        //         'message'=>$e->getMessage(),
        //         'error_path'=>'from common convertDesireParameter function'
        //     ]);
        // }
    }
 
    public function getCampaignUpdateShareDetail($user_token,$share_data,$a_utm_parameter,$user_id,$selected_utm,$creative_id,$ads_type){
        ////try{
            // dd($user_token,$share_data,$a_utm_parameter,$user_id,$selected_utm,$creative_id,$ads_type);
            $is_update = '';
            // ads type 1
            if($ads_type == 'SPONSORED_MESSAGE1'){
                // Get data
                $share_data = urlencode("urn:li:sponsoredCreative:$creative_id");
                $get_api_data_resource = "https://api.linkedin.com/rest/creatives/$share_data";  
                $utm_curl = curl_init();  
                curl_setopt_array($utm_curl, array(   
                    CURLOPT_URL => $get_api_data_resource, 
                    CURLOPT_RETURNTRANSFER => true,
                    CURLOPT_ENCODING => "",
                    CURLOPT_MAXREDIRS => 10,
                    CURLOPT_FOLLOWLOCATION => true,
                    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                    CURLOPT_TIMEOUT => 300,
                    CURLOPT_CUSTOMREQUEST => "GET",
                    CURLOPT_HTTPHEADER => array( 
                        "X-RestLi-Protocol-Version: 2.0.0",
                        "LinkedIn-Version: 202206", 
                        "Content-Type: application/json",
                        "Authorization: Bearer {$user_token}")
                )); 
                $all_creative_data = json_decode(curl_exec($utm_curl));
                //dd($all_creative_data);
                $current_full_parameter =  $all_creative_data->content->textAd->landingPage;
                if($all_creative_data->content->textAd->description){
                    $description =  $all_creative_data->content->textAd->description;
                }else{
                    $description =  'NA';
                }

                if($all_creative_data->content->textAd->headline){
                    $headline =  $all_creative_data->content->textAd->headline;
                }else{
                    $headline =  'NA';
                }

                $desired_utm_parameter = $this->convertDesireParameter($current_full_parameter,$a_utm_parameter); 

                // Update Data
                $post_data = [
                    "patch" => [ 
                        '$set' => [
                            "content"=>[
                                "textAd"=>[ 
                                    "description" => $description,
                                    "headline" => $headline,
                                    "landingPage" => $desired_utm_parameter
                                ]
                            ]
                        ]
                    ] 
                ];  
                //dd(json_encode($post_data));
                //dd("https://api.linkedin.com/rest/creatives/$share_data");
                $utm_curl = curl_init("https://api.linkedin.com/rest/creatives/$share_data");
                curl_setopt($utm_curl, CURLOPT_RETURNTRANSFER, true); 
                curl_setopt($utm_curl, CURLOPT_POSTFIELDS, json_encode($post_data));
                curl_setopt($utm_curl, CURLOPT_HTTPHEADER, array( 
                    "X-RestLi-Method: PARTIAL_UPDATE",
                    "content-type: application/json",
                    "X-RestLi-Protocol-Version:2.0.0",
                    "LinkedIn-Version:202206",
                    "Authorization: Bearer {$user_token}"
                ));
                
                $share_response = curl_exec($utm_curl); 
                $is_update = curl_getinfo($utm_curl, CURLINFO_HTTP_CODE); 
            }
            // ads type 2
            if($ads_type == 'TEXT_AD'){ 
                // Get data
                $share_data = urlencode("urn:li:sponsoredCreative:$creative_id");
                $get_api_data_resource = "https://api.linkedin.com/rest/creatives/$share_data";  
                $utm_curl = curl_init();  
                curl_setopt_array($utm_curl, array(   
                    CURLOPT_URL => $get_api_data_resource, 
                    CURLOPT_RETURNTRANSFER => true,
                    CURLOPT_ENCODING => "",
                    CURLOPT_MAXREDIRS => 10,
                    CURLOPT_FOLLOWLOCATION => true,
                    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                    CURLOPT_TIMEOUT => 300,
                    CURLOPT_CUSTOMREQUEST => "GET",
                    CURLOPT_HTTPHEADER => array( 
                        "X-RestLi-Protocol-Version: 2.0.0",
                        "LinkedIn-Version: 202206", 
                        "Content-Type: application/json",
                        "Authorization: Bearer {$user_token}")
                )); 
                $all_creative_data = json_decode(curl_exec($utm_curl));
                 
                $current_full_parameter =  $all_creative_data->content->textAd->landingPage;
                if($all_creative_data->content->textAd->description){
                    $description =  $all_creative_data->content->textAd->description;
                }else{
                    $description =  'NA';
                }

                if($all_creative_data->content->textAd->headline){
                    $headline =  $all_creative_data->content->textAd->headline;
                }else{
                    $headline =  'NA';
                }

                $desired_utm_parameter = $this->convertDesireParameter($current_full_parameter,$a_utm_parameter); 

                // Update Data
                $post_data = [
                    "patch" => [ 
                        '$set' => [
                            "content"=>[
                                "textAd"=>[ 
                                    "description" => $description,
                                    "headline" => $headline,
                                    "landingPage" => $desired_utm_parameter
                                ]
                            ]
                        ]
                    ] 
                ];  
                //dd(json_encode($post_data));
                //dd("https://api.linkedin.com/rest/creatives/$share_data");
                $utm_curl = curl_init("https://api.linkedin.com/rest/creatives/$share_data");
                curl_setopt($utm_curl, CURLOPT_RETURNTRANSFER, true); 
                curl_setopt($utm_curl, CURLOPT_POSTFIELDS, json_encode($post_data));
                curl_setopt($utm_curl, CURLOPT_HTTPHEADER, array( 
                    "X-RestLi-Method: PARTIAL_UPDATE",
                    "content-type: application/json",
                    "X-RestLi-Protocol-Version:2.0.0",
                    "LinkedIn-Version:202206",
                    "Authorization: Bearer {$user_token}"
                ));
                
                $share_response = curl_exec($utm_curl); 
                $is_update = curl_getinfo($utm_curl, CURLINFO_HTTP_CODE); 

                //$is_update = 204;
            }
            // ads type 3
            if($ads_type == 'SPOTLIGHT_V2'){
                $extra_parameter = "com.linkedin.ads.SpotlightCreativeVariablesV2";
                // Get data
                $share_data = urlencode("urn:li:sponsoredCreative:$creative_id");
                $get_api_data_resource = "https://api.linkedin.com/rest/creatives/$share_data";  
                $utm_curl = curl_init();  
                curl_setopt_array($utm_curl, array(   
                    CURLOPT_URL => $get_api_data_resource, 
                    CURLOPT_RETURNTRANSFER => true,
                    CURLOPT_ENCODING => "",
                    CURLOPT_MAXREDIRS => 10,
                    CURLOPT_FOLLOWLOCATION => true,
                    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                    CURLOPT_TIMEOUT => 300,
                    CURLOPT_CUSTOMREQUEST => "GET",
                    CURLOPT_HTTPHEADER => array( 
                        "X-RestLi-Protocol-Version: 2.0.0",
                        "LinkedIn-Version: 202206", 
                        "Content-Type: application/json",
                        "Authorization: Bearer {$user_token}")
                )); 
                $all_creative_data = json_decode(curl_exec($utm_curl));
                $current_full_parameter =  $all_creative_data->content->spotlight->landingPage;
                if($all_creative_data->content->spotlight->callToAction){
                    $callToAction =  $all_creative_data->content->spotlight->callToAction;
                }else{
                    $callToAction =  'NA';
                }

                if($all_creative_data->content->spotlight->headline){
                    $headline =  $all_creative_data->content->spotlight->headline;
                }else{
                    $headline =  'NA';
                }

                $desired_utm_parameter = $this->convertDesireParameter($current_full_parameter,$a_utm_parameter);
                //$all_creative_data->content->spotlight->landingPage = $desired_utm_parameter;
                //dd($all_creative_data->content->spotlight);
                // Update Data
                $post_data = [
                    "patch" => [ 
                        '$set' => [
                            "content"=>[
                                "spotlight"=>[
                                    "callToAction" => $callToAction,
                                    "headline" => $headline,
                                    "landingPage" => $desired_utm_parameter
                                ]
                            ]
                        ]
                    ] 
                ];  
                //dd(json_encode($post_data));
                //dd("https://api.linkedin.com/rest/creatives/$share_data");
                $utm_curl = curl_init("https://api.linkedin.com/rest/creatives/$share_data");
                curl_setopt($utm_curl, CURLOPT_RETURNTRANSFER, true); 
                curl_setopt($utm_curl, CURLOPT_POSTFIELDS, json_encode($post_data));
                curl_setopt($utm_curl, CURLOPT_HTTPHEADER, array( 
                    "X-RestLi-Method: PARTIAL_UPDATE",
                    "content-type: application/json",
                    "X-RestLi-Protocol-Version:2.0.0",
                    "LinkedIn-Version:202206",
                    "Authorization: Bearer {$user_token}"
                ));
                
                $share_response = curl_exec($utm_curl); 
                $is_update = curl_getinfo($utm_curl, CURLINFO_HTTP_CODE); 
                //$is_update = 204;
            }

            // ads type 4
            if($ads_type == 'SPONSORED_INMAILS'){
                    // Get data
                    $share_data = urlencode($share_data);
                    $get_api_data_resource = "https://api.linkedin.com/rest/inMailContents/$share_data";  
                    //dd($get_api_data_resource);
                    $utm_curl = curl_init();  
                    curl_setopt_array($utm_curl, array(   
                        CURLOPT_URL => $get_api_data_resource, 
                        CURLOPT_RETURNTRANSFER => true,
                        CURLOPT_ENCODING => "",
                        CURLOPT_MAXREDIRS => 10,
                        CURLOPT_FOLLOWLOCATION => true,
                        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                        CURLOPT_TIMEOUT => 300,
                        CURLOPT_CUSTOMREQUEST => "GET",
                        CURLOPT_HTTPHEADER => array( 
                            "X-RestLi-Protocol-Version: 2.0.0",
                            "LinkedIn-Version: 202206", 
                            "Content-Type: application/json",
                            "Authorization: Bearer {$user_token}")
                    )); 
                    $all_creative_data = json_decode(curl_exec($utm_curl));
                    //dd($all_creative_data->subContent->regular->callToActionLandingPageUrl);  
                    $current_full_parameter =  $all_creative_data->subContent->regular->callToActionLandingPageUrl;
                    $desired_utm_parameter = $this->convertDesireParameter($current_full_parameter,$a_utm_parameter);
                    $all_creative_data->subContent->regular->callToActionLandingPageUrl = $desired_utm_parameter;
                    //dd($all_creative_data->subContent->regular->callToActionText);
                    // Update Data
                    $post_data = [
                        "patch" => [ 
                            '$set' => [
                                "subContent"=>[
                                    "regular"=>[ 
                                        "callToActionLandingPageUrl"=>$desired_utm_parameter,
                                        "callToActionText"=> ($all_creative_data->subContent->regular->callToActionText)?$all_creative_data->subContent->regular->callToActionText:''
                                    ]
                                ]
                            ]
                        ] 
                    ];  
                    //dd(json_encode($post_data));
                    $utm_curl = curl_init("https://api.linkedin.com/rest/inMailContents/$share_data");
                    curl_setopt($utm_curl, CURLOPT_RETURNTRANSFER, true); 
                    curl_setopt($utm_curl, CURLOPT_POSTFIELDS, json_encode($post_data));
                    curl_setopt($utm_curl, CURLOPT_HTTPHEADER, array( 
                        "content-type: application/json",
                        "X-RestLi-Protocol-Version:2.0.0",
                        "LinkedIn-Version:202206",
                        "Authorization: Bearer {$user_token}"
                    ));
                    
                    $share_response = curl_exec($utm_curl); 
                    $is_update = curl_getinfo($utm_curl, CURLINFO_HTTP_CODE);
                    
                    //$is_update = 204;
            }

            // ads type 5
            if($ads_type == 'SPONSORED_UPDATE_CAROUSEL'){
                // Get data
                $get_api_data_resource = "https://api.linkedin.com/v2/ugcPosts/$share_data";  
                $utm_curl = curl_init();  
                curl_setopt_array($utm_curl, array(   
                    CURLOPT_URL => $get_api_data_resource, 
                    CURLOPT_RETURNTRANSFER => true,
                    CURLOPT_ENCODING => "",
                    CURLOPT_MAXREDIRS => 10,
                    CURLOPT_FOLLOWLOCATION => true,
                    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                    CURLOPT_TIMEOUT => 300,
                    CURLOPT_CUSTOMREQUEST => "GET",
                    CURLOPT_HTTPHEADER => array( 
                        //"X-RestLi-Protocol-Version: 2.0.0",
                        "LinkedIn-Version: 202206", 
                        "Content-Type: application/json",
                        "Authorization: Bearer {$user_token}")
                )); 
                $all_creative_data = json_decode(curl_exec($utm_curl)); 
                $additional_parameter = 'com.linkedin.ugc.ShareContent';
                $current_full_parameter =  $all_creative_data->specificContent->$additional_parameter->primaryLandingPageUrl;
                $desired_utm_parameter = $this->convertDesireParameter($current_full_parameter,$a_utm_parameter);

                // Update Data
                $post_data = [
                    "patch" => [
                        "specificContent" => [
                            "$additional_parameter" => [
                            '$set' => [
                                "primaryLandingPageUrl"=>$desired_utm_parameter
                                ] 
                            ] 
                        ] 
                    ] 
                ];  

                $utm_curl = curl_init("https://api.linkedin.com/v2/ugcPosts/$share_data");
                curl_setopt($utm_curl, CURLOPT_RETURNTRANSFER, true); 
                curl_setopt($utm_curl, CURLOPT_POSTFIELDS, json_encode($post_data));
                curl_setopt($utm_curl, CURLOPT_HTTPHEADER, array( "content-type: application/json",
                "Authorization: Bearer {$user_token}"));
                
                $share_response = curl_exec($utm_curl); 
                $is_update = curl_getinfo($utm_curl, CURLINFO_HTTP_CODE);
                //return $response_code;

                //$is_update = 204;
    
            }

            // ads type 6
            if($ads_type == 'SPONSORED_STATUS_UPDATE'){ 
                // Get data
                $get_api_data_resource = "https://api.linkedin.com/v2/ugcPosts/$share_data";  
                $utm_curl = curl_init();  
                curl_setopt_array($utm_curl, array(   
                    CURLOPT_URL => $get_api_data_resource, 
                    CURLOPT_RETURNTRANSFER => true,
                    CURLOPT_ENCODING => "",
                    CURLOPT_MAXREDIRS => 10,
                    CURLOPT_FOLLOWLOCATION => true,
                    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                    CURLOPT_TIMEOUT => 300,
                    CURLOPT_CUSTOMREQUEST => "GET",
                    CURLOPT_HTTPHEADER => array( 
                        //"X-RestLi-Protocol-Version: 2.0.0",
                        "LinkedIn-Version: 202206", 
                        "Content-Type: application/json",
                        "Authorization: Bearer {$user_token}")
                )); 
                $all_creative_data = json_decode(curl_exec($utm_curl));

                // dd($all_creative_data);
            
                $additional_parameter = 'com.linkedin.ugc.ShareContent';
                $additional_call_to_action_parameter = 'com.linkedin.content.PageUrls';

                // dd($all_creative_data->specificContent->$additional_parameter->media[0]);
                $incoming_data = $all_creative_data->specificContent->$additional_parameter->media[0];                 
                
                $current_full_parameter =  $all_creative_data->specificContent->$additional_parameter->media[0]->originalUrl;
                $desired_utm_parameter = $this->convertDesireParameter($current_full_parameter,$a_utm_parameter);

                // dd($incoming_data);
                //dd($incoming_data->landingPageV2->destination);
               
                //old code
                // if(!empty($desired_utm_parameter) && isset($incoming_data->callToAction->landingPage->destination->$additional_call_to_action_parameter->primaryUrl) ){

                //     //dd('1');
                //     $incoming_data->originalUrl = $desired_utm_parameter;
                //     $incoming_data->callToAction->landingPage->destination->$additional_call_to_action_parameter->primaryUrl = $desired_utm_parameter;
                // } 

                // dd($incoming_data);

                if(!empty($desired_utm_parameter) && isset($incoming_data->originalUrl) ){

                    // dd('1');
                    $PageUrls = 'com.linkedin.content.PageUrls';
                    if (isset($incoming_data->originalUrl)) {
                        $incoming_data->originalUrl = $desired_utm_parameter;
                    }

                    if (isset($incoming_data->landingPage->landingPageUrl)) {
                        $incoming_data->landingPage->landingPageUrl = $desired_utm_parameter;
                    }

                    if (isset($incoming_data->landingPageV2->destination->$PageUrls->primaryUrl)) {
                        $incoming_data->landingPageV2->destination->$PageUrls->primaryUrl = $desired_utm_parameter;
                    }
                    // dd($incoming_data,$desired_utm_parameter);
                }
                   // dd('2');
                // $incoming_data->originalUrl = $desired_utm_parameter;
                // $incoming_data->callToAction->landingPage->destination->$additional_call_to_action_parameter->primaryUrl = $desired_utm_parameter;

                // dd($incoming_data);
                // Update Data
                $post_data = [
                    "patch" => [
                        "specificContent" => [
                            "$additional_parameter" => [
                                '$set' => [
                                    "media" => [
                                        $incoming_data
                                    ]
                                ] 
                            ] 
                        ] 
                    ] 
                ];  
                // dd($post_data,$share_data);
                $utm_curl = curl_init("https://api.linkedin.com/v2/ugcPosts/$share_data");
                curl_setopt($utm_curl, CURLOPT_RETURNTRANSFER, true); 
                curl_setopt($utm_curl, CURLOPT_POSTFIELDS, json_encode($post_data));
                curl_setopt($utm_curl, CURLOPT_HTTPHEADER, array( "content-type: application/json",
                "Authorization: Bearer {$user_token}"));
                
                $share_response = curl_exec($utm_curl); 
                $is_update = curl_getinfo($utm_curl, CURLINFO_HTTP_CODE);
            
                //$is_update = 204;

                // dd($share_response,$utm_curl,$is_update);
            } 
            //dd($ads_type); 
            // ads type 7
            if($ads_type == 'SPONSORED_VIDEO'){
                // Get data
                $get_api_data_resource = "https://api.linkedin.com/v2/ugcPosts/$share_data";  
                $utm_curl = curl_init();  
                curl_setopt_array($utm_curl, array(   
                    CURLOPT_URL => $get_api_data_resource, 
                    CURLOPT_RETURNTRANSFER => true,
                    CURLOPT_ENCODING => "",
                    CURLOPT_MAXREDIRS => 10,
                    CURLOPT_FOLLOWLOCATION => true,
                    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                    CURLOPT_TIMEOUT => 300,
                    CURLOPT_CUSTOMREQUEST => "GET",
                    CURLOPT_HTTPHEADER => array( 
                        //"X-RestLi-Protocol-Version: 2.0.0",
                        "LinkedIn-Version: 202206", 
                        "Content-Type: application/json",
                        "Authorization: Bearer {$user_token}")
                )); 
                $all_creative_data = json_decode(curl_exec($utm_curl));
                //dd($all_creative_data);
                $additional_parameter = 'com.linkedin.ugc.ShareContent';
                $additional_call_to_action_parameter = 'com.linkedin.content.PageUrls';

                //dd($all_creative_data->specificContent->$additional_parameter->media[0]->landingPage->landingPageUrl);
                $incoming_data = $all_creative_data->specificContent->$additional_parameter->media[0]; 
                
                $current_full_parameter =  $all_creative_data->specificContent->$additional_parameter->media[0]->landingPage->landingPageUrl;
                $desired_utm_parameter = $this->convertDesireParameter($current_full_parameter,$a_utm_parameter);

                $incoming_data->landingPage->landingPageUrl = $desired_utm_parameter;
                
                //dd($incoming_data);
                // Update Data
                $post_data = [
                    "patch" => [
                        "specificContent" => [
                            "$additional_parameter" => [
                                '$set' => [
                                    "media" => [
                                        $incoming_data
                                    ]
                                ] 
                            ] 
                        ] 
                    ] 
                ];  
                //dd($post_data);
                $utm_curl = curl_init("https://api.linkedin.com/v2/ugcPosts/$share_data");
                curl_setopt($utm_curl, CURLOPT_RETURNTRANSFER, true); 
                curl_setopt($utm_curl, CURLOPT_POSTFIELDS, json_encode($post_data));
                curl_setopt($utm_curl, CURLOPT_HTTPHEADER, array( "content-type: application/json",
                "Authorization: Bearer {$user_token}"));
                
                $share_response = curl_exec($utm_curl); 
                $is_update = curl_getinfo($utm_curl, CURLINFO_HTTP_CODE); 

                //$is_update = 204;
            }            
            
            if($is_update == 204){ 
                // For maintain uniquesness in utm update
                $is_insert = $this->maintainUniqueness($user_id,$selected_utm,$creative_id);
                if($is_insert){
                    //try{
                        $current_date = date('Y-m-d H:i:s');
                        DB::table('utm_parameter_update')->insert([
                            'user_id'=>$user_id,
                            'utm_parameter_name_id'=>$selected_utm,
                            'ads_id'=>$creative_id,
                            'created_at'=>"$current_date"
                        ]);
                    // }catch(Exception $e){
                    //     DB::table('error_detail')->insert([
                    //         'message'=>$e->getMessage(),
                    //         'error_path'=>'from common getCampaignUpdateShareDetail function'
                    //     ]);
                    // }
                } 
                return true;
            }else{
                $message = 'Ads not updated';
                if($is_update == 403){
                    $message = 'Need admin permission';
                }
                DB::table('error_detail')->insert([
                    'message'=>$message,
                    'creative_id'=>$creative_id,
                    'user_token'=>$user_id,
                    'response_code'=>(!empty($is_update))?$is_update:0,
                    'error_path'=>'from common update campaign'
                ]);

                return false;
            }
        // }catch(Exception $e){
        //     DB::table('error_detail')->insert([
        //         'message'=>$e->getMessage(),
        //         'error_path'=>'from common getCampaignUpdateShareDetail function'
        //     ]);
        // }
    }
    public function maintainUniqueness($user_id,$selected_utm,$creative_id){
        //try{
            //dd($creative_id);
            $utm_update_id =  DB::table('utm_parameter_update')->select('ads_id','created_at')->where([
                'user_id'=>$user_id,
                'utm_parameter_name_id'=>$selected_utm
            ])->orderBy('id', 'DESC')->first(); 

            $now_date = strtotime(date('Y-m-d H:i:s')); 
            $time_diff = 50;
            if(isset($utm_update_id->created_at)){
                $created_date = strtotime($utm_update_id->created_at); 
                $time_diff = $now_date - $created_date;
            } 
             
            if(isset($utm_update_id->ads_id) && $creative_id == $utm_update_id->ads_id){ 
                if($time_diff<20){
                    return false;
                }else{
                    return true;
                } 
            }else{ 
                return true;
            }
        // }catch(Exception $e){
        //     DB::table('error_detail')->insert([
        //         'message'=>$e->getMessage(),
        //         'error_path'=>'from common maintainUniqueness function'
        //     ]);
        // }
    }

    public function updateShareFinal($user_token,$share_data,$desired_utm_parameter='',$post_data){ 
        //dd($user_token);
        $post_data = [
            "patch" => [ 
                '$set' => [ 
                    'variables'=>[ 
                            'clickUri'=>'https://www.demo.com?adsa=asd', 
                            "data"=> [
                                "com.linkedin.ads.TextAdCreativeVariables"=> [
                                    "text"=> "This is no longer a test ad description",
                                    "title"=> "This is a REAL Ad!"
                                ]
                    ]
                        ] 
                ]
            ] 
        ];   
        //$utm_curl = curl_init("https://api.linkedin.com/v2/ugcPosts/$share_data");  
        $utm_curl = curl_init("https://api.linkedin.com/v2/adCreativesV2/198458606");  
        curl_setopt($utm_curl, CURLOPT_RETURNTRANSFER, true); 
        curl_setopt($utm_curl, CURLOPT_POSTFIELDS, json_encode($post_data));
        curl_setopt($utm_curl, CURLOPT_HTTPHEADER, array( "content-type: application/json",
        //"X-Restli-Protocol-Version: 2.0.0",
        "Authorization: Bearer {$user_token}"));
         
        $share_response = curl_exec($utm_curl); 
        $response_code = curl_getinfo($utm_curl, CURLINFO_HTTP_CODE);
        return $response_code;
    }
    public function getCampaignShareDetail($user_token,$utm_capmaign_id,$selected_utm){ 
        //try{
            if(!empty($utm_capmaign_id)){
                $a_utm_capmaign_id = [];
                $final_linkedin_creative_id = '';
                $basic_final_linkedin_creative_id = '';
                $a_utm_capmaign_id = explode(',',$utm_capmaign_id);
                if(!empty($a_utm_capmaign_id)){
                    $count = -1;
                    foreach($a_utm_capmaign_id as $utm_capmaign_id){
                        $count++;   
                        $final_linkedin_creative_id .= "&campaigns[$count]=urn:li:sponsoredCampaign:$utm_capmaign_id";
                        $basic_final_linkedin_creative_id .= "&search.campaign.values[$count]=urn:li:sponsoredCampaign:$utm_capmaign_id";
                    }
                }
            } 

            $utm_curl = curl_init();  
            curl_setopt_array($utm_curl, array(  
                CURLOPT_URL => "https://api.linkedin.com/v2/adCreativesV2?q=search&$basic_final_linkedin_creative_id",  
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_ENCODING => "",
                CURLOPT_MAXREDIRS => 10,
                CURLOPT_FOLLOWLOCATION => true,
                CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                CURLOPT_TIMEOUT => 300,
                CURLOPT_CUSTOMREQUEST => "GET",
                CURLOPT_HTTPHEADER => array( "content-type: application/x-www-form-urlencoded",
                //"X-Restli-Protocol-Version: 2.0.0", 
            "Authorization: Bearer {$user_token}"),
            ));
            $all_creative_data = json_decode(curl_exec($utm_curl));
        // dd($all_creative_data);
            $a_share_data = [];
            if(!empty($all_creative_data->elements)){
                foreach($all_creative_data->elements as $creative_data){ 
                    if(!empty($creative_data->campaign)){
                        $sponser_campaign = $creative_data->campaign;
                    }else{
                        $sponser_campaign = 0;
                    }
    
                    if(isset($creative_data->reference)){
                        $a_share_data[$creative_data->id."|".$sponser_campaign."|".$creative_data->type] = $creative_data->reference;
                    }else{
                        $a_share_data[$creative_data->id."|".$sponser_campaign."|".$creative_data->type] = $creative_data->variables;
                    }
                    
                }
            }
            //dd($a_share_data);
            return $a_share_data;
        // }catch(Exception $e){
        //     DB::table('error_detail')->insert([
        //         'message'=>$e->getMessage(),
        //         'error_path'=>'from common getCampaignShareDetail function'
        //     ]);
        // }
    }
    public function getCreativeShareDetail($user_token,$utm_creative_id,$selected_utm){
        //try{
                        
            if(!empty($utm_creative_id)){
                $a_utm_creative_id = []; 
                $basic_final_linkedin_creative_id = '';
                $a_utm_creative_id = explode(',',$utm_creative_id);
                if(!empty($a_utm_creative_id)){
                    $count = -1;
                    foreach($a_utm_creative_id as $utm_creative_id){
                        $count++;    
                        $basic_final_linkedin_creative_id .= "&search.id.values[$count]=$utm_creative_id";
                    }
                }
            } 

            // dd($basic_final_linkedin_creative_id);

            $utm_curl = curl_init();  
            curl_setopt_array($utm_curl, array(  
                CURLOPT_URL => "https://api.linkedin.com/v2/adCreativesV2?q=search&$basic_final_linkedin_creative_id",  
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_ENCODING => "",
                CURLOPT_MAXREDIRS => 10,
                CURLOPT_FOLLOWLOCATION => true,
                CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                CURLOPT_TIMEOUT => 300,
                CURLOPT_CUSTOMREQUEST => "GET",
                CURLOPT_HTTPHEADER => array( "content-type: application/x-www-form-urlencoded",
                //"X-Restli-Protocol-Version: 2.0.0", 
            "Authorization: Bearer {$user_token}"),
            ));
            $all_creative_data = json_decode(curl_exec($utm_curl));
            // dd($all_creative_data->elements);
            $a_share_data = [];
            if(!empty($all_creative_data->elements)){
                foreach($all_creative_data->elements as $creative_data){
                    if(!empty($creative_data->campaign)){
                        $sponser_campaign = $creative_data->campaign;
                    }else{
                        $sponser_campaign = 0;
                    }
                    //$a_share_data[$creative_data->id."|".$sponser_campaign] = $creative_data->reference;

                    if(isset($creative_data->reference)){
                        $a_share_data[$creative_data->id."|".$sponser_campaign."|".$creative_data->type] = $creative_data->reference;
                    }else{
                        $a_share_data[$creative_data->id."|".$sponser_campaign."|".$creative_data->type] = $creative_data->variables;
                    }
                    //$a_share_data[$creative_data->id] = $creative_data->reference;
                }
            }
            // dd($a_share_data);
            return $a_share_data;
        // }catch(Exception $e){
        //     DB::table('error_detail')->insert([
        //         'message'=>$e->getMessage(),
        //         'error_path'=>'from common getCreativeShareDetail function'
        //     ]);
        // }
    }

    public function getUtmDetail(){ 
        $utm_curl = curl_init();  
        curl_setopt_array($utm_curl, array(
            //CURLOPT_URL => 'https://api.linkedin.com/v2/shares/urn:li:share:6914133899216392192', 
            //CURLOPT_URL => 'https://api.linkedin.com/v2/adCreativesV2?q=search&search.campaign.values[0]=urn:li:sponsoredCampaign:180264406', 
            CURLOPT_URL => 'https://api.linkedin.com/v2/adCreativesV2?q=search&search.account.values[0]=urn:li:sponsoredAccount:509030941', 
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_TIMEOUT => 300,
            CURLOPT_CUSTOMREQUEST => "GET",
            CURLOPT_HTTPHEADER => array( "content-type: application/x-www-form-urlencoded",
            //"X-Restli-Protocol-Version: 2.0.0", 
           "Authorization: Bearer {$this->accessBearerToken}"),
        ));
       return json_decode(curl_exec($utm_curl));
    }

    public function hello(Request $request){

        $a_utm_cron_data = DB::table('utm_parameter_cron')->where('utm_type',1)->get();
        
        // dd($a_utm_cron_data);

        if(!empty($a_utm_cron_data)){
            foreach($a_utm_cron_data as $k=>$utm_data){
                $id = $utm_data->id;
                $utm_capmaign_id = $utm_data->utm_capmaign_id;
                $utm_creative_id = $utm_data->utm_creative_id;
                $selected_utm = $utm_data->selected_utm;
                $user_token = $utm_data->user_token;
                //app(\App\Http\Controllers\LinkedinApi::class)->updateCampaignUtm($utm_capmaign_id,$selected_utm,$user_token);
                try{
                    app(\App\Http\Controllers\LinkedinApi::class)->updateCreativeUtm($utm_creative_id,$selected_utm,$user_token);
                }catch(Exception $e){

                    // dd('exit');
                    DB::table('error_detail')->insert([
                        'message'=>$e->getMessage(),
                        'creative_id'=>$utm_creative_id,
                        'user_token'=>Crypt::decryptString($user_token),
                        'error_path'=>'from common updateCampaign cron'
                    ]);
                }
                DB::table('utm_parameter_cron')->where('id',$id)->delete(); 
            }
        }

        echo "All operation are done";
    }
    

    

}