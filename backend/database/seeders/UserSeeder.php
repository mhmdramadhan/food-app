<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'name' => 'Pelayan 1',
            'email' => 'pelayan@test.com',
            'password' => Hash::make('password'),
            'role' => 'pelayan',
        ]);

        User::create([
            'name' => 'Kasir 1',
            'email' => 'kasir@test.com',
            'password' => Hash::make('password'),
            'role' => 'kasir',
        ]);
    }
}
