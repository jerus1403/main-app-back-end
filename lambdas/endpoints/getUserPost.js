const Response = require("../templates/API_Responses");
const Dynamo = require("../templates/Dynamo");
const tableName = process.env.tableName;

exports.handler = async event => {
  const idParameter = event.pathParameters;
  if (!idParameter || !idParameter.ID) {
    return Response._400({ message: "Missing ID from the path!" });
  }

  let ID = idParameter.ID;
  const result = await Dynamo.getUserPost(ID, tableName);
  if (result.error) {
    console.log(Response._400({ Error: result.error }));
    return Response._400({ Error: result.error });
  }
  console.log(Response._200({ result }));
  return Response._200({ result });
};
