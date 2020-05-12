var unirest = require("unirest");
const country = require('../models/Countries');
const covidupdate = require("../models/Covidupdate");

let showRecord = async (req,res)=>{
    const today= new Date();
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    const day = yesterday.toISOString().split('T')[0];

    let result = await covidupdate.find({date:day}).lean();
    
    res.send({rs:result});
}

let listOfCountries = async (req, res)=>{
    var result = unirest("GET","https://covid-19-data.p.rapidapi.com/help/countries")

    var day= new Date();
    var today = day.toISOString().split('T')[0];

    result.query({
	    "format": "json",
    });

    result.headers({
        "x-rapidapi-host": process.env.x_rapidapi_host,
        "x-rapidapi-key": process.env.x_rapidapi_key,
        "useQueryString": true
    });
    result.end( async function (resf) {
        if (resf.error) throw new Error(resf.error);
        //res.json(resf.body)
        for(let i=0; i<resf.body.length; i++){
            const countrycheck = await country.findOne({$and:[{lat:resf.body[i].latitude},{lng:resf.body[i].longitude}]})
            if(!countrycheck){
                const data = new country({
                    name: resf.body[i].name,
                    countryCode: resf.body[i].alpha2code,
                    ccode_three: resf.body[i].alpha3code,
                    lat:resf.body[i].latitude,
                    lng:resf.body[i].longitude
                })
                data.save()
                .then(suc=>{
                    console.log("Data is getting saved")
                    if(i+1 == resf.body.length){
                        res.json({'msg':"All countries are saved successfully"});
                    }
                })
                .catch(e=>{
                    console.log("Something went wrong");
                })
            }
        }
    });
}


let covidTracker = async (req, res)=>{
    

    const today= new Date();
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    const day = yesterday.toISOString().split('T')[0];
    var alldata=[];
    let allcountry = await country.find().lean()
    for(let j=0; j<allcountry.length; j++){

      setTimeout(()=>{
            var result = unirest("GET","https://covid-19-data.p.rapidapi.com/report/country/name")
            result.query({
                "date-format": "YYYY-MM-DD",
                "format": "json",
                "date": day,
                "name": allcountry[j].name
            });
    
            result.headers({
                "x-rapidapi-host": process.env.x_rapidapi_host,
                "x-rapidapi-key": process.env.x_rapidapi_key,
                "useQueryString": true
            });
            result.end(function (resp) {
                if (resp.error) throw new Error(resp.error);
                
                    console.log("Working >> "+j);
            
                    alldata.push(resp.body[0])
                    if(j+1 == allcountry.length){
                        res.send(alldata)
                        for(let k=0; k<alldata.length; k++){
                            let newUpdate = new covidupdate({
                                country: alldata[k].country,
                                confirmed_cases: alldata[k].provinces[0].confirmed,
                                recovered: alldata[k].provinces[0].recovered,
                                deaths: alldata[k].provinces[0].deaths,
                                active: alldata[k].provinces[0].active,
                                lat:alldata[k].latitude,
                                lng:alldata[k].longitude,
                                date:day
                            })
                            newUpdate.save()
                            .then(s=>{
                                console.log("Data saved>> "+k)
                            })
                        }
                    }
            
                
            });
            
        }, 1000 * (j+0.1) )
    }
       
}

module.exports={covidTracker, listOfCountries, showRecord}