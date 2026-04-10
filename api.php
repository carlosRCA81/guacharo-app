<?php
// PERMISOS MAESTROS DE CONEXIÓN
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, X-Requested-With, Authorization");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit; // Finaliza la verificación del navegador
}

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;

// RUTA PARA GUARDAR DATOS
Route::post('/guardar', function (Request $request) {
    try {
        DB::table('historial_sorteos')->updateOrInsert(
            ['fecha' => $request->fecha, 'hora' => $request->hora],
            [
                'num' => $request->num,
                'animal' => $request->animal,
                'tipo' => $request->tipo,
                'updated_at' => now()
            ]
        );
        return response()->json(['status' => 'success']);
    } catch (\Exception $e) {
        return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
    }
});

// RUTA PARA LEER EL HISTORIAL COMPLETADO
Route::get('/historial', function () {
    return DB::table('historial_sorteos')
             ->orderBy('fecha', 'desc')
             ->orderBy('hora', 'desc')
             ->get();
});
