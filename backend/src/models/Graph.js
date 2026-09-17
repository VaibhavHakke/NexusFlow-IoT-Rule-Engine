const mongoose = require("mongoose");

const graphSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    nodes: {
      type: Array,
      default: [],
    },
    edges: {
      type: Array,
      default: [],
    },
    compiled: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Graph", graphSchema);