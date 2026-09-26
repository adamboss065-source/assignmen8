import User from "../models/user.model.js";
export const signup = async (req, res) => {
  try {
    const { name, email, password, phone, age } = req.body;
    const foundemail = await User.findOne({ email });
    if (foundemail) {
      return res.status(409).json({ message: "Email already exists" });
    }
    const user = await User.create({
      name,
      email,
      password,
      phone,
      age,
    });
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error creating user",
      error: error.message,
    });
  }
};
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.password !== password) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }
    res.status(200).json({
      message: "Login successful",
      user: user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Login error",
      error: error.message,
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const userid = req.params.id;
    const { password, ...updateData } = req.body;
    if (password) {
      return res.status(400).json({ message: "Password cannot be updated" });
    }
    if (updateData.email) {
      const existingUser = await User.findOne({
        email: updateData.email,
        _id: { $ne: userid },
      });
      if (existingUser) {
        return res.status(409).json({
          message: "Email already exists",
        });
      }
    }
    const user = await User.findByIdAndUpdate(userid, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    res.status(200).json({
      message: "User updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating user",
      error: error.message,
    });
  }
};
export const deleteUser = async (req, res) => {
  try {
    const userid = req.query.userId;
    if (!userid) {
      return res
        .status(400)
        .json({ message: "userId is required in query params" });
    }
    const user = await User.findByIdAndDelete(userid);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting user",
      error: error.message,
    });
  }
};
export const getUser = async (req, res) => {
  try {
    const userId = req.query.userId;
    if (!userId) {
      return res.status(400).json({
        message: "userId is required in query params",
      });
    }
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    res.status(200).json({
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error getting user",
      error: error.message,
    });
  }
};
