const mongoose = require("mongoose");

const covidSchema = new mongoose.Schema({
    country:{type:String},
    confirmed_cases:{type:Number},
    recovered:{type:Number},
    deaths:{type:Number},
    active:{type:Number},
    lat:{type:Number},
    lng:{type:Number},
    date:{type:String}
})

const covidUpdate = mongoose.model("covidUpdate", covidSchema);
module.exports = covidUpdate;