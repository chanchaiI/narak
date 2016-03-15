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
    public static function checkUploaded($user_id)
    {
        if (self::hasUploaded($user_id)) {
            $post = self::getPostByUserId($user_id);
            return Response::json(array(
                'result' => true,
                'data' => $post
            ));
        } else {
            return Response::json(array(
                'result' => false,
                'message' => 'No Upload'
            ));
        }
    }

    private static function hasUploaded($user_id)
    {
        return Post::where('user_id', $user_id)->count() > 0;
    }

    public static function getPostById($id)
    {
        return Post::where('id', $id)->first();
    }

    private static function getPostByUserId($user_id)
    {
        return Post::where('user_id', $user_id)->first();
    }

    public static function getPosts($category_id = null, $pageNumber = 1, $pageSize = 8)
    {
        if ($category_id != 'all') {
            return Response::json(array(
                'data' => Post::where('category_id', intval($category_id))->latest()->get()->forPage(intval($pageNumber), $pageSize),
                'total' => Post::where('category_id', intval($category_id))->count()
            ));
        }
        return Response::json(array(
            'data' => Post::latest()->get()->forPage(intval($pageNumber), $pageSize),
            'total' => Post::all()->count()
        ));
    }

    public static function getPopularVote($size = 3)
    {
        return Post::all()->sortByDesc('vote_count')->values()->forPage(1, $size);
    }

    private static function randomNumber($min, $max)
    {
        $random_no = rand($min, $max);
        if (Post::where('random_no', $random_no)->first() != null) {
            return self::randomNumber($min, $max);
        } else {
            return $random_no;
        }
    }

    private static function write_random_no($image, $x, $y, $random_no, $fontSize, $fontColor)
    {
        $font = 'fonts/db_helvethaicamon_x_bd_v3.2-webfont.ttf';
        list($r, $g, $b) = sscanf($fontColor, "#%02x%02x%02x");
        $fontColorResource = imagecolorallocate($image, $r, $g, $b);
        imagettftext($image, $fontSize, 0, $x, $y, $fontColorResource, $font, $random_no);
    }

    public static function upload($id)
    {

        $request = Request::instance();
        // Now we can get the content from it
        $request_body = $request->getContent();

        $request_array = explode(',data=', $request_body);
        if (count($request_array) < 2) {
            return Response::json(array(
                'message' => 'Request Fail'
            ), 500);
        } else if (self::hasUploaded($id)) {
            return Response::json(array(
                'message' => 'Already Uploaded'
            ), 400);
        } else {

            $encoded_img = str_replace('data:image/png;base64,', '', $request_array[0]);
            $encoded_img = str_replace(' ', '+', $encoded_img);
            $decoded_data = base64_decode($encoded_img);

            $imageFile = imagecreatefromstring($decoded_data);

            if ($imageFile !== false) {
                $template = json_decode($request_array[1])->template;

                $destinationPath = public_path() . "/../.." . '/uploads/images/'; // upload path
                $extension = 'jpg'; // getting image extension
                $random_no = self::randomNumber(1111, 9999);
                self::write_random_no($imageFile, $template->position->id->x, $template->position->id->y, $random_no, 15, $template->font->color);
                $fileName = $random_no . '.' . $extension; // renaming image
                $success = imagejpeg($imageFile, $destinationPath . $fileName);


                $baby = json_decode($request_array[1])->baby;
                $post = Post::create([
                    'kid_name' => $baby->name,
                    'kid_nickname' => $baby->nickname,
                    'kid_year' => $baby->years,
                    'kid_month' => $baby->months,
                    'random_no' => $random_no,
                    'image_path' => $fileName,
                    'category_id' => $baby->category_id,
                    'user_id' => $id
                ]);

                return Response::json(array(
                    'error' => !$success,
                    'status_code' => $success ? 200 : 400,
                    'data' => $success ? $post : 'Upload Fail'
                ));
            } else {
                return Response::json(array(
                    'error' => true,
                    'message' => 'Please upload proper image file.'
                ), 400);
            }
        }
    }
}