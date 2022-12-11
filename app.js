const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
// const { request } = require("http");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", (req, res) => {
  let fname = req.body.fname;
  let email = req.body.email;

  const url = "https://us21.api.mailchimp.com/3.0/lists/e5be36b0bb";
  const option = {
    method: "POST",
    auth: "api:dcbdcbc5fffdfe9e6662f3739702fc9c-us21",
  };

  const request = https.request(url, option, (r) => {
    r.on("data", (d) => {
      console.log(JSON.parse(d));
    });
    if (r.statusCode == 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
  });

  const data = {
    members: [
      {
        status: "subscribed",
        email_address: email,
        merge_fields: {
          FNAME: fname,
        },
      },
    ],
    update_existing: true,
  };
  const jsonData = JSON.stringify(data);

  request.write(jsonData);
  request.end();
});

app.post("/failure.html", (req, res) => {
  res.redirect("/");
});

app.listen(3000, () => {
  console.log("Server 3000 is running");
});
