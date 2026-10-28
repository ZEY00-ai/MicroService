<?php

namespace App\Models;

use DateTimeInterface;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Override;

class orders extends Model
{
   protected $fillable = [
    'user_id',
    'status',
    'total_amount'
   ];

   protected $casts = [
    'total_amount'=>'integer'
   ];

   public function items()
   {
    return $this->hasMany(orderItem::class,'order_id');
   }

   protected function serializeDate(DateTimeInterface $date) : string
   {
    return $date->format('c');
   }
}
