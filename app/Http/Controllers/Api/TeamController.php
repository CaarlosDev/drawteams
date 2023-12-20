<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class TeamController extends Controller {
    public function drawTeams(Request $request) {
        $teamSize = $request->players_per_team;
        $teams = [];

        $goalKeepers = array_filter($request->players, function($player) {
            return $player['is_goal_keeper'] == true;
        });

        $players = array_filter($request->players, function($player) {
            return $player['is_goal_keeper'] == false;
        });

        if ( count($players) < ($teamSize * 2) - 2 || $goalKeepers < 2 ) {
            return response()->json([
                'message' => 'Not enough players to complete at least 2 teams.'
            ], 422);
        }

        foreach ($goalKeepers as $goalKeeper) {
            $key = count(array_keys($teams));
            $teams[$key + 1] = [$goalKeeper];
        }

        foreach (array_keys($teams) as $key) {
            $teams[$key] = $this->buildTeam($teams[$key], $players, $teamSize);
        }

        if ($players != []) {
            foreach ($players as $player) {
                $lastIndex = count(array_keys($teams));

                if (count($teams[$lastIndex]) < $teamSize) {
                    array_push($teams[$lastIndex], $player);
                } else {
                    $teams[$lastIndex + 1] = [$player];
                }

                $key = array_search($player, $players);
                array_splice($players, $key, 1);
            }
        }

        return response()->json($teams);
   }

   public function buildTeam($team, &$players, $desiredTeamSize) {
        $newTeam = $team;

        foreach($players as $player) {
            if (count($newTeam) < $desiredTeamSize) {
                array_push($newTeam, $player);
                $key = array_search($player, $players);
                array_splice($players, $key, 1);
            }
        }

        return $newTeam;
   }
}
