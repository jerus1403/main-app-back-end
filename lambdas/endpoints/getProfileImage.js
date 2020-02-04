const Response = require("../templates/API_Responses");
const S3Profile = require("../templates/S3Profile");
// const profileBucket = process.env.profileBucket;

exports.handler = async event => {
  const idParameter = event.pathParameters;
  if (!idParameter || !idParameter.userId) {
    return Response._400({ message: "Missing ID from the path!" });
  }
  let userId = idParameter.userId;
  const result = await S3Profile.getProfileImage(userId);

  if (result.error) {
    return Response._400({ Error: result.error });
  }
  return Response._200({ result });
};
