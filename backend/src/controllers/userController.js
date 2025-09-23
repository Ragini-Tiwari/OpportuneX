const User = require("../models/User");
const bcrypt = require("bcrypt");

// Create user (admin)
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, role });
    res.status(201).json(user);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// Get users with pagination, sorting, filtering
exports.getUsers = async (req, res) => {
  try {
    let { page = 1, limit = 10, sort = "createdAt", role } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const query = role ? { role } : {};
    const totalCount = await User.countDocuments(query);

    const users = await User.find(query)
      .sort({ [sort]: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select("-password");

    res.json({ data: users, page, totalCount });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// Get single user
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const updates = req.body;
    if (updates.password) updates.password = await bcrypt.hash(updates.password, 10);
    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted" });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
