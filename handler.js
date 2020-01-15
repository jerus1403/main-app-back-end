"use strict";
const AWS = require("aws-sdk");
const s3 = new AWS.S3();
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const profileBucket = process.env.profileBucket;

module.exports.requestUploadURL = (req, res, callback) => {
  const jsonData = JSON.parse(req.body);
  const bufferedData = new Buffer.from(jsonData.data, "base64");
  const params = {
    Bucket: profileBucket,
    Key: jsonData.name,
    Body: bufferedData,
    ContentType: `image/${jsonData.type}`,
    ContentEncoding: "base64",
    ACL: "public-read"
  };
  s3.putObject(params, (err, data) => {
    if (err) {
      callback(err, null);
    } else {
      let response = {
        statusCode: 200,
        headers: {
          my_header: "my_value"
        },
        body: JSON.stringify(data),
        isBase64Encoded: false
      };
      callback(null, response);
    }
  });
};

const UrlExists = (url, callback) => {
  let http = new XMLHttpRequest();
  let result;
  http.open("HEAD", url);
  http.onreadystatechange = function() {
    if (this.readyState == this.DONE) {
      result = this.status;
      callback(this.status != 404);
    }
  };
  http.send();
  // return result;
};

module.exports.getUserProfileImageURL = (event, context, callback) => {
  console.log(event, "event");
  const bodyObj = JSON.parse(event.body);
  const userId = bodyObj.user_id;
  const type = bodyObj.type;

  const imageLink = `https://profile-image-main-app.s3.amazonaws.com/${userId}.${type}`;

  UrlExists(imageLink, res => {
    let response;
    if (res == false) {
      response = {
        statusCode: 404,
        headers: {
          my_header: "Link does not exists"
        }
      };
      callback(response, null);
    }
    response = {
      statusCode: 200,
      headers: {
        "x-custom-header": "my_value"
      },
      body: JSON.stringify({
        message: "Successful",
        input: imageLink
      })
    };
    callback(null, response);
  });
};
