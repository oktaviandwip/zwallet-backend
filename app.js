const express = require("express");
const app = express();
const port = 3001;
const routers = require("./src/routers/index");
const cors = require("cors");

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", routers);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
