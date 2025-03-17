

import mongoose from "mongoose";


const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      require: true,
      unique: true,
    },
    fullname: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      require: true,
      minLength: 6,
    },
    roles: [
      {
        organization: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Organization",
        },
        role: {
          type: String,
          enum: ["Admin", "Manager", "Member"],
          default: "Member",
        },
      },
    ],
  },
  { timestamps: true }
);



const User = mongoose.model("User",userSchema)


export default User;