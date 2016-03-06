<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    protected $fillable = [
        'kid_name', 'kid_nickname', 'kid_year', 'kid_month', 'user_id', 'image_path', 'random_no', 'category_id'
    ];

    public function user()
    {
        return $this->hasOne('App\User');
    }
}
