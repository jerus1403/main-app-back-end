const AWS = require("aws-sdk");
const s3Client = new AWS.S3();
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

const S3Profile = {
  async addProfileImage(bodyData, profileBucket) {
    const userId = bodyData.userId;
    const image = bodyData.imageObject;
    const bufferedData = new Buffer.from(image.id, "base64");
    const params = {
      Bucket: profileBucket,
      Key: `user/${userId}/${image.filename}`,
      Body: bufferedData,
      ContentType: `image/jpeg`,
      ContentEncoding: "base64",
      ACL: "public-read"
    };
    const result = new Promise((resolve, reject) => {
      s3Client.putObject(params, (error, data) => {
        if (error) {
          console.log(error, "ERROR PROFILE IMAGE");
          resolve({ error });
        } else {
          console.log(data, "DATA PROFILE IMAGE");
          resolve({ data });
        }
      });
    });
    return result;
  },

  async getProfileImage(userId) {
    // Function check if url exists
    CheckURL = (url, callback) => {
      let http = new XMLHttpRequest();
      let result;
      http.open("HEAD", url);
      http.onreadystatechange = function() {
        if (this.readyState == this.DONE) {
          result = this.status;
          callback(result != 404);
        }
      };
      http.send();
    };

    const imageLink = `https://profile-image-main-app.s3.amazonaws.com/user/${userId}/${userId}.jpg`;
    const result = new Promise((resolve, reject) => {
      CheckURL(imageLink, res => {
        if (res == false) {
          resolve({ error: "Link does not exists" });
        }
        resolve({ url: imageLink });
      });
    });
    return result;
  }
};

module.exports = S3Profile;
