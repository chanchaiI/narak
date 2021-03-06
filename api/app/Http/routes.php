<?php

/*
|--------------------------------------------------------------------------
| Routes File
|--------------------------------------------------------------------------
|
| Here is where you will register all of the routes in an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

Route::post('/v1/auth/', [ function() {
    return App\Http\Controllers\Auth\AuthController::getUser();
}]);

Route::get('/v1/auth/', [ function() {
    $token = Request::header('token');
    if(App\Http\Controllers\Auth\AuthController::validateToken($token)){
        return Response::json(array(),200);
    }else{
        return Response::json(array(),400);
    }
}]);

Route::post('/v1/auth/login', [ function() {
    return App\Http\Controllers\Auth\AuthController::getToken();
}]);

Route::get('/v1/post/committee', [ function() {
    return App\Http\Controllers\Post\PostController::getCommitteeAward();
}]);

Route::get('/v1/post/popular', [ function() {
    return App\Http\Controllers\Post\PostController::getPopularAward();
}]);

Route::get('/v1/post/luckyvote', [ function() {
    return App\Http\Controllers\Post\PostController::getLuckyVote();
}]);

Route::get('/v1/post/{id?}/upload', [ function($id = null) {
    return App\Http\Controllers\Post\PostController::checkUploaded($id);
}]);

Route::post('/v1/post/{id?}/upload', [ function($id = null) {
    return App\Http\Controllers\Post\PostController::upload($id);
}]);

Route::get('/v1/post/random/{randomNO?}', [ function($randomNO = null) {
    return App\Http\Controllers\Post\PostController::getPostByRandomNO($randomNO);
}]);

Route::get('/v1/post/{id?}', [ function($id = null) {
    return App\Http\Controllers\Post\PostController::getPostById($id);
}]);

Route::get('/v1/post/{pageNumber}/popular/', [ function($pageNumber) {
    return App\Http\Controllers\Post\PostController::getPopularVote($pageNumber);
}]);

Route::get('/v1/post/{category_id?}/page/{pageNumber}/', [ function($category_id = null, $pageNumber = 1) {
    return App\Http\Controllers\Post\PostController::getPosts($category_id, $pageNumber);
}]);

Route::get('/v1/post/keyword/{keyword?}/page/{pageNumber}/', [ function($keyword = null, $pageNumber = 1) {
    return App\Http\Controllers\Post\PostController::getPostsByKeyword($keyword, $pageNumber);
}]);

Route::post('/v1/vote/{id?}', [ function($id = null) {
    return App\Http\Controllers\Post\VoteController::createVote($id);
}]);

Route::get('/v1/post/{order}/{size}/{page}/{filter}', [ function($order = null, $size, $page, $filter) {
    $token = Request::header('token');
    if($token && App\Http\Controllers\Auth\AuthController::validateToken($token)){
        return App\Http\Controllers\Post\PostController::getPostsAdmin($order, $size, $page, $filter);
    }else{
        return Response::json(array(), 400);
    }
}]);

Route::get('/v1/post/{order}/{size}/{page}', [ function($order = null, $size, $page) {
    $token = Request::header('token');
    if($token && App\Http\Controllers\Auth\AuthController::validateToken($token)){
        return App\Http\Controllers\Post\PostController::getPostsAdmin($order, $size, $page);
    }else{
        return Response::json(array(), 400);
    }
}]);

Route::put('/v1/post/unpublish', [ function() {

    $token = Request::header('token');
    if($token && App\Http\Controllers\Auth\AuthController::validateToken($token)){
        $request = Request::instance();
        $request_body = $request->getContent();
        $idList = json_decode($request_body)->idList;
        return App\Http\Controllers\Post\PostController::unpublish($idList);
    }else{
        return Response::json(array(), 400);
    }
}]);

Route::put('/v1/post/publish', [ function() {

    $request = Request::instance();
    // Now we can get the content from it
    $request_body = $request->getContent();

    $idList = json_decode($request_body)->idList;

    return App\Http\Controllers\Post\PostController::publish($idList);
}]);

Route::post('/v1/post/delete', [ function() {

    $request = Request::instance();
    // Now we can get the content from it
    $request_body = $request->getContent();

    $idList = json_decode($request_body)->idList;

    return App\Http\Controllers\Post\PostController::delete($idList);
}]);



/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| This route group applies the "web" middleware group to every route
| it contains. The "web" middleware group is defined in your HTTP
| kernel and includes session state, CSRF protection, and more.
|
*/

Route::group(['middleware' => ['web']], function () {
    //
});
