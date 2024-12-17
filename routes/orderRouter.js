import express from "express";
import { createOrder, getOrders } from "../controllers/orderController.js";

const orderRouter = express.Router();

// Routes
orderRouter.post("/",  createOrder); // Create a new order
orderRouter.get("/",  getOrders);    // Get orders for a user

export default orderRouter;
