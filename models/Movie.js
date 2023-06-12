import mongoose from "mongoose";

const Schema = mongoose.Schema;

const MovieSchema = new Schema({
  title: {
    type: String,
    required: [true, "Ingrese el titulo please"],
  },
  plot: {
    type: String,
    required: [true, "Ingrese el plot please"],
  },
});

export default mongoose.models.Movie || mongoose.model("Movie", MovieSchema);
