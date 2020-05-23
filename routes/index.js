const express=require("express");
const covidController = require("../controllers/covidApiController");

const router = express.Router();

router.get("/", covidController.showRecord)
router.get("/updatelist", covidController.covidTracker);
// router.get("/list", covidController.listOfCountries)


module.exports = router;