<?php

namespace App\Http\Requests;

use Override;

class CreateOrderRequest extends ApiFormRequest
{
    public function rules(): array
    {
        return [
            'user_id' => ['required', 'integer', 'min:1'],
        ];
    }

    #[Override]
    public function messages(): array
    {
        return [
            'user_id.required' => 'Field user_id wajib diisi',
            'user_id.integer'  => 'Field user_id harus berupa angka',
            'user_id.min'      => 'Field user_id harus lebih dari 0',
        ];
    }
}
