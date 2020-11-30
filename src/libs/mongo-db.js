const mongoose = require("mongoose");

require("../apps/models/category");
require("../apps/models/user")
require("../apps/models/product")
require("../apps/models/room")
require("../apps/models/message")

const uris = "mongodb://localhost:27017/project_db";

mongoose.connect(uris);
