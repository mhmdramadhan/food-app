<?php

namespace App\Http\Controllers;

use App\Models\Table;
use Illuminate\Http\Request;

class TableController extends Controller
{
    // List semua meja
    public function index()
    {
        $tables = Table::all();
        return response()->json($tables);
    }
}
