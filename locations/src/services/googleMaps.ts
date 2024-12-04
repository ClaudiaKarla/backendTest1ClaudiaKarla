import axios from "axios";

const GOOGLE_MAPS_API_KEY = "AIzaSyBJbZ9MwmkF-Q_yg75J9Mjfu8OssftM64A";
const BASE_URL = "https://maps.googleapis.com/maps/api/place/details/json";

// Obtiene los detalles de un lugar usando su place_id
export const getPlaceDetails = async (place_id: string) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        place_id,
        key: GOOGLE_MAPS_API_KEY,
      },
    });

    const result = response.data.result;

    // Retorna la dirección, latitud y longitud
    return {
      address: result.formatted_address,
      latitude: result.geometry.location.lat,
      longitude: result.geometry.location.lng,
    };
  } catch (error) {
    throw new Error("No se pudo obtener los detalles del lugar desde Google Maps.");
  }
};
