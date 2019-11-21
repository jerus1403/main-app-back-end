"use strict";
const AWS = require("aws-sdk");
const s3 = new AWS.S3();

module.exports.requestUploadURL = (req, res) => {
  const jsonData = JSON.parse(req.body);
  const bufferedData = new Buffer.from(jsonData.data, "base64");
  console.log(jsonData, "DATA");
  const params = {
    Bucket: "profile-image-main-app",
    Key: jsonData.name,
    Body: bufferedData,
    ContentType: `image/${jsonData.type}`,
    ContentEncoding: "base64",
    ACL: "public-read"
  };
  s3.putObject(params, (err, data) => {
    if (err) {
      return err;
    } else {
      return data;
    }
  });
};
