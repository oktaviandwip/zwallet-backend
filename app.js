const express = require("express");
const app = express();
const port = 3001;
const db = require("./src/config/db");
const routers = require("./src/routers/index");
const cors = require("cors");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/image", express.static("./public/upload"));
app.use(routers);
const corsOptions = {
  origin: "*", // Allow all origins
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allow specific methods if needed
  allowedHeaders: ["Content-Type", "Authorization"], // Allow specific headers if needed
};
app.use(cors(corsOptions));

db.connect()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
