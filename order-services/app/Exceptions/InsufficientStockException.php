<?php

namespace App\Exceptions;

use RuntimeException;

//stok produk kurang dari jumlah di keranjang
class InsufficientStockException extends RuntimeException
{

}