import mongoose from "mongoose";

const UsersSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please provide an username"],
    unique: [true, "username should be unique"],
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
});

export default mongoose.model("Users", UsersSchema);