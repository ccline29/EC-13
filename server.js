const express = require('express');
const routes = require('./routes');
require("dotenv").config();
const sequelize = require('./config/connection');
// import sequelize connection

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const allRoutes = require("./routes/api");

app.use(allRoutes);

// sync sequelize models to the database, then turn on the server
sequelize.sync({force:false}).then(function() {
  app.listen(PORT, function() {
      console.log('App listening on PORT ' + PORT);
  });
});