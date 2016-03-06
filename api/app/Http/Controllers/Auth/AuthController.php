<?php

namespace App\Http\Controllers\Auth;

use App\User;
use Request;
use Response;
use App\Http\Controllers\Controller;

class AuthController extends Controller
{

    private static function create($data)
    {
        return User::create([
            'name' => $data->name,
            'facebook_id' => $data->id,
            'email' => $data->email
        ]);
    }

    public static function getUser(){

        $request = Request::instance();
        // Now we can get the content from it
        $request_body = $request->getContent();
        $data = json_decode($request_body);

        $user = User::where('facebook_id', $data->id)->first();
        if($user == null){
           return self::create($data);
        }
        return $user;
    }
}
