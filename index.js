const config = require("./config")
const eos = require("./eos")

eos.setOptions(config)
eos.init()