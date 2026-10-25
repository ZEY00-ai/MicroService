<?php

namespace App\Http\Requests;

use Illuminate\Validation\Rule;

class ListOrdersRequest extends ApiFormRequest
{
    public function rules(): array
    {
        return [
            'status' => ['nullable', Rule::in(['PENDING', 'PAID'])],
        ];
    }

    public function messages(): array
    {
        return [
            'status.in' => 'Status harus PENDING atau PAID',
        ];
    }
}
