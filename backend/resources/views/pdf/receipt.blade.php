<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Receipt Order #{{ $order->id }}</title>
    <style>
        body { font-family: sans-serif; font-size: 12px; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { border: 1px solid #ccc; padding: 5px; text-align: left; }
    </style>
</head>
<body>
    <h2>Struk Pesanan</h2>
    <p><strong>Order ID:</strong> {{ $order->id }}</p>
    <p><strong>Meja:</strong> {{ $order->table->table_number }}</p>
    <p><strong>Pelayan:</strong> {{ $order->user->name }}</p>
    <p><strong>Tanggal:</strong> {{ $order->closed_at }}</p>

    <table>
        <thead>
            <tr>
                <th>Makanan/Minuman</th>
                <th>Qty</th>
                <th>Harga</th>
                <th>Subtotal</th>
            </tr>
        </thead>
        <tbody>
            @foreach($order->items as $item)
                <tr>
                    <td>{{ $item->food->name }}</td>
                    <td>{{ $item->quantity }}</td>
                    <td>{{ number_format($item->price, 0, ',', '.') }}</td>
                    <td>{{ number_format($item->subtotal, 0, ',', '.') }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <h3>Total: Rp {{ number_format($order->total_price, 0, ',', '.') }}</h3>
</body>
</html>
