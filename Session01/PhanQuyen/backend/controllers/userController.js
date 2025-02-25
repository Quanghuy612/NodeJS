const User = require("../models/User");

const getUsers = async (req, res) => {
  console.log(req);
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden - Admins only" });
  }

  const users = await User.find().select("-password");
  res.json(users);
};

const getUserById = async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (
    req.user.role !== "admin" &&
    req.user._id.toString() !== user._id.toString()
  ) {
    return res.status(403).json({ message: "Forbidden - Access denied" });
  }

  res.json(user);
};

const updateUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (
    req.user.role !== "admin" &&
    req.user._id.toString() !== user._id.toString()
  ) {
    return res.status(403).json({ message: "Forbidden - Access denied" });
  }

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;

  await user.save();
  res.json({ message: "User updated successfully", user });
};

const deleteUser = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden - Admins only" });
  }

  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json({ message: "User deleted successfully" });
};

module.exports = { getUsers, getUserById, updateUser, deleteUser };
