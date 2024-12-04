import express from "express";
import mongoose from "mongoose";
import locationsRoutes from "./routes/locationsRoutes";
import googleMapsRouter from "./routes/googleMapsRouter";

const app = express();
const PORT = 5000;

// Middleware para parsear JSON
app.use(express.json());

app.use("/api", googleMapsRouter);
console.log("Rutas configuradas: /api/from-place-id");

// Conexión a MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/locationsDB")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB", err));

// Ruta raíz
app.get("/", (req, res) => {
  res.send("Bienvenido a la API de ubicaciones");
});

// Rutas de la API
app.use("/api/locations", locationsRoutes);

// Iniciar el servidor
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
