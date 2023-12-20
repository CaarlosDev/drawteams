<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function getUser(Request $request) {
        $userId = $request->user()->id;
        $user = User::with('players')->where('id', $userId)->first();
        return response($user);
    }
    
    public function deleteUser(Request $request) {
        $user = $request->user();
        $user->delete();
        return response('', 204);
    }
}
