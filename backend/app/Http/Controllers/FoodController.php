<?php

namespace App\Http\Controllers;

use App\Models\Food;
use Illuminate\Http\Request;

class FoodController extends Controller
{
    // List makanan
    public function index()
    {
        return response()->json(Food::all());
    }

    // Tambah makanan
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:100',
            'price' => 'required|numeric|min:0',
            'category' => 'nullable|string|max:50',
        ]);

        $food = Food::create($data);
        return response()->json($food, 201);
    }

    // Update makanan
    public function update(Request $request, Food $food)
    {
        $data = $request->validate([
            'name' => 'required|string|max:100',
            'price' => 'required|numeric|min:0',
            'category' => 'nullable|string|max:50',
        ]);

        $food->update($data);
        return response()->json($food);
    }

    // Hapus makanan
    public function destroy(Food $food)
    {
        $food->delete();
        return response()->json(null, 204);
    }
}
