<?php

namespace App\Http\Controllers;

use App\Models\Table;
use Illuminate\Http\Request;

class TableController extends Controller
{
    // List semua meja
    public function index()
    {
        $tables = Table::with(['orders' => function ($query) {
            $query->where('status', 'open')->latest();
        }])->get();

        // map supaya hanya ambil current_order_id
        $tables = $tables->map(function ($table) {
            $table->current_order_id = $table->orders->first()->id ?? null;
            unset($table->orders); // optional, biar response lebih clean
            return $table;
        });
        
        return response()->json($tables);
    }
}
