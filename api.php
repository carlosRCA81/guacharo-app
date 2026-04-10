<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;

/*
|--------------------------------------------------------------------------
| API CRCA - DESBLOQUEO DE COMUNICACIÓN GITHUB -> OHIO
|--------------------------------------------------------------------------
*/

// Middleware manual para permitir que cualquier sitio (GitHub) se conecte
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit; // Finaliza temprano para peticiones de verificación del navegador
}

// RUTA PARA GUARDAR
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
        return response()->json(['status' => 'success']);
    } catch (\Exception $e) {
        return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
    }
});

// RUTA PARA CARGAR HISTORIAL
Route::get('/historial', function () {
    try {
        $datos = DB::table('historial_sorteos')
                 ->orderBy('fecha', 'desc')
                 ->orderBy('hora', 'desc')
                 ->get();
        return response()->json($datos);
    } catch (\Exception $e) {
        return response()->json([]);
    }
});
