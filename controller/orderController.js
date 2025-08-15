const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// CREATE ORDER
const createOrder = async (req, res) => {
  try {
    const userId = req.user.id; // dari middleware JWT
    const { produkId, quantity } = req.body; // satu produk per order

    if (!produkId || !quantity) {
      return res
        .status(400)
        .json({ message: "Product ID and quantity are required" });
    }

    // Cek produk & stok
    const product = await prisma.product.findUnique({
      where: { id: produkId },
    });

    if (!product) {
      return res
        .status(404)
        .json({ message: `Product with ID ${produkId} not found` });
    }

    if (product.stock < quantity) {
      return res
        .status(400)
        .json({ message: `Insufficient stock for ${product.name}` });
    }

    // Transaksi create order + orderItem + update stock
    const newOrder = await prisma.$transaction(async (tx) => {
      // Buat order
      const order = await tx.order.create({
        data: {
          userId,
          status: "PENDING",
        },
      });

      // Buat orderItem
      await tx.orderItem.create({
        data: {
          orderId: order.id,
          productId: produkId,
          quantity: quantity,
          price: product.price,
        },
      });

      // Update stok
      await tx.product.update({
        where: { id: produkId },
        data: { stock: product.stock - quantity },
      });

      return order;
    });

    return res
      .status(201)
      .json({ message: "Order created successfully", orderId: newOrder.id });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// GET order history by customer
const getOrderHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createOrder, getOrderHistory };
