import Product from '../models/Product.js';
import cache from '../utils/cache.js';


export const getProducts = async (req, res) => {
    try {
        const key = 'products'
        const cachedProducts = cache.get(key)

        if (cachedProducts) {
             res.status(200).json(cachedProducts)
            return
        }


        const products = await Product.find()

        cache.set(key, products);

        res.status(200).json(products)

    } catch (err) {
        res.status(500).json({ err: err })
    }
}

export const getProduct =  async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
