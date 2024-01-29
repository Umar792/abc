var AwsS3 = require("aws-sdk/clients/s3");

const s3 = new AwsS3({
  accessKeyId: "AKIAIZYXEWG7PNB34OIA",
  secretAccessKey: "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",
  region: "us-east-1",
});

const awsUrl = "https://instapass-events.s3.amazonaws.com/";
const defaultImageDesktop =
  "images/event/device/desktop/default/ticket_default.png";
const defaultImageTablet =
  "images/event/device/tablet/default/ticket_default.png";

class S3Client {
  validSignedURL(bucket, path) {
    let self = this;
    let getDefaultPath = path.includes("desktop")
      ? defaultImageDesktop
      : defaultImageTablet;
    let params = {
      Bucket: bucket,
      Key: path,
    };
    return new Promise(function (resolve, reject) {
      s3.headObject(params)
        ?.promise()
        .then(function (data) {
          console.log("s3 File exists" + data);
          resolve(self.getSignedURL(bucket, path));
        })
        .catch(function (err) {
          resolve(awsUrl + getDefaultPath);
        });
    });
  }

  getSignedURL(bucket, path) {
    let params = {
      Bucket: bucket,
      Key: path,
    };
    return s3.getSignedUrl("getObject", params) !== null
      ? awsUrl + params.Key
      : "";
  }
}

module.exports = S3Client;
