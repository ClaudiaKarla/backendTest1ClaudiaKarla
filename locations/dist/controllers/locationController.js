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
exports.fromPlaceId = exports.saveLocationFromPlaceID = exports.deleteLocation = exports.updateLocation = exports.updateMissingFields = exports.createLocation = exports.getLocations = void 0;
const Location_1 = __importDefault(require("../models/Location"));
const googleMaps_1 = require("../services/googleMaps");
const getLocations = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Fetching locations...");
        const locations = yield Location_1.default.find();
        res.status(200).json(locations);
    }
    catch (error) {
        console.error("Error fetching locations:", error);
        res.status(500).json({
            message: "Error fetching locations",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
exports.getLocations = getLocations;
// Crear una nueva ubicación
const createLocation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { address, place_id, latitude, longitude } = req.body;
        if (!address || !place_id || latitude === undefined || longitude === undefined) {
            res.status(400).json({ message: "All fields are required" });
        }
        const existingLocation = yield Location_1.default.findOne({ place_id });
        if (existingLocation) {
            res.status(400).json({ message: "Location already exists" });
        }
        const newLocation = new Location_1.default({
            address,
            place_id,
            latitude,
            longitude,
        });
        yield newLocation.save();
        res.status(201).json({ message: "Location created successfully", location: newLocation });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        res.status(500).json({ message: "Error creating location", error: errorMessage });
    }
});
exports.createLocation = createLocation;
const updateMissingFields = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield Location_1.default.updateMany({ address: { $exists: false } }, // Solo documentos sin 'address'
        {
            $set: {
                address: "Sin dirección",
                latitude: 0,
                longitude: 0,
            },
        });
        res.status(200).json({ message: `${result.modifiedCount} documents updated` });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        res.status(500).json({ message: "Error updating documents", error: errorMessage });
    }
});
exports.updateMissingFields = updateMissingFields;
// Actualizar una ubicación existente
const updateLocation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { address, place_id, latitude, longitude } = req.body;
        const updatedLocation = yield Location_1.default.findByIdAndUpdate(id, { address, place_id, latitude, longitude }, { new: true, runValidators: true });
        if (!updatedLocation) {
            res.status(404).json({ message: "Location not found" });
            return;
        }
        res.status(200).json({ message: "Location updated successfully", location: updatedLocation });
    }
    catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : "Unknown error";
        res.status(500).json({ message: "Error updating location", error: errorMessage });
    }
});
exports.updateLocation = updateLocation;
// Eliminar una ubicación
const deleteLocation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deletedLocation = yield Location_1.default.findByIdAndDelete(id);
        if (!deletedLocation) {
            res.status(404).json({ message: "Location not found" });
            return;
        }
        res.status(200).json({ message: "Location deleted successfully" });
    }
    catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : "Unknown error";
        res.status(500).json({ message: "Error deleting location", error: errorMessage });
    }
});
exports.deleteLocation = deleteLocation;
// Guardar una ubicación a partir de un place_id
const saveLocationFromPlaceID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { place_id } = req.body;
    if (!place_id) {
        res.status(400).json({ message: "El place_id es obligatorio." });
    }
    try {
        // Llama a la API de Google Maps para obtener los detalles del lugar
        const placeDetails = yield (0, googleMaps_1.getPlaceDetails)(place_id);
        // Verifica si la ubicación ya existe
        const existingLocation = yield Location_1.default.findOne({ place_id });
        if (existingLocation) {
            res.status(400).json({ message: "La ubicación ya existe en la base de datos." });
        }
        // Crea un nuevo documento en MongoDB
        const newLocation = new Location_1.default({
            address: placeDetails.address,
            place_id,
            latitude: placeDetails.latitude,
            longitude: placeDetails.longitude,
        });
        yield newLocation.save();
        res.status(201).json({
            message: "Ubicación guardada exitosamente.",
            location: newLocation,
        });
    }
    catch (error) {
        console.error("Error al guardar ubicación desde place_id:", error);
        res.status(500).json({
            message: "Error al guardar la ubicación desde el place_id.",
            error: error instanceof Error ? error.message : "Error desconocido",
        });
    }
});
exports.saveLocationFromPlaceID = saveLocationFromPlaceID;
const fromPlaceId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { place_id } = req.query; // Captura el place_id desde la query
        if (!place_id) {
            res.status(400).json({ message: "El parámetro place_id es obligatorio." });
        }
        const placeDetails = yield (0, googleMaps_1.getPlaceDetails)(place_id);
        res.status(200).json(placeDetails);
    }
    catch (error) {
        res.status(500).json({ message: "Error al obtener los detalles del lugar.", error });
    }
});
exports.fromPlaceId = fromPlaceId;
