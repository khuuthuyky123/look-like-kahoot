const mongoose = require("mongoose");

try {
  mongoose.connect(process.env.DATABASE_URL);
} catch {
  (err) => console.log(err.reason);
}
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected database successfully");
});

module.exports = db;
