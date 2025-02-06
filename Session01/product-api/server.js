import http from "http";

let products = [
  { id: 1, name: "Laptop", price: 15000000 },
  { id: 2, name: "Chuột không dây", price: 500000 },
  { id: 3, name: "Bàn phím cơ", price: 1200000 },
];
let productId = products.length + 1;

const server = http.createServer((req, res) => {
  res.setHeader("Content-Type", "application/json");
  const urlParts = req.url.split("/");
  const id = parseInt(urlParts[2]);

  if (req.method === "GET" && req.url === "/products") {
    // Lấy danh sách sản phẩm
    res.writeHead(200);
    res.end(JSON.stringify(products));
  } else if (req.method === "POST" && req.url === "/products") {
    // Thêm sản phẩm mới
    let body = "";
    req.on("data", (chunk) => (body += chunk.toString()));
    req.on("end", () => {
      try {
        const product = JSON.parse(body);
        if (!product.name || !product.price) {
          res.writeHead(400);
          res.end(
            JSON.stringify({
              error: "Dữ liệu không hợp lệ. Vui lòng gửi theo định dạng:",
              example: { name: "Sản phẩm mẫu", price: 100000 },
            })
          );
          return;
        }
        product.id = productId++; // Gán ID tự động
        products.push(product); // Thêm vào danh sách
        res.writeHead(201);
        res.end(
          JSON.stringify({ message: "Sản phẩm đã thêm!", data: product })
        );
      } catch (error) {
        res.writeHead(400);
        res.end(
          JSON.stringify({
            error: "Dữ liệu JSON không hợp lệ. Vui lòng gửi theo định dạng:",
            example: { name: "Sản phẩm mẫu", price: 100000 },
          })
        );
      }
    });
  } else if (req.method === "PUT" && req.url === "/products") {
    let body = "";
    req.on("data", (chunk) => (body += chunk.toString()));
    req.on("end", () => {
      try {
        const updateData = JSON.parse(body);
        const productIndex = products.findIndex((p) => p.id === updateData.id);

        if (productIndex === -1) {
          res.writeHead(404);
          res.end(JSON.stringify({ error: "Sản phẩm không tồn tại" }));
          return;
        }

        products[productIndex] = { ...products[productIndex], ...updateData };
        res.writeHead(200);
        res.end(
          JSON.stringify({
            message: "Sản phẩm đã cập nhật!",
          })
        );
      } catch (error) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: "Dữ liệu JSON không hợp lệ" }));
      }
    });
  } else if (req.method === "DELETE" && req.url === "/products") {
    // Xóa sản phẩm theo ID
    const productIndex = products.findIndex((p) => p.id === id);
    if (productIndex === -1) {
      res.writeHead(404);
      res.end(JSON.stringify({ error: "Sản phẩm không tồn tại" }));
      return;
    }
    products.splice(productIndex, 1); // Xóa sản phẩm
    res.writeHead(200);
    res.end(JSON.stringify({ message: "Sản phẩm đã bị xóa" }));
  } else {
    res.writeHead(405);
    res.end(JSON.stringify({ error: "Phương thức không được hỗ trợ" }));
  }
});

server.listen(4000, () => console.log("API chạy tại http://localhost:4000"));
