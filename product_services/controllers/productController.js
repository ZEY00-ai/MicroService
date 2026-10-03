const productModel = require("../models/productModel");

// GET ambbil semua
async function index(req, res) {
  try {
    const products = await productModel.getAllProducts();
    res.status(200).json({
      message: "Berhasil mengambil data produk",
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil data produk",
      error: error.message,
    });
  }
}

async function GetProductById(req, res) {
  try {
    const { id } = req.params;
    const products = await productModel.getProductById(id);
    if (!products) {
      return res.status(404).json({
        message: "produk atau data tidak di temukan",
      });
    }
    res.status(200).json({
      message: "berhasil mengambil data bedasarkan id",
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      message: "gagal mengambil data bedasarkan id",
      error: error.message,
    });
  }
}

const MAX_IMAGE_BYTES = 2 * 1024 * 1024;
const BASE64_REGEX = /^[A-Za-z0-9+/]+={0,2}$/;

function ValidateImage(image, res) {
  if (
    image === undefined ||
    image === null ||
    (typeof image === 'string' && image.trim() === "")
  ) {
    return res.status(400).json({
      message: "image tidak boleh kosong",
    });
  }

  if (typeof image !== "string") {
    return res.status(400).json({
      message: "image harus berupa string base64 yang valid",
    });
  }
  
  const base64String = image
    .trim()
    .replace(/^data:image\/(png|jpe?g);base64,/i, "");

  if (!BASE64_REGEX.test(base64String) || base64String.length % 4 !== 0) {
    return res.status(400).json({
      message: "image harus berupa string base64 yang valid",
    });
  }

  if (Buffer.byteLength(base64String, "base64") > MAX_IMAGE_BYTES) {
    return res.status(400).json({
      message: "image tidak boleh lebih dari 2MB",
    });
  }

  return { cleanedImage: base64String };
}

async function CreateProduct(req, res) {
  try {
    const { name, description, price, stock, image } = req.body;
    if (!name || !description || !price || !stock || image == null) {
      return res.status(400).json({
        message: "name,description,price,stock,image tidak boleh kosong atau wajib di isi",
      });
    }

    //image validation
    const imageValidation = ValidateImage(image, res);
    if (!imageValidation.error) {
      return res.status(400).json({
        message: imageValidation.error,
      });
    }

    const newProduct = await productModel.createProducts({
      name,
      description,
      price,
      stock,
      image: imageValidation.cleanedImage
    });

    res.status(201).json({
      message: "produk berhasil di tambahkan",
      data: newProduct,
    });
  } catch (error) {
    res.status(500).json({
      message: "gagal menambahkan product",
      data: error.message,
    });
  }
}

async function UpdateProduct(req, res) {
  try {
    const { id } = req.params;
    const { name, description, price, stock, image } = req.body;

    //validate image
    const imageValidation = ValidateImage(image, res);
    if (!imageValidation.error) {
      return res.status(400).json({
        message: imageValidation.error,
      });
    }

    const update = await productModel.updateProduct(id, {
      name,
      description,
      price,
      stock,
      image: imageValidation.cleanedImage,
    });

    if (!update) {
      return res.status(404).json({
        message: "Product atau data tidak di temukan",
      });
    }
    res.status(200).json({
      message: "data atau product berhasil di update",
      data: update,
    });
  } catch (error) {
    res.status(500).json({
      message: "gagal update product product atau data",
      data: error.message,
    });
  }
}

async function DeleteProduct(req, res) {
  try {
    const { id } = req.params;
    const destroy = await productModel.deleteProduct(id);
    if (!destroy) {
      return res.status(404).json({
        message: "Product atau data tidak di temukan",
      });
    }
    res.status(200).json({
      message: "product atau Data berhasil di hapus",
      data: destroy,
    });
  } catch (error) {
    res.status(500).json({
      message: "product atau data gagal di hapus",
      data: error.message,
    });
  }
}

module.exports = {
  index,
  GetProductById,
  CreateProduct,
  UpdateProduct,
  DeleteProduct,
};
