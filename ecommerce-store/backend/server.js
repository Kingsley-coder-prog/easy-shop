require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

const {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("./models/productsSheet");

const orderRouter = require("./routes/orderRoutes");
const productRouter = require("./routes/productRoutes");

app.use(cors());
app.use(express.json());

app.get("/api/v1/products", async (req, res) => res.json(await getProducts()));
app.get("/api/v1/products/category/:category", async (req, res) => {
  const category = req.params.category;
  const products = await getProducts(category);
  res.json(products);
});
app.post("/api/v1/products", async (req, res) =>
  res.json(await createProduct(req.body))
);
app.patch("/api/v1/products/:id", async (req, res) =>
  res.json(await updateProduct(req.params.id, req.body))
);
app.delete("/api/v1/products/:id", async (req, res) =>
  res.json(await deleteProduct(req.params.id))
);

app.use("/api/v1/orders", orderRouter);

// app.get("/api/v1/orders", async (req, res) => res.json(await getOrders()));
// app.post("/api/v1/orders", async (req, res) =>
//   res.json(await createOrder(req.body))
// );
// app.patch("/api/v1/orders/:id", async (req, res) =>
//   res.json(await updateOrder(req.params.id, req.body))
// );
// app.delete("/api/v1/orders/:id", async (req, res) =>
//   res.json(await deleteOrder(req.params.id))
// );

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
