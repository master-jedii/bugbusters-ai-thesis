const axios = require("axios");

const postToDialogflow = (request) => {
  console.log("Dialogflow");
  request.headers.host = "dialogflow.cloud.google.com";
  try {
    axios({
      method: "post",
      url: "https://bots.dialogflow.com/line/49d8e536-28b1-43f3-9758-1b9cd356d2d8/webhook",
      headers: request.headers,
      data: JSON.stringify(request.body),
    });
  } catch (error) {
    console.error(error);
  }
};

module.exports = { postToDialogflow };