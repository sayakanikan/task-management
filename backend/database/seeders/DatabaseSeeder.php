<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Default User',
            'username' => 'default_user',
            'email' => 'user@gmail.com',
        ]);

        User::factory()->create([
            'name' => 'Default User 2',
            'username' => 'user',
            'email' => 'user2@gmail.com',
        ]);

        DB::table('tasks')->insert([
            'user_id' => 1,
            'title' => 'Test task',
            'description' => 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Officiis blanditiis necessitatibus harum ipsum voluptatem voluptates?',
            'status' => 'todo',
            'deadline' => '2026-10-10',
            'created_by' => 1
        ]);
    }
}
