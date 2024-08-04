<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Exception;
use Illuminate\Support\Facades\Crypt;

class CreativeCron extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'creative:cron';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    { 
        $a_utm_cron_data = DB::table('utm_parameter_cron')->where('utm_type',2)->get();
        if(!empty($a_utm_cron_data)){
            foreach($a_utm_cron_data as $k=>$utm_data){
                $id = $utm_data->id;
                $utm_creative_id = $utm_data->utm_creative_id;
                $selected_utm = $utm_data->selected_utm;
                $user_token = $utm_data->user_token;
                try{
                    app(\App\Http\Controllers\LinkedinApi::class)->updateCreativeUtm($utm_creative_id,$selected_utm,$user_token);
                }catch(Exception $e){
                    DB::table('error_detail')->insert([
                        'message'=>$e->getMessage(),
                        'creative_id'=>$utm_creative_id,
                        'user_token'=>Crypt::decryptString($user_token),
                        'error_path'=>'from common updateCreative cron'
                    ]);
                }
                DB::table('utm_parameter_cron')->where('id',$id)->delete();
            }
        } 
    }
}
