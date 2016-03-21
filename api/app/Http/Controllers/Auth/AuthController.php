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

    public static function getToken(){
        $request = Request::instance();
        // Now we can get the content from it
        $request_body = $request->getContent();
        $data = json_decode($request_body);

        if(strcmp($data->username, "narakAdmin") == 0 && strcmp($data->password, "123#nimda") == 0){
            return self::encryption(date("F j, Y, g:i a"));
        }else{
            return Response::json(array(), 400);
        }
    }

    private static function encryption($plaintext){

        $key = pack('H*', "bcb04b7e103a0cd8b54763051cef08bc55abe029fdebae5e1d417e2ffb2a00a3");

        $iv_size = mcrypt_get_iv_size(MCRYPT_RIJNDAEL_128, MCRYPT_MODE_CBC);
        $iv = mcrypt_create_iv($iv_size, MCRYPT_RAND);

        $ciphertext = mcrypt_encrypt(MCRYPT_RIJNDAEL_128, $key,
            $plaintext, MCRYPT_MODE_CBC, $iv);

        $ciphertext = $iv . $ciphertext;

        $ciphertext_base64 = base64_encode($ciphertext);

        return $ciphertext_base64;
    }

    public static function validateToken($token){

        $timeStr = self::decription($token);
        if(strtotime($timeStr)){
            return true;
        }
        return false;
    }

    private static function decription($ciphertext_base64){
        $key = pack('H*', "bcb04b7e103a0cd8b54763051cef08bc55abe029fdebae5e1d417e2ffb2a00a3");
        $iv_size = mcrypt_get_iv_size(MCRYPT_RIJNDAEL_128, MCRYPT_MODE_CBC);
        $ciphertext_dec = base64_decode($ciphertext_base64);

        $iv_dec = substr($ciphertext_dec, 0, $iv_size);

        $ciphertext_dec = substr($ciphertext_dec, $iv_size);

        $plaintext_dec = mcrypt_decrypt(MCRYPT_RIJNDAEL_128, $key, $ciphertext_dec, MCRYPT_MODE_CBC, $iv_dec);

        return $plaintext_dec;
    }
}
