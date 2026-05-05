import Product from "../models/Product.js";

export const createProduct = async (req, res) => {
  try {
    const { name, category, newPrice, oldPrice, quantity, description, images } = req.body;

    // ✅ بيتعمل أوتوماتيك من الـ name
    const slug = name.toLowerCase().trim().replace(/\s+/g, "-");

    // لو في منتج بنفس الـ slug موجود → ضيف timestamp عشان يبقى unique
    const existingProduct = await Product.findOne({ slug });
    const finalSlug = existingProduct ? `${slug}-${Date.now()}` : slug;

    const product = await Product.create({
      name,
      category,
      newPrice,
      oldPrice,
      quantity,
      description,
      images,
      slug: finalSlug,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
export const getAllProducts = async (req, res) => {
  // search, filter, pagination
  const { search, category, minPrice, maxPrice } = req.query;

  const filter = {};

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  if (category) {
    filter.category = category;
  }

  if (minPrice || maxPrice) {
    filter.newPrice = {};
    if (minPrice) filter.newPrice.$gte = Number(minPrice);
    if (maxPrice) filter.newPrice.$lte = Number(maxPrice);
  }

  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
      data: products,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const allowedFields = {};

    if (req.body.name) {
      allowedFields.name = req.body.name;
      allowedFields.slug = req.body.name
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-");
    }

    if (req.body.category) allowedFields.category = req.body.category;
    if (req.body.newPrice) allowedFields.newPrice = req.body.newPrice;
    if (req.body.oldPrice) allowedFields.oldPrice = req.body.oldPrice;
    if (req.body.quantity) allowedFields.quantity = req.body.quantity;
    if (req.body.description) allowedFields.description = req.body.description;

    if (req.body.images) {
      allowedFields.images = req.body.images;
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      allowedFields,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
