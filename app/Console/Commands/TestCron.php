<?php
   
namespace App\Console\Commands;
   
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class TestCron extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'test:cron';
    
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
     * @return mixed
     */
    public function handle()
    {
        //\Log::info("Cron is working fine!");
     
        /*
           Write your database logic we bellow:
           Item::create(['name'=>'hello new']);
        */
        // $a_utm_cron_data = DB::table('utm_parameter_cron')->where('is_cron',0)->get();
        // if(!empty($a_utm_cron_data)){
        //     foreach($a_utm_cron_data as $k=>$utm_data){
        //         $id = $utm_data->id;
        //         $utm_capmaign_id = $utm_data->utm_capmaign_id;
        //         $selected_utm = $utm_data->selected_utm;
        //         $user_token = $utm_data->user_token;
        //         app(\App\Http\Controllers\LinkedinApi::class)->updateCampaignUtm($utm_capmaign_id,$selected_utm,$user_token);
        //         DB::table('utm_parameter_cron')->where('id',$id)->delete();
        //     }
        // }
        
    }
}