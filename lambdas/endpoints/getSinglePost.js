const Response = require("../templates/API_Responses");
const Dynamo = require("../templates/Dynamo");
const tableName = process.env.tableName;

exports.handler = async event => {
  const param = event.pathParameters;
  if (!param || !param.postId) {
    return Response._400({ message: "Missing ID from the path!" });
  }

  let postId = param.postId;
  const result = await Dynamo.getSinglePost(postId, tableName);
  if (result.error) {
    console.log(Response._400({ Error: result.error }));
    return Response._400({ Error: result.error });
  }
  console.log(Response._200({ result }));
  return Response._200({ result });
};
