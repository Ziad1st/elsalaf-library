const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

require("dotenv").config();

//>> G Middlewares
app.use(cors(require("./config/corsOptions")));
app.use(cookieParser());
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "200mb", extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
//>> Routes
app.get("/", (req, res) => {
  res.status(200).sendFile(path.join(__dirname, "views", "welcome.html"));
});

app.use(
  "/api/users",

  require("./src/routes/usersRouter"),
);
app.use("/api/auth", require("./src/routes/authRouter"));
app.use(
  "/api/categories",

  require("./src/routes/categoriesRouter"),
);
app.use(
  "/api/books",

  require("./src/routes/bookRouter"),
);

//>> 404 Handler
app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});

//>> G Error Handler
app.use((err, req, res, next) => {
  console.log(err.message);
  res
    .status(err.status || 500)
    .json({ message: err.message || "مشكلة في السيرفر" });
});

module.exports = app;
