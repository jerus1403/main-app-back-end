const Response = require("../templates/API_Responses");
const Dynamo = require("../templates/Dynamo");
const tableName = process.env.tableName;
const postImageBucket = process.env.postImageBucket;

exports.handler = async event => {
  const bodyData = JSON.parse(event.body);
  const result = await Dynamo.addPost(bodyData, tableName, postImageBucket);
  if (result.error) {
    console.log(Response._400({ Error: result.error }));
    return Response._400({ Error: result.error });
  }
  console.log(Response._200({ result }));
  return Response._200({ result });
};
