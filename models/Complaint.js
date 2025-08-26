import mongoose from "mongoose";

const PhotoSchema = new mongoose.Schema({
  filename: String,
  originalname: String,
  path: String,
  mimetype: String,
  size: Number
}, { _id: false });

const ComplaintSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  problem: { type: String, required: true },
  photo: { type: PhotoSchema, default: null }
}, { timestamps: true });

export default mongoose.model("Complaint", ComplaintSchema);
