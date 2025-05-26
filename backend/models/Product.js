import mongoose from 'mongoose';


const translationSchema = new mongoose.Schema({
  en: String,
  ka: String,
});
const productSchema = new mongoose.Schema({
  title: translationSchema,
  price: {
    type: Number,
    required: true
  },
  rating: {
    type: Number,
    default: 5
  },
  image: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: true
  }
}, { timestamps: true });

export default mongoose.model('Product', productSchema);