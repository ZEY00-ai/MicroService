<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class orderItem extends Model
{
    // tabel order_items tidak punya created_at / updated_at
    public $timestamps = false;

    protected $fillable = [
        'order_id',
        'product_id',
        'product_name',
        'unit_price',
        'quantity',
        'subtotal',
    ];

    protected $casts = [
        'product_id' => 'integer',
        'unit_price' => 'integer',
        'quantity'   => 'integer',
        'subtotal'   => 'integer',
    ];

    // order_id tidak ditampilkan di JSON, karena item sudah berada di dalam order
    protected $hidden = ['order_id'];

    public function order(): BelongsTo
    {
        return $this->belongsTo(orders::class);
    }
}