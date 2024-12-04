import { Router } from "express";
import { getLocations, updateLocation, deleteLocation, createLocation, saveLocationFromPlaceID, fromPlaceId } from '../controllers/locationController';
import { updateMissingFields } from "../controllers/locationController";

// Crear un router
const router = Router();

// Rutas
router.get("/", getLocations); // Ruta para obtener todas las ubicaciones
router.post("/", createLocation); // Ruta para crear una nueva ubicación
router.put("/:id", updateLocation); // Ruta para actualizar una ubicación por ID
router.delete("/:id", deleteLocation); // Ruta para eliminar una ubicación por ID
router.patch("/update-missing-fields", updateMissingFields); // Nueva ruta para actualizar documentos

router.get("/from-place-id", fromPlaceId);
// Nueva ruta para guardar ubicación desde place_id
router.post("/from-place-id", saveLocationFromPlaceID);

export default router;



