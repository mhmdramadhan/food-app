<?php

namespace App\Http\Controllers;

use App\Models\Food;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Table;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    // Buka order baru
    public function open(Request $request)
    {
        $data = $request->validate([
            'table_id' => 'required|exists:tables,id',
        ]);

        $table = Table::findOrFail($data['table_id']);
        if ($table->status === 'occupied') {
            return response()->json(['message' => 'Meja sudah terisi'], 400);
        }

        DB::beginTransaction();
        try {
            $order = Order::create([
                'table_id' => $table->id,
                'user_id' => $request->user()->id,
                'status' => 'open',
                'opened_at' => now(),
            ]);

            $table->update(['status' => 'occupied']);

            DB::commit();
            return response()->json($order, 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Gagal membuka order'], 500);
        }
    }

    // List semua order
    public function index()
    {
        $orders = Order::with(['table', 'user'])->get();
        return response()->json($orders);
    }

    // Detail order (dengan item)
    public function show($id)
    {
        $order = Order::with(['items.food', 'table', 'user'])->findOrFail($id);
        return response()->json($order);
    }

    // Tambah makanan ke order
    public function addItem(Request $request, $id)
    {
        $data = $request->validate([
            'food_id' => 'required|exists:foods,id',
            'quantity' => 'required|integer|min:1'
        ]);

        $order = Order::findOrFail($id);
        if ($order->status !== 'open') {
            return response()->json(['message' => 'Order sudah ditutup'], 400);
        }

        $food = Food::findOrFail($data['food_id']);
        $subtotal = $food->price * $data['quantity'];

        $item = OrderItem::create([
            'order_id' => $order->id,
            'food_id' => $food->id,
            'quantity' => $data['quantity'],
            'price' => $food->price,
            'subtotal' => $subtotal,
        ]);

        // update total harga
        $order->update([
            'total_price' => $order->items()->sum('subtotal')
        ]);

        return response()->json($item, 201);
    }

    // Tutup order
    public function close($id)
    {
        $order = Order::with('table')->findOrFail($id);
        if ($order->status === 'closed') {
            return response()->json(['message' => 'Order sudah ditutup'], 400);
        }

        DB::beginTransaction();
        try {
            $order->update([
                'status' => 'closed',
                'closed_at' => now(),
                'total_price' => $order->items()->sum('subtotal')
            ]);

            $order->table->update(['status' => 'available']);

            DB::commit();
            return response()->json($order);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Gagal menutup order'], 500);
        }
    }

    public function receipt($id)
    {
        $order = Order::with(['items.food', 'table', 'user'])->findOrFail($id);

        if ($order->status !== 'closed') {
            return response()->json(['message' => 'Order belum ditutup, tidak bisa cetak struk'], 400);
        }

        // Data untuk PDF
        $data = [
            'order' => $order,
        ];

        // Load view blade untuk PDF
        $pdf = Pdf::loadView('pdf.receipt', $data);

        // Bisa download atau langsung stream
        return $pdf->stream("receipt_order_{$order->id}.pdf");
    }
}
