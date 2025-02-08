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
  const id = parseInt(urlParts[2]); // Extract the product ID from the URL

  if (req.method === "GET" && req.url === "/products") {
    res.writeHead(200);
    res.end(JSON.stringify(products));
  } else if (req.method === "POST" && req.url === "/products") {
    let body = "";
    req.on("data", (chunk) => (body += chunk.toString()));
    req.on("end", () => {
      try {
        const product = JSON.parse(body);
        if (!product.name || !product.price) {
          res.writeHead(400);
          res.end(JSON.stringify({ error: "Dữ liệu không hợp lệ." }));
          return;
        }
        product.id = productId++;
        products.push(product);
        res.writeHead(201);
        res.end(
          JSON.stringify({ message: "Sản phẩm đã thêm!", data: product })
        );
      } catch (error) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: "Dữ liệu JSON không hợp lệ." }));
      }
    });
  } else if (req.method === "PUT" && urlParts[1] === "products" && id) {
    let body = "";
    req.on("data", (chunk) => (body += chunk.toString()));
    req.on("end", () => {
      try {
        const updateData = JSON.parse(body);
        const productIndex = products.findIndex((p) => p.id === id);

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
            data: products[productIndex],
          })
        );
      } catch (error) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: "Dữ liệu JSON không hợp lệ" }));
      }
    });
  } else if (req.method === "DELETE" && urlParts[1] === "products" && id) {
    const productIndex = products.findIndex((p) => p.id === id);
    if (productIndex === -1) {
      res.writeHead(404);
      res.end(JSON.stringify({ error: "Sản phẩm không tồn tại" }));
      return;
    }
    products.splice(productIndex, 1);
    res.writeHead(200);
    res.end(JSON.stringify({ message: "Sản phẩm đã bị xóa" }));
  } else {
    res.writeHead(405);
    res.end(JSON.stringify({ error: "Phương thức không được hỗ trợ" }));
  }
});

server.listen(4000, () => console.log("API chạy tại http://localhost:4000"));
