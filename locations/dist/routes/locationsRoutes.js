"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const locationController_1 = require("../controllers/locationController");
const locationController_2 = require("../controllers/locationController");
// Crear un router
const router = (0, express_1.Router)();
// Rutas
router.get("/", locationController_1.getLocations); // Ruta para obtener todas las ubicaciones
router.post("/", locationController_1.createLocation); // Ruta para crear una nueva ubicación
router.put("/:id", locationController_1.updateLocation); // Ruta para actualizar una ubicación por ID
router.delete("/:id", locationController_1.deleteLocation); // Ruta para eliminar una ubicación por ID
router.patch("/update-missing-fields", locationController_2.updateMissingFields); // Nueva ruta para actualizar documentos
router.get("/from-place-id", locationController_1.fromPlaceId);
// Nueva ruta para guardar ubicación desde place_id
router.post("/from-place-id", locationController_1.saveLocationFromPlaceID);
exports.default = router;
