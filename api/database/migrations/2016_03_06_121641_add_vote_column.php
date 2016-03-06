<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddVoteColumn extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (Schema::hasTable('votes')) {
            Schema::table('votes', function ($table) {
                $table->string('email')->unique();
                $table->string('facebook_id')->unique();
                $table->integer('post_id');
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
        if (Schema::hasTable('votes')) {
            Schema::table('votes', function ($table) {
                $table->dropColumn(['email', 'facebook_id', 'post_id']);
            });
        }
    }
}
