<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PlayerController;
use App\Http\Controllers\Api\TeamController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::controller(AuthController::class)->group(function() {
    Route::post('/register', 'register');
    Route::post('/login', 'login');
});

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [UserController::class, 'getUser']);

    Route::controller(PlayerController::class)->group(function() {
        Route::post('/players', 'createPlayer');
        Route::get('/players', 'getPlayers');
        Route::get('/players/{id}', 'getPlayerById')->whereNumber('id');
        Route::put('/players/{id}', 'updatePlayer')->whereNumber('id');
        Route::delete('/players/{id}', 'deletePlayer')->whereNumber('id');
    });

    Route::post('/draw-teams', [TeamController::class, 'drawTeams']);
});