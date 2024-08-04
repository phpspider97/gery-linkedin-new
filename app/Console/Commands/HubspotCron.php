<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Exception;
use Illuminate\Support\Facades\Crypt;

class HubspotCron extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'hubspot:cron';

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
        $a_hubspot_cron_data = DB::table('linkedin_sync_hubspot')->get();
        if(!empty($a_hubspot_cron_data)){
            foreach($a_hubspot_cron_data as $k=>$hubspot_data){ 
                try{
                    app(\App\Http\Controllers\HubspotApi::class)->linkedinSyncHubspot($hubspot_data);
                }catch(Exception $e){
                    DB::table('error_detail')->insert([
                        'message'=>$e->getMessage(),
                        'creative_id'=>000,
                        'user_token'=>$hubspot_data->user_id,
                        'error_path'=>'from hubspot cron'
                    ]);
                }
            }
        } 
    }
} 