import mongoose, { Schema } from "mongoose";


const OrgSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique:true,
  },
  members: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    },
  ],
});

const Organization = mongoose.model("Organization",OrgSchema);

export default Organization;