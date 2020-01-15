const AWS = require("aws-sdk");
const s3Client = new AWS.S3();

const documentClient = new AWS.DynamoDB.DocumentClient();

const Dynamo = {
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
          resolve({ error });
        } else {
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
            resolve({ error });
          } else {
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
          resolve({ error });
        } else {
          resolve(params.Item);
        }
      });
    });

    finalResult = await Promise.all([result1, result2]);
    return finalResult;
  }
};

module.exports = Dynamo;
