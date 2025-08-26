import mongoose from "mongoose";

const ComplaintSchema = new mongoose.Schema(
  {
    name: String,
    age: Number,
    problem: String,
    photo: {
      data: Buffer,       // yaha actual binary image data store hoga
      contentType: String // yaha file ka mimetype (image/png etc.)
    },
  },
  { timestamps: true }
);

export default mongoose.model("Complaint", ComplaintSchema);
