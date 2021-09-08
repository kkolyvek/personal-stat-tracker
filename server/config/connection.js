const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/caltracker", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = mongoose.connection;
