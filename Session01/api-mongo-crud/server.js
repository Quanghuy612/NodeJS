const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PORT = 3000;
app.listen(PORT, () =>
  console.log(`Server đang chạy tại http://localhost:${PORT}`)
);

// Middleware để parse JSON
app.use(express.json());

// Kết nối MongoDB
mongoose
  .connect("mongodb://localhost:27017/productapi", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Kết nối thành công với MongoDB"))
  .catch((err) => console.error("Lỗi kết nối", err));

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
});
const Product = mongoose.model("Product", productSchema);

app.get("/products", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

app.get("/products/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product)
    return res.status(404).json({ message: "Sản phẩm không tồn tại" });
  res.json(product);
});

app.post("/products", async (req, res) => {
  const newProduct = new Product(req.body);
  await newProduct.save();
  res.status(201).json({ message: "Add sản phẩm thành công!", newProduct });
});

app.put("/products/:id", async (req, res) => {
  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json({ message: "Cập nhật sản phẩm thành công!", updatedProduct });
});

app.delete("/products/:id", async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Sản phẩm đã bị xóa" });
});
