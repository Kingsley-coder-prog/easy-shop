require("dotenv").config();
const express = require("express");
const cors = require("cors");

const {
  getProducts,
  addProduct,

  updateProduct,
  deleteProduct,
} = require("./models/productsSheet");

const { getOrders } = require("./models/ordersSheet");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/products", async (req, res) => res.json(await getProducts()));
app.post("/api/products", async (req, res) =>
  res.json(await addProduct(req.body))
);
app.put("/api/products/:id", async (req, res) =>
  res.json(await updateProduct(req.params.id, req.body))
);
app.delete("/api/products/:id", async (req, res) =>
  res.json(await deleteProduct(req.params.id))
);

app.get("/api/orders", async (req, res) => res.json(await getOrders()));

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
