import Order from "../models/order.js";

// Create a new order
export async function createOrder(req, res) {
    // Ensure only customers can create orders
    if (req.user?.type !== "customer") {
        return res.status(403).json({
            message: "Please login as customer to create orders"
        });
    }

    try {
        // Fetch the latest order to generate a new orderId
        const latestOrder = await Order.find().sort({ date: -1 }).limit(1);

        let orderId;
        if (latestOrder.length === 0) {
            orderId = "CBC0001";
        } else {
            const currentOrderId = latestOrder[0]?.orderId || "CBC0000";
            const numberString = currentOrderId.replace("CBC", "");
            const number = parseInt(numberString, 10);
            const newNumber = (number + 1).toString().padStart(4, "0");
            orderId = "CBC" + newNumber;
        }

        // Prepare order data
        const newOrderData = req.body;
        newOrderData.orderId = orderId;
        newOrderData.email = req.user.email;

        // Save order to database
        const newOrder = new Order(newOrderData);
        await newOrder.save();

        res.status(201).json({
            message: "Order created successfully"
         
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

// Get orders for a specific user
export async function getOrders(req, res) {
    try {
        const orders = await Order.find({ email: req.user.email });
        res.json(orders);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}
