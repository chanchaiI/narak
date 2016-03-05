<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddPostColumn extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (Schema::hasTable('posts')) {
            Schema::table('posts', function ($table) {
                $table->string('kid_name')->unique();
                $table->string('kid_nickname');
                $table->integer('kid_year');
                $table->integer('kid_month');
                $table->string('image_path');
                $table->integer('user_id')->unsigned();
                $table->foreign('user_id')
                    ->references('id')->on('users')
                    ->onDelete('cascade');
            });
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //

        if (Schema::hasTable('posts')) {
            Schema::table('posts', function ($table) {
                $table->dropColumn(['kid_name', 'kid_nickname', 'kid_year', 'user_id']);
            });
        }
    }
}
