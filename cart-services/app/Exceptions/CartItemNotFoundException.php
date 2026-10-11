<?php

namespace App\Exceptions;

use RuntimeException;;

class CartItemNotFoundException extends RuntimeException

{
    public function _construct(int $id)
    {
        parent::__construct("Cart item with ID {$id} not found.");
    }
}