const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const createProduk = async (req, res) => {
  try {
    const { nama, harga, stok } = req.body;

    if (Number(harga) < 1000) {
      return res.status(400).json({
        message: "Harga harus lebih dari 1000",
      });
    }

    if (Number(stok) < 1) {
      return res.status(400).json({
        message: "Stok harus lebih dari 0",
      });
    }

    const produk = await prisma.product.create({
      data: {
        name: nama,
        price: Number(harga),
        stock: Number(stok),
      },
    });
    return res.status(201).json({
      message: "Produk created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const updateProduk = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama, harga, stok } = req.body;
    const findProduk = await prisma.product.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!findProduk) {
      return res.status(404).json({
        message: "Produk not found",
      });
    }

    if (Number(harga) < 1000) {
      return res.status(400).json({
        message: "Harga harus lebih dari 1000",
      });
    }

    if (Number(stok) < 1) {
      return res.status(400).json({
        message: "Stok harus lebih dari 0",
      });
    }

    const update = await prisma.product.update({
      data: {
        name: nama ? nama : findProduk.name,
        price: harga ? Number(harga) : findProduk.price,
        stock: stok ? Number(stok) : findProduk.stock,
      },
      where: {
        id: Number(id),
      },
    });

    return res.status(200).json({
      message: "Produk updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const deleteProduk = async (req, res) => {
  try {
    const { id } = req.params;
    const findProduk = await prisma.product.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!findProduk) {
      return res.status(404).json({
        message: "Produk not found",
      });
    }

    await prisma.product.delete({
      where: {
        id: Number(id),
      },
    });

    return res.status(200).json({
      message: "Produk deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
const getAllProduk = async (req, res) => {
  try {
    const getAll = await prisma.product.findMany();
    return res.status(200).json({
      message: "All produk",
      data: getAll,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

module.exports = {
  createProduk,
  updateProduk,
  deleteProduk,
  getAllProduk,
};
