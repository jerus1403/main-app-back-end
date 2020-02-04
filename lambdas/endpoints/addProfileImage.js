const Response = require("../templates/API_Responses");
const S3Profile = require("../templates/S3Profile");
const profileBucket = process.env.profileBucket;

exports.handler = async event => {
  const bodyData = JSON.parse(event.body);
  const result = await S3Profile.addProfileImage(bodyData, profileBucket);
  if (result.error) {
    console.log(Response._400({ Error: result.error }));
    return Response._400({ Error: result.error });
  }
  console.log(Response._200({ result }));
  return Response._200({ result });
};
