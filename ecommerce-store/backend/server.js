require("dotenv").config();
const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

const app = express();

const orderRouter = require("./routes/orderRoutes");
const productRouter = require("./routes/productRoutes");
const usersRouter = require("./routes/usersRoutes");
const authRouter = require("./routes/authRoutes");
const paymentsRouter = require("./routes/payments");
const webhookRouter = require("./routes/webhookRoutes");

app.use(cors());
app.use("/api/v1/webhooks/paystack", express.raw({ type: "application/json" }));
app.use(express.json());

// Swagger API Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/api/v1/webhooks", webhookRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/payments", paymentsRouter);

const port = process.env.PORT || 5000;
const start = async () => {
  try {
    app.listen(port, console.log(`Server is running on port ${port}`));
  } catch (error) {
    console.log("Error connecting to the server:", error);
  }
};

start();
