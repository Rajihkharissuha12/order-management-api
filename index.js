// server.js
const express = require("express");
const userRoutes = require("./routes/userRoute");
const produkRoutes = require("./routes/produkRoute");
const orderRoutes = require("./routes/orderRoute");
const app = express();
const swaggerDocs = require("./docs/swagger");
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.use("/user", userRoutes);
app.use("/produk", produkRoutes);
app.use("/order", orderRoutes);
// Swagger
swaggerDocs(app);
// Routes
app.get("/", (req, res) => {
  res.send("Hello, Express!");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
