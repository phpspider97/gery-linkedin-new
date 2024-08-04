<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
/**
* The Artisan commands provided by your application.
*
* @var array
*/
protected $commands = [
Commands\TestCron::class,
Commands\CampaignCron::class,
Commands\CreativeCron::class,
];

/**
* Define the application's command schedule.
*
* @param \Illuminate\Console\Scheduling\Schedule $schedule
* @return void
*/
protected function schedule(Schedule $schedule)
{
    $schedule->command('test:cron')->everyMinute();
    $schedule->command('campaign:cron')->everyMinute();
    $schedule->command('creative:cron')->everyMinute();
}

/**
* Register the commands for the application.
*
* @return void
*/
protected function commands()
{
$this->load(__DIR__.'/Commands');

require base_path('routes/console.php');
}
}