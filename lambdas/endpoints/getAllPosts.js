const Response = require("../templates/API_Responses");
const Dynamo = require("../templates/Dynamo");
const tableName = process.env.tableName;

exports.handler = async event => {
  // const params = event.pathParameters;
  // if (!params || (!params.latitude && !params.longitude)) {
  //   return Response._400({ message: "Missing ID from the path!" });
  // }
  console.log(event, "EVENT GET POST");
  // let latitude = event.body.latitude;
  // let longitude = event.body.longitude;
  const bodyData = JSON.parse(event.body);
  const result = await Dynamo.getAllPosts(bodyData, tableName);
  if (result.error) {
    console.log(Response._400({ Error: result.error }));
    return Response._400({ Error: result.error });
  }
  console.log(Response._200({ result }));
  return Response._200({ result });
};
