<?php

namespace App\Http\Controllers\Post;

use Request;
use App\Http\Controllers\Controller;
use Response;
use App\Post;

class VoteController extends Controller
{


    public static function createVote()
    {
        $request = Request::instance();
        // Now we can get the content from it
        $request_body = $request->getContent();
        $data = json_decode($request_body);


        if(self::hasVoted($data->post_id, $data->facebook_id)){
            return Response::json(array(
                'result' => false,
                'message' => 'Voted'
            ), 400);
        }else{
            return Vote::create([
                'post_id' => $data->post_id,
                'facebook_id' => $data->facebook_id,
                'email' => $data->email,
            ]);
        }
    }

//
//    public static function checkVoted(){
//
//        if(self::hasVoted()){
//            return Response::json(array(
//                'result' => true,
//                'message' => 'Voted'
//            ));
//        }else{
//            return Response::json(array(
//                'result' => false,
//                'message' => 'Voted'
//            ));
//        }
//    }

    private static function hasVoted($post_id, $facebook_id){
        return Vote::where('facebook_id', $facebook_id)->count > 0;
    }

}