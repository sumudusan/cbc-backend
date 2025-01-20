import express from 'express';
import { createProduct, deleteProduct, getProduct, getProductByName } from '../controllers/productController.js';

const productRouter = express.Router();

productRouter.get('/',getProduct);
productRouter.get('/byName', getProductByName)
productRouter.post('/',createProduct);
productRouter.delete("/:productId",deleteProduct);

export default productRouter;