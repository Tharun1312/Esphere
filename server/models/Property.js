import mongoose from "mongoose";

const PropertySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true },
    location: { type: String, required: true },
    size: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    surveyNumber: { type: String }, // NEW FIELD ADDED
    image: { type: String },

    ownerName: { type: String, required: true },
    ownerPhone: { type: String, required: true },
    ownerEmail: { type: String, required: true },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Property", PropertySchema);
