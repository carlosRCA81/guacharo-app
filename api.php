<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;

/*
|--------------------------------------------------------------------------
| API Routes - ANALIZADOR CRCA
|--------------------------------------------------------------------------
*/

// RUTA 1: Guardar el sorteo en la base de datos de Ohio
Route::post('/guardar', function (Request $request) {
    try {
        DB::table('historial_sorteos')->updateOrInsert(
            ['fecha' => $request->fecha, 'hora' => $request->hora],
            [
                'num' => $request->num,
                'animal' => $request->animal,
                'tipo' => $request->tipo,
                'created_at' => now(),
                'updated_at' => now()
            ]
        );
        return response()->json(['status' => 'success', 'message' => 'Dato blindado en la nube']);
    } catch (\Exception $e) {
        return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
    }
});

// RUTA 2: Recuperar todo el historial para el análisis de patrones
Route::get('/historial', function () {
    return DB::table('historial_sorteos')
             ->orderBy('fecha', 'asc')
             ->orderBy('hora', 'asc')
             ->get();
});
