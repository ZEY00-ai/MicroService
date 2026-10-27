<?php

namespace App\Exceptions;

use RuntimeException;

//ketika service ain tidak bisa menjawaban dari sevice lain
class ServiceUnavailableException extends RuntimeException
{

}