import mongoose from 'mongoose';

const translationSchema = new mongoose.Schema({
  en: String,
  ka: String,
});

// Updated price schema to support multiple currencies
const priceSchema = new mongoose.Schema({
  usd: {
    type: Number,
    required: true
  },
  gel: {
    type: Number,
    required: true
  },
  eur: {
    type: Number,
    default: 0
  }
}, { _id: false });

const productSchema = new mongoose.Schema({
  title: translationSchema,
  // Updated to use the price schema instead of a single number
  price: {
    type: priceSchema,
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
  },
  description: translationSchema // Added description field as it's used in your component
}, { timestamps: true });

export default mongoose.model('Product', productSchema);