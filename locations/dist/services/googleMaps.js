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
exports.getPlaceDetails = void 0;
const axios_1 = __importDefault(require("axios"));
const GOOGLE_MAPS_API_KEY = "AIzaSyBJbZ9MwmkF-Q_yg75J9Mjfu8OssftM64A";
const BASE_URL = "https://maps.googleapis.com/maps/api/place/details/json";
// Obtiene los detalles de un lugar usando su place_id
const getPlaceDetails = (place_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.get(BASE_URL, {
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
    }
    catch (error) {
        throw new Error("No se pudo obtener los detalles del lugar desde Google Maps.");
    }
});
exports.getPlaceDetails = getPlaceDetails;
