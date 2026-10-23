<?php

namespace App\Http\Controllers;

use App\Models\orderItem;
use App\Http\Requests\StoreorderItemRequest;
use App\Http\Requests\UpdateorderItemRequest;

class OrderItemController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreorderItemRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(orderItem $orderItem)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(orderItem $orderItem)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateorderItemRequest $request, orderItem $orderItem)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(orderItem $orderItem)
    {
        //
    }
}
