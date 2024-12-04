"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const googleMaps_1 = require("../services/googleMaps");
const Location_1 = __importDefault(require("../models/Location"));
// Crear un router
const router = (0, express_1.Router)();
// Ruta GET para obtener detalles de un lugar por su place_id
router.get("/from-place-id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const place_id = req.query.place_id;
    if (!place_id || typeof place_id !== "string") {
        res.status(400).json({ message: "El parámetro place_id es requerido y debe ser un string." });
        return;
    }
    try {
        // Llamada a la función de Google Maps para obtener los detalles
        const placeDetails = yield (0, googleMaps_1.getPlaceDetails)(place_id);
        res.status(200).json(placeDetails);
    }
    catch (error) {
        console.error("Error obteniendo detalles del lugar:", error);
        res.status(500).json({ message: "Error obteniendo detalles del lugar", error: error instanceof Error ? error.message : error });
    }
}));
// Ruta POST para guardar un lugar por su place_id
router.post("/from-place-id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const place_id = req.query.place_id;
    if (!place_id || typeof place_id !== "string") {
        res.status(400).json({ message: "El parámetro place_id es requerido y debe ser un string." });
        return;
    }
    try {
        const placeDetails = yield (0, googleMaps_1.getPlaceDetails)(place_id);
        // Aquí, debería guardar los detalles del lugar en tu base de datos (MongoDB)
        const newLocation = new Location_1.default({
            address: placeDetails.address,
            place_id: place_id,
            latitude: placeDetails.latitude,
            longitude: placeDetails.longitude,
        });
        yield newLocation.save();
        res.status(201).json({
            message: "Lugar guardado correctamente",
            location: placeDetails,
        });
    }
    catch (error) {
        console.error("Error guardando el lugar:", error);
        res.status(500).json({ message: "Error guardando el lugar", error: error instanceof Error ? error.message : error });
    }
}));
// Ruta PUT para actualizar un lugar por su place_id
router.put("/from-place-id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const place_id = req.query.place_id;
    const { address, latitude, longitude } = req.body;
    if (!place_id || typeof place_id !== "string") {
        res.status(400).json({ message: "El parámetro place_id es requerido y debe ser un string." });
        return;
    }
    try {
        // Buscar el lugar por place_id y actualizar sus detalles
        const updatedLocation = yield Location_1.default.findOneAndUpdate({ place_id }, { address, latitude, longitude }, { new: true } // Retorna el documento actualizado
        );
        if (!updatedLocation) {
            res.status(404).json({ message: "Lugar no encontrado" });
            return;
        }
        res.status(200).json({
            message: "Lugar actualizado correctamente",
            location: updatedLocation,
        });
    }
    catch (error) {
        console.error("Error actualizando el lugar:", error);
        res.status(500).json({ message: "Error actualizando el lugar", error: error instanceof Error ? error.message : error });
    }
}));
// Ruta DELETE para eliminar un lugar por su place_id
router.delete("/from-place-id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const place_id = req.query.place_id;
    if (!place_id || typeof place_id !== "string") {
        res.status(400).json({ message: "El parámetro place_id es requerido y debe ser un string." });
        return;
    }
    try {
        const deletedLocation = yield Location_1.default.findOneAndDelete({ place_id });
        if (!deletedLocation) {
            res.status(404).json({ message: "Lugar no encontrado" });
            return;
        }
        res.status(200).json({
            message: "Lugar eliminado correctamente",
            location: deletedLocation,
        });
    }
    catch (error) {
        console.error("Error eliminando el lugar:", error);
        res.status(500).json({ message: "Error eliminando el lugar", error: error instanceof Error ? error.message : error });
    }
}));
exports.default = router;
