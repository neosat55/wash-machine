const bcrypt = require("bcrypt");

bcrypt.hash(process.argv[2], 10)
  .then(console.log)