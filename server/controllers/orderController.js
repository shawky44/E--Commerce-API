import Cart from "../models/Cart.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

export const createOrder = async (req, res) => {
  // The flow is [Cart → Validation → Order → Stock Update → Clear Cart]
  try {
    const { shippingAddress, paymentMethod } = req.body;
    const userId = req.user._id;

    if (!shippingAddress || !paymentMethod) {
      return res.status(400).json({
        message: "Shipping address and payment method are required",
      });
    }
    // Get cart + populate products
    const cart = await Cart.findOne({ user: userId }).populate("items.product"); // populate the product details

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Check cart not empty
    if (cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    let totalPrice = 0;

    // Validate stock for all products
    for (let item of cart.items) {
      if (!item.product) {
        return res.status(400).json({ message: "Invalid product in cart" });
      }

      if (item.quantity > item.product.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for product: ${item.product.name}`,
        });
      }

      // Calculate total price
      totalPrice += item.product.newPrice * item.quantity;
    }

    // Create order items snapshot (freeze price at purchase time)
    const orderItems = cart.items.map((item) => ({
      product: item.product._id,
      quantity: item.quantity,
      price: item.product.newPrice, // snapshot price "3shan lw etghayar ba3d kda ma y2assarsh 3la el order"
    }));

    const order = await Order.create({
      user: userId,
      items: orderItems,
      totalPrice,
      shippingAddress,
      paymentMethod,
      status: "pending",
    });

    // Decrease product stock
    for (let item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { quantity: -item.quantity },
      });
    }

    // Clear cart "ba3d ma el order et3amel w el stock et2assar"
    cart.items = [];
    await cart.save();

    // Return order
    res.status(201).json({
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const cancelOrder = async (req, res) => {
  // The flow is [Order → increase stock → cancel status]
  try {
    const userId = req.user._id;
    const orderId = req.params.id;

    // Get order
    const order = await Order.findById(orderId).populate("items.product");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check ownership
    if (order.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Check status
    if (order.status !== "pending") {
      return res.status(400).json({
        message: "Order cannot be cancelled anymore",
      });
    }

    // Restore product stock "3shan lw el user 3ayez yelghi el order, yrga3 el stock zay ma kan"
    for (let item of order.items) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { quantity: item.quantity },
      });
    }

    // Update order status
    order.status = "cancelled";
    await order.save();

    res.status(200).json({
      message: "Order cancelled successfully",
      order,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Prevent changing cancelled orders
    if (order.status === "cancelled") {
      return res.status(400).json({
        message: "Cannot update a cancelled order",
      });
    }

    const currentStatus = order.status;

    // Define allowed transitions [pending → paid → shipped → delivered ] msh el3aks
    const validTransitions = {
      pending: ["paid"],
      paid: ["shipped"],
      shipped: ["delivered"],
      delivered: [],
    };

    // Check invalid backward / illegal transitions
    if (!validTransitions[currentStatus].includes(status)) {
      return res.status(400).json({
        message: `Invalid status transition from ${currentStatus} to ${status}`,
      });
    }

    // Add timestamps
    if (status === "paid") {
      order.paidAt = new Date();
    }

    if (status === "delivered") {
      order.deliveredAt = new Date();
    }

    order.status = status;

    await order.save();

    res.status(200).json({
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    // Pagination 3shan lw 3ayez ageb orders kteer, ma ygebhash kolha fe request wa7da w y2asser 3la performance
    const page = req.query.page || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.product", "name price")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const userId = req.user._id;
    const page = req.query.page || 1;
    const orders = await Order.find({ user: userId })
      .populate("items.product", "name price")
      .sort({ createdAt: -1 })
      .limit(10)
      .skip((page - 1) * 10);

    res.status(200).json({
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getOrderDetails = async (req, res) => {
  try {
    const userId = req.user._id;
    const orderId = req.params.id;
    const order = await Order.findById(orderId)
      .populate("items.product", "name price")
      .populate("user", "name email");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // ensure ownership (user can only see his order)
    if (order.user._id.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    res.status(200).json({
      order,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
