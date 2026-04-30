import User from "../models/User.js";
import Product from "../models/Product.js";

// @desc    Get all users with product stats
// @route   GET /api/users
// @access  Private (admin)
export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password");

    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const totalProducts = await Product.countDocuments({
          user: user._id,
        });

        const cheapProducts = await Product.countDocuments({
          user: user._id,
          newPrice: { $lt: 500 },
        });

        const expensiveProducts = await Product.countDocuments({
          user: user._id,
          newPrice: { $gte: 500 },
        });

        return {
          ...user._doc,
          stats: {
            totalProducts,
            cheapProducts,
            expensiveProducts,
          },
        };
      })
    );

    res.status(200).json({
      success: true,
      data: usersWithStats,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get user by ID with product stats
// @route   GET /api/users/:id
// @access  Private (admin or the same user)
export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const totalProducts = await Product.countDocuments({
      user: user._id,
    });

    res.status(200).json({
      success: true,
      data: {
        ...user._doc,
        totalProducts,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete user by ID
// @route   DELETE /api/users/:id
// @access  Private (admin)
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};