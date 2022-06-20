const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const mailchimp = require("@mailchimp/mailchimp_marketing");
const https = require("node:https");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
})

app.post("/", function(req, res) {
  const fname = req.body.fname;
  const lname = req.body.lname;
  const email = req.body.email;

  const data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: fname,
        LNAME: lname
      }
    }]
  };
  const jsondata = JSON.stringify(data);

const options = {
  method: 'POST',
  auth:"shubha:26f0fb92b3a4c9d4f5ffc5b31b8f38a2-us8"
};
const url ="https://us8.api.mailchimp.com/3.0/lists/5180c8fe97";

const request = https.request(url,options, function(response) {
  response.on('data', function(data){
    try {
  const result = JSON.parse(data);
  console.log(result);
} catch (err) {
  console.log('error', err);
}
  });
  if(response.statusCode===200){
    res.sendFile(__dirname + "/success.html");
  }else{
    res.sendFile(__dirname + "/failure.html");
  }
console.log(response.statusCode);
});
request.write(jsondata);
request.end();
})

app.post("/failure",function(req,res){
  res.redirect("/");
})

app.get("/fail",function(req,res){
  res.sendFile(__dirname + "/failure.html");
})

app.listen(process.env.PORT || 3000, function() {
  console.log("Server is up and running. ");
});
