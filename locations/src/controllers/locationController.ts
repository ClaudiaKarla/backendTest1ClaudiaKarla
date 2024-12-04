import { RequestHandler } from "express";
import { Request, Response } from "express";
import Location from "../models/Location";
import { getPlaceDetails } from "../services/googleMaps";

export const getLocations = async (req: Request, res: Response) => {
  try {
    console.log("Fetching locations...");
    const locations = await Location.find();
    res.status(200).json(locations);
  } catch (error) {
    console.error("Error fetching locations:", error);
    res.status(500).json({
      message: "Error fetching locations",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Crear una nueva ubicación
export const createLocation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { address, place_id, latitude, longitude } = req.body;

    if (!address || !place_id || latitude === undefined || longitude === undefined) {
      res.status(400).json({ message: "All fields are required" });
    }

    const existingLocation = await Location.findOne({ place_id });
    if (existingLocation) {
      res.status(400).json({ message: "Location already exists" });
    }

    const newLocation = new Location({
      address,
      place_id,
      latitude,
      longitude,
    });

    await newLocation.save();
    res.status(201).json({ message: "Location created successfully", location: newLocation });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ message: "Error creating location", error: errorMessage });
  }
};

export const updateMissingFields: RequestHandler = async (req, res) => {
  try {
      const result = await Location.updateMany(
          { address: { $exists: false } }, // Solo documentos sin 'address'
          {
              $set: {
                  address: "Sin dirección",
                  latitude: 0,
                  longitude: 0,
              },
          }
      );
      res.status(200).json({ message: `${result.modifiedCount} documents updated` });
  } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      res.status(500).json({ message: "Error updating documents", error: errorMessage });
  }
};


// Actualizar una ubicación existente
export const updateLocation: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { address, place_id, latitude, longitude } = req.body;

    const updatedLocation = await Location.findByIdAndUpdate(
      id,
      { address, place_id, latitude, longitude },
      { new: true, runValidators: true }
    );

    if (!updatedLocation) {
      res.status(404).json({ message: "Location not found" });
      return;
    }

    res.status(200).json({ message: "Location updated successfully", location: updatedLocation });
  } catch (error) {
    const errorMessage = (error instanceof Error) ? error.message : "Unknown error";
    res.status(500).json({ message: "Error updating location", error: errorMessage });
  }
};

// Eliminar una ubicación
export const deleteLocation: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedLocation = await Location.findByIdAndDelete(id);

    if (!deletedLocation) {
      res.status(404).json({ message: "Location not found" });
      return;
    }

    res.status(200).json({ message: "Location deleted successfully" });
  } catch (error) {
    const errorMessage = (error instanceof Error) ? error.message : "Unknown error";
    res.status(500).json({ message: "Error deleting location", error: errorMessage });
  }
};

// Guardar una ubicación a partir de un place_id
export const saveLocationFromPlaceID = async (req: Request, res: Response): Promise<void> => {
  const { place_id } = req.body;

  if (!place_id) {
    res.status(400).json({ message: "El place_id es obligatorio." });
  }

  try {
    // Llama a la API de Google Maps para obtener los detalles del lugar
    const placeDetails = await getPlaceDetails(place_id);

    // Verifica si la ubicación ya existe
    const existingLocation = await Location.findOne({ place_id });
    if (existingLocation) {
      res.status(400).json({ message: "La ubicación ya existe en la base de datos." });
    }

    // Crea un nuevo documento en MongoDB
    const newLocation = new Location({
      address: placeDetails.address,
      place_id,
      latitude: placeDetails.latitude,
      longitude: placeDetails.longitude,
    });

    await newLocation.save();

    res.status(201).json({
      message: "Ubicación guardada exitosamente.",
      location: newLocation,
    });
  } catch (error) {
    console.error("Error al guardar ubicación desde place_id:", error);
    res.status(500).json({
      message: "Error al guardar la ubicación desde el place_id.",
      error: error instanceof Error ? error.message : "Error desconocido",
    });
  }
};


export const fromPlaceId = async (req: Request, res: Response): Promise<void> => {
  try {
    const { place_id } = req.query; // Captura el place_id desde la query
    if (!place_id) {
      res.status(400).json({ message: "El parámetro place_id es obligatorio." });
    }

    const placeDetails = await getPlaceDetails(place_id as string);
    res.status(200).json(placeDetails);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los detalles del lugar.", error });
  }
};








