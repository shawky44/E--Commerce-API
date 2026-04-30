import Stripe from "stripe";
import Order from "../models/Order.js";

const getStripe = () => new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
  const stripe = getStripe();
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ message: "Order ID is required" });
    }

    const order = await Order.findById(orderId).populate("items.product");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (order.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Only pending orders can be paid" });
    }

    const line_items = order.items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.product.name,
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      metadata: {
        orderId: order._id.toString(),
        userId: req.user._id.toString(),
      },
      success_url: `${process.env.CLIENT_URL}/payment-success?order=${order._id}`,
      cancel_url: `${process.env.CLIENT_URL}/payment-cancel?order=${order._id}`,
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error("Stripe Checkout Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const handleStripeWebhook = async (req, res) => {
  const stripe = getStripe();
  const signature = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (error) {
    console.error("Webhook verification failed:", error.message);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const orderId = session.metadata.orderId;
      const order = await Order.findById(orderId);

      if (order && order.status === "pending") {
        order.status = "paid";
        order.paidAt = new Date();
        await order.save();
        console.log(`✅ Order ${orderId} marked as paid`);
      }
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error("Webhook handling error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
