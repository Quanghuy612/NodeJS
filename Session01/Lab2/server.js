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
