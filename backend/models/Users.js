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
  cart: {
    type: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'Product' 
        },
        quantity: {
          type: Number,
          default: 1,
          min: 1
        },
        addedAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    default: []
  },
  wishlist: {
    type: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'Product' 
        },
        addedAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    default: []
  }
});

export default mongoose.models.Users || mongoose.model('Users', UsersSchema);