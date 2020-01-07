const AWS = require("aws-sdk");

const documentClient = new AWS.DynamoDB.DocumentClient();

const Dynamo = {
  async get(ID, TableName) {
    const params = {
      TableName,
      Key: {
        ID
      }
    };
    const data = await documentClient.get(params).promise();
    if (!data || !data.Item) {
      throw Error(
        `There was a problem fetching data for ${ID} from ${TableName}.`
      );
    }
    console.log(data.Item);
    return data.Item;
  },
  async add(item, TableName) {
    const params = {
      TableName,
      Item: item,
      ReturnValues: "ALL_OLD"
    };
    const result = await new Promise((resolve, reject) => {
      documentClient.put(params, (error, data) => {
        if (error) {
          resolve({ error });
        } else {
          resolve(params.Item);
        }
      });
    });
    return result;
  }
};

module.exports = Dynamo;
