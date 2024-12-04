"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const locationsRoutes_1 = __importDefault(require("./routes/locationsRoutes"));
const googleMapsRouter_1 = __importDefault(require("./routes/googleMapsRouter"));
const app = (0, express_1.default)();
const PORT = 5000;
// Middleware para parsear JSON
app.use(express_1.default.json());
app.use("/api", googleMapsRouter_1.default);
console.log("Rutas configuradas: /api/from-place-id");
// Conexión a MongoDB
mongoose_1.default
    .connect("mongodb://127.0.0.1:27017/locationsDB")
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("Failed to connect to MongoDB", err));
// Ruta raíz
app.get("/", (req, res) => {
    res.send("Bienvenido a la API de ubicaciones");
});
// Rutas de la API
app.use("/api/locations", locationsRoutes_1.default);
// Iniciar el servidor
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
