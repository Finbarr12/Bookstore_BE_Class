const express = require("express");
const cors = require("cors");
const app = express();
const dbConnect = require("./config/db");
const router = require("./router/authorRoutes");
const bookRoutes = require("./router/bookRoutes");
const notificationRoutes = require("./router/notificationRoutes");
const environment = require("./env/environmentVar");
const YAML = require("yaml");
const fs = require("fs");
const swaggerUi = require("swagger-ui-express");

const file = fs.readFileSync("./documentation/swagger.yaml", "utf8");
const swaggerDocument = YAML.parse(file);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

dbConnect();

app.use(cors());
app.use(express.json());
app.use("/api/v1/author", router);
app.use("/api/v1/books", bookRoutes);
app.use("/api/v1/notification", notificationRoutes);

app.listen(environment.PORT, () => {
  console.log(`Successfully connected! to port : ${environment.PORT}`);
});
