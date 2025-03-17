import mongoose, { Model } from "mongoose";





const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
    },
    description: {
      type: String,
    },
    status: {
      type: String,
      enum: ["ToDo", "In Progress", "Done"],
      default: "ToDo",
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    dueDate: Date,

    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      require: true,
    },

    CreatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);


const Task = mongoose.model ("task",TaskSchema)

export default Task;