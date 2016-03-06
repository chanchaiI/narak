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

Route::get('/v1/post/{id?}/upload', [ function($id = null) {
    return App\Http\Controllers\Post\PostController::checkUploaded($id);
}]);

Route::post('/v1/post/{id?}/upload', [ function($id = null) {
    return App\Http\Controllers\Post\PostController::upload($id);
}]);

Route::get('/v1/post/{id?}', [ function($id = null) {
    return App\Http\Controllers\Post\PostController::getPostById($id);
}]);

Route::get('/v1/post/{size?}/popular/', [ function($size = 3) {
    return App\Http\Controllers\Post\PostController::getPopularVote($size);
}]);

Route::get('/v1/post/{category_id?}/page/{pageNumber}/', [ function($category_id = null, $pageNumber = 1) {
    return App\Http\Controllers\Post\PostController::getPosts($category_id, $pageNumber);
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
