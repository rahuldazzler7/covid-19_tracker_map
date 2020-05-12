const mongoose = require("mongoose");

const countrySchema = new mongoose.Schema({
    name:{type:String},
    countryCode:{type:String},
    ccode_three:{type:String},
    lat:{type:Number},
    lng:{type:Number}
})

const country = mongoose.model("country", countrySchema);
module.exports = country;