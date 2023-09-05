const express = require("express");
const {connect} = require("mongoose");

const config = require("../config");
const routes = require("./routes");
const error_handler = require("./middlewares/error_handler_middleware");

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use("/api", routes);

app.use(error_handler);

const bootstrap = async () => {
  await connect(config.db_url);

  console.log("Connect to DB...");

  app.listen(config.port, () => {
    console.log(`Server listening on port: ${config.port}`);
  });
};

bootstrap();
