const express = require("express")
require('dotenv').config();
const axios = require("axios")
const Credit = require("../mongodb/models/credit")

const router = express.Router();


router.route("/").get((req, res) => {
    res.send("hello from dalle");
  });

  router.route("/credit-left").get(async (req, res) => {
    try {
      const creditLeftArray = await Credit.find();
      const creditLeft = creditLeftArray[0].creditLeft;
      res.status(200).json({ creditLeft });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  
  
  router.route("/").post(async (req, res) => {
    const { prompt } = req.body.form;
    
    const options = {
      method: 'POST',
      url: 'https://open-ai21.p.rapidapi.com/texttoimage2',
      headers: {
        'content-type': 'application/json',
          'X-RapidAPI-Key': '055e83ee40msh5bf663d240ffbd5p15d9bcjsn928b20dbf65c',
    'X-RapidAPI-Host': 'open-ai21.p.rapidapi.com'
      },
      data: {
        text: prompt
      }
    };
  
    try {
      const creditLeftArray = await Credit.find();
      const creditLeft = creditLeftArray[0].creditLeft;
  
      if (creditLeft > 0) {
        console.log("yes")
        await Credit.findByIdAndUpdate(creditLeftArray[0]._id, { $inc: { creditLeft: -1 } });
  
        const response = await axios.request(options);
        res.status(200).json({ photo: response.data,creditLeft });
      } else {
        res.status(500).json({ message:"Credit limt has been reached for this month" });
      }
    } catch (error) {
      console.error(error);
      res.status(504).json({message:"The request to the API has timed out. Please try again later"})
    }
  });
  
module.exports = router;
