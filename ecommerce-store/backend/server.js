require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

const orderRouter = require("./routes/orderRoutes");
const productRouter = require("./routes/productRoutes");
const usersRouter = require("./routes/usersRoutes");
const authRouter = require("./routes/authRoutes");
const paymentsRouter = require("./routes/payments");

app.use(cors());
app.use(express.json());

// app.get("/api/v1/products", async (req, res) => res.json(await getProducts()));
// app.get("/api/v1/products/category/:category", async (req, res) => {
//   const category = req.params.category;
//   const products = await getProducts(category);
//   res.json(products);
// });
// app.post("/api/v1/products", async (req, res) =>
//   res.json(await createProduct(req.body))
// );
// app.patch("/api/v1/products/:id", async (req, res) =>
//   res.json(await updateProduct(req.params.id, req.body))
// );
// app.delete("/api/v1/products/:id", async (req, res) =>
//   res.json(await deleteProduct(req.params.id))
// );

app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/payments", paymentsRouter);

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

// app.listen(process.env.PORT, () =>
//   console.log(`Server running on port ${process.env.PORT}`)
// );

const port = process.env.PORT || 5000;
const start = async () => {
  try {
    app.listen(port, console.log(`Server is running on port ${port}`));
  } catch (error) {
    console.log("Error connecting to the server:", error);
  }
};

start();
