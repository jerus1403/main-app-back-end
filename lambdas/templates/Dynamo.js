const AWS = require("aws-sdk");
const s3Client = new AWS.S3();

const documentClient = new AWS.DynamoDB.DocumentClient();

const Dynamo = {
  async getAllPosts(bodyData, TableName) {
    const latitude = bodyData.latitude;
    const longitude = bodyData.longitude;
    console.log(bodyData, "BODY DYNAMO");
    console.log(latitude, "lAT DYNAMO");
    console.log(longitude, "LNG DYNAMO");
    const params = {
      TableName,
      KeyConditionExpression: "latitude = :latitude and longitude = :longitude",
      ExpressionAttributeValues: {
        ":latitude": latitude,
        ":longitude": longitude
      }
    };
    const result = await new Promise((resolve, reject) => {
      documentClient.query(params, (error, data) => {
        if (error) {
          console.log(params, "DYNAMO PARAMS");
          resolve({ error });
        } else {
          console.log(params, "DYNAMO PARAMS");
          resolve({ data });
        }
      });
    });
    return result;
  },

  async getUserPost(ID, TableName) {
    const params = {
      TableName,
      IndexName: "userPosts",
      KeyConditionExpression: "userId = :ID",
      ExpressionAttributeValues: {
        ":ID": ID
      }
    };

    const result = await new Promise((resolve, reject) => {
      documentClient.query(params, (error, data) => {
        if (error) {
          console.log(params, "PARAMSSSS");
          console.log(error, "ERRORRRR");
          resolve({ error });
        } else {
          console.log(params, "PARAMSSSS");
          console.log(data, "DATAAAA");
          resolve({ data });
        }
      });
    });
    return result;
  },

  async addPost(bodyData, TableName, postImageBucket) {
    let result1, result2, finalResult;
    const imageList = bodyData.imageList;
    const postId = bodyData.post.postId;
    const userId = bodyData.post.userId;

    imageList.map(image => {
      const bufferedData = new Buffer.from(image.id, "base64");
      const imageParams = {
        Bucket: postImageBucket,
        Key: `user/${userId}/post/${postId}/${image.filename}`,
        Body: bufferedData,
        ContentType: `image/jpeg`,
        ContentEncoding: "base64",
        ACL: "public-read"
      };
      result2 = new Promise((resolve, reject) => {
        s3Client.putObject(imageParams, (error, data) => {
          if (error) {
            console.log(error, "ERROR IMAGE LIST");
            resolve({ error });
          } else {
            console.log(data, "DATA IMAGE LIST");
            resolve({ data });
          }
        });
      });
    });

    const params = {
      TableName,
      Item: bodyData.post,
      ReturnValues: "ALL_OLD"
    };

    result1 = new Promise((resolve, reject) => {
      documentClient.put(params, (error, data) => {
        if (error) {
          console.log(error, "ERROR PUT OBJECT");
          resolve({ error });
        } else {
          console.log(data, "DATA PUT OBJECT");
          resolve(params.Item);
        }
      });
    });

    finalResult = await Promise.all([result1, result2]);
    return finalResult;
  },

  async deletePost(bodyData, TableName, postImageBucket) {
    let final_response, dynamo_response, bucket_response;

    const postId = bodyData.postId,
      userId = bodyData.userId,
      imgPathList = bodyData.imgPathList;

    const postParams = {
      TableName,
      Key: {
        postId: postId,
        userId: userId
      }
    };

    console.log(postParams, "POST PARAMSSSSSSSS");

    //DELETE ITEM FROM DYNAMO by POST ID
    dynamo_response = new Promise((resolve, reject) => {
      documentClient.delete(postParams, (err, data) => {
        if (err) {
          console.log(err, "ERROR DELETE POST DYNAMO");
          resolve({ err });
        } else {
          console.log(data, "DATA DELETE POST DYNAMO");
          resolve({ data });
        }
      });
    });

    // DELETE IMAGEs FROM AN OBJECT by POST ID
    imgPathList.map(image => {
      const imageParams = {
        Bucket: postImageBucket,
        Delete: {
          Objects: [
            {
              Key: `user/${userId}/post/${postId}/${image.filename}`
            }
          ]
        }
      };
      console.log(imageParams, "IMAGE PARAMSSSSSSSS");
      bucket_response = new Promise((resolve, reject) => {
        s3Client.deleteObjects(imageParams, (err, data) => {
          if (err) {
            console.log(err, "ERROR DELETE BUCKET");
            resolve({ err });
          } else {
            console.log(data, "DATA DELETE BUCKET");
            resolve({ data });
          }
        });
      });
    });

    final_response = await Promise.all([dynamo_response, bucket_response]);
    return final_response;
  }
};

module.exports = Dynamo;
