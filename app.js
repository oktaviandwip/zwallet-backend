const express = require("express");
const app = express();
const port = 3001;
const db = require("./src/config/db");
const routers = require("./src/routers/index");
const cors = require("cors");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/image", express.static("./public/upload"));
const corsOptions = {
  origin: "https://zwallet-putra.netlify.app", // your frontend origin
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // allowed methods
  allowedHeaders: ["Content-Type", "Authorization"], // allowed headers
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
