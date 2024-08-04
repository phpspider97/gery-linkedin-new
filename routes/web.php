<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// Route::get('/', function(){
//     //return redirect()->to('admin-login');
// });

Route::fallback(function(){
    return view('welcome');
}); 

//Auth::routes();

//Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])->name('home');

// Route::get('/head', function () {
//     return response('Hello World', 200)
//                   ->header('xyz', 'some value111')
//                   ->header( 'Access-Control-Allow-Origin', '*' )
//                   ->header( 'Access-Control-Allow-Headers', '*' )
//                   ->header( 'Access-Control-Expose-Headers', 'xyz' )

//                   ;
// });


Route::any('/testing', function(){
    
    return 'testing';
});