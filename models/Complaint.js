import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  problem: { type: String, required: true },
  photo: {
    data: { type: Buffer },       // Binary data
    contentType: { type: String } // MIME type
  }
}, { timestamps: true });

export default mongoose.model("Complaint", complaintSchema);
