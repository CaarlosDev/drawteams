<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePlayerRequest;
use App\Http\Requests\UpdatePlayerRequest;
use App\Models\Player;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PlayerController extends Controller
{
    public function getPlayers(Request $request) {
        if ($user = Auth::user()) {
            return response($user->players);
        }
        
        return response(['message' => 'User not found.']);
    }

    public function getPlayerById(Request $request) {
        if ($player = Player::find($request->id)) {
            return response($player);
        }

        return response(['message' => 'Player not found.']);
    }

    public function createPlayer(StorePlayerRequest $request) {
        $request->validated();

        $player = Player::create([
            'name' => $request->name,
            'ability' => $request->ability,
            'is_goal_keeper' => $request->is_goal_keeper,
            'user_id' => $request->user()->id
        ]);

        return response($player);
    }

    public function updatePlayer(UpdatePlayerRequest $request) {
        $request->validated();

        if ($player = Player::find($request->id)) {
            $newInfo = $request->only(['name', 'ability', 'is_goal_keeper']);
            $player->update($newInfo);

            return response($player);
        }
        
        return response(['message' => 'Player not found.']);
    }

    public function deletePlayer(Request $request) {
        if ($player = Player::find($request->id)) {
            $player->delete();
            return response('', 204);
        }

        return response(['message' => 'Player not found.']);
    }
}
