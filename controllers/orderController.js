import Order from "../models/order.js";

// Create a new order
export async function createOrder(req, res) {
    // Ensure only customers can create orders
    if (!isCustomer) {
        res.json({
            message: "Please login as customer to create orders"
        }); 
    }

    try {
        // Fetch the latest order to generate a new orderId
        // get the id of latest order what we created
        const   latestOrder = await Order.find().sort({ date: -1 }).limit(1);

        let orderId;
        //chaeck there are not orders yet.
        if (latestOrder.length === 0) {
            // if the first order (there are not orders yet)should begin with 'CBC0001'.
            orderId = "CBC0001";
        } else {
            const currentOrderId = latestOrder[0]?.orderId || "CBC0000";
            // get only the number from 'CBC####' and remove 'CBC' from 'CBC####' 
            const numberString = currentOrderId.replace("CBC", "");
            const number = parseInt(numberString, 10);
            const newNumber = (number + 1).toString().padStart(4, "0");
            orderId = "CBC" + newNumber;
        }

        // Prepare order data
        const newOrderData = req.body;

        const newProductArray = []

        for(let i=0; i<newOrderData.orderedItems.length;i++){
            const product =await Product.findOne({
                productId : newOrderData.orderedItems[i].productId
            })

            if(product== null){
                res.json({
                    message : "Product with id "
                    +newOrderData.orderedItems[i].
                    productId+" not found"
                })
                return
            }
             newProductArray[i] = {
            name : product.productName,
            price : product.price,
            quantity : newOrderData.orderedItems
            [i].quantity,
            Image : product.Images[0]
           }
        }

       console.log(newProductArray)

       newOrderData.orderedItems= newProductArray

        newOrderData.orderId = orderId;
        newOrderData.email = req.user.email;

        // Save order to database
        const order = new Order(newOrderData);
        await order.save();

        res.status(201).json({
            message: "Order created"
         
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
