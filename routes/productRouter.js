import express from 'express';
import { createProduct, deleteProduct, getProduct, getProductByName , getProductById, upadateProduct } from '../controllers/productController.js';

const productRouter = express.Router();

productRouter.get('/',getProduct);
productRouter.get('/byName', getProductByName)
productRouter.get("/:productId", getProductById)
productRouter.post('/',createProduct);
productRouter.delete("/:productId",deleteProduct);
productRouter.put("/:productId", upadateProduct)

export default productRouter;