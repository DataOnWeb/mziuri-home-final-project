import express from 'express';
import { getProduct, getProducts } from '../controllers/products.js'

const ProductsRouter = express.Router();


ProductsRouter.get('/', getProducts)
ProductsRouter.get('/:id', getProduct)

export default ProductsRouter