import express from "express";
import router from "./Routes/auth.routes";
import productRoutes from "./Routes/Products.routes";
import orderRoutes from "./Routes/Orders.routes";
const app = express();
app.use(express.json());

// Routes
app.use("/api/users", router);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;
