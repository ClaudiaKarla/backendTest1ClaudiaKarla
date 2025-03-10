import mongoose from "mongoose";

const locationSchema = new mongoose.Schema({
  address: { type: String, required: true },
  place_id: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true }
});

const Location = mongoose.model("Location", locationSchema);

export default Location;
