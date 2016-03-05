<?php

namespace App\Http\Controllers\Post;

//
//use Input;
//use Validator;
use Request;
use App\Http\Controllers\Controller;
use Response;
use App\Post;

class PostController extends Controller
{
    public static function checkUploaded(){

    }

    public static function hasUploaded($user_id){
        $uploaded = Post::where('user_id', $user_id)->first();
        return $uploaded != null;
    }

    public static function upload($id)
    {

        $request = Request::instance();
        // Now we can get the content from it
        $request_body = $request->getContent();

        $request_array = explode(',data=', $request_body);
        if(count($request_array) < 2) {

            return Response::json(array(
                'message' => 'Request Fail'
            ), 500);
        }else if(self::hasUploaded($id)){
            return Response::json(array(
                'data' => 'Already Uploaded'
            ), 400);
        }else{

            $encoded_img = str_replace('data:image/png;base64,', '', $request_array[0]);
            $encoded_img = str_replace(' ', '+', $encoded_img);
            $decoded_data = base64_decode($encoded_img);

            $destinationPath = public_path() . '/uploads/images/'; // upload path
            $extension = 'jpg'; // getting image extension
            $fileName = rand(11111, 99999) . '.' . $extension; // renaming image
            $success = file_put_contents($destinationPath . $fileName, $decoded_data);


            $data = json_decode($request_array[1]);
            $post = Post::create([
                'kid_name' => $data->name,
                'kid_nickname' => $data->nickname,
                'kid_year' => $data->years,
                'kid_month' => $data->months,
                'image_path' => $fileName,
                'user_id' => $id
            ]);

            return Response::json(array(
                'error' => !$success,
                'status_code' => $success ? 200: 400,
                'data' => $success ? $post : 'Upload Fail'
            ));
        }

//        // getting all of the post data
//        $file = array('image' => Input::file('data'));
//        // setting up rules
//        $rules = array('image' => 'required',); //mimes:jpeg,bmp,png and for max size max:10000
//        // doing the validation, passing post data, rules and the messages
//        $validator = Validator::make($file, $rules);
//        if ($validator->fails()) {
//            return Response::json(array(
//                'error' => true,
//                'status_code' => 500
//            ));
//        }
//        else {
        // checking file is valid.
//            if (Input::file('image')->isValid()) {
//                $destinationPath = 'uploads'; // upload path
//                $extension = Input::file('image')->getClientOriginalExtension(); // getting image extension
//                $fileName = rand(11111,99999).'.'.$extension; // renameing image
//                Input::file('image')->move($destinationPath, $fileName); // uploading file to given path
//
//                $model = new Post;
//
//
//                return Response::json(array(
//                    'error' => false,
//                    'status_code' => 200
//                ));
//            }
//            else {
//                // sending back with error message.
//                return Response::json(array(
//                    'error' => true,
//                    'status_code' => 500
//                ));
//            }
//        }
    }
}