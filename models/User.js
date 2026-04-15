import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  progress: {
    bubbleScore: {
      type: Number,
      default: 0
    },
    bibleScore: {
      type: Number,
      default: 0
    }
  }

});

export default mongoose.model("User", userSchema);