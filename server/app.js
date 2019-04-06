// set up express, cors, body parser
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const nodemailer = require("nodemailer");
var env = require("./env");

const app = express();

// Body Parser Middleware
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(bodyParser.json());

///////////////////////////// EMAIL SENDER ///////////////////////////
app.post("/api/notify", (req, res) => {
  // for now response is empty
  const output = `
    <h3>Ticket Title: ${req.body.title}</h3>
    <p>Your ticket status: ${req.body.status}</p>
    <p>Message: ${req.body.message}</p>
  `;

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "rashad.green@ethereal.email",
      pass: "3tgthkxNKmvs5hWjSB"
    },
    tls: {
      rejectUnauthorized: false
    } // necessary for sending from local host
  });

  // setup email data with unicode symbols
  let mailOptions = {
    from: '"Admin Test" <rashad.green@ethereal.email>', // sender address
    to:  req.body.receiver, // list of receivers
    subject: "Test Notification", // Subject line
    text: "Testing", // plain text body
    html: output // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  });
});

///////////////////////////// DATABASE ///////////////////////////
app.use(cors());

// set up Mongoose, the Object Relation Mapper for Mongodb
const mongoose = require("mongoose");
const config = require("./config/atlas.js");
mongoose.Promise = global.Promise;
mongoose
  .connect(config.DB, {
    useNewUrlParser: true
  })
  .then(
    () => {
      console.log("Database is connected");
    },
    err => {
      console.log("Can not connect to the database" + err);
    }
  );

// set up routes & port
const ticketRoutes = require("./routers/ticket.route");
const statusUpdateRoutes = require("./routers/statusUpdate.route");
app.use("/ticket", ticketRoutes);
app.use("/status", statusUpdateRoutes);

///////////////////////////// TEXT CLUSTERING ///////////////////////////
app.post('/with-cors', cors(), (req, res, next) => {
  res.json({ msg: 'WHOAH with CORS it works! 🔝 🎉' })
  // const axios = require('axios');
  //     let config = {
  //     headers: { 'Server-Token': env.ACN_TOKEN,
  //             'Content-Type': 'application/x-www-form-urlencoded',
  //             'Accept': 'application/json'},
  //     params: {"of":"json","lang":"en","txt":"%22text01%22:%20%22The%20new%20button%20not%20working%22%0A%22text02%22:%20%22button%20will%20not%20start%20activity%22%0A%22text03%22:%20%22button%20press%20is%20delayed%22%20%0A%22text04%22:%20%22add%20a%20new%20screen%20option%20to%20adjust%20user%20settings%22%0A%22text05%22:%20%22feature%20request%20for%20long%20timeout%22"}
  //   };
  // let url = 'http://ug-api.acnapiv3.io/swivel/text-clustering/clustering-1.1'
  // let data = ""
  // function func(){
  //   axios.post(url, data, config)
  //        .then((response) => {
  //         //   console.log(response.data);
  //           console.log(JSON.stringify(response.data));
  //   })
  //   .then(function (response) {
  //     console.log(response);
  //   })
  //   .catch(function (error) {
  //     console.log(error);
  //   });
  // };
  // func()

})

module.exports = app;
