const axios = require("axios");
let qs = require("qs");

const LINE_HEADER = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${process.env.CHANNEL_ACCESS_TOKEN}`,
};

const getImageBinary = async (messageId) => {
  const originalImage = await axios({
    method: "get",
    headers: LINE_HEADER,
    url: `https://api-data.line.me/v2/bot/message/${messageId}/content`,
    responseType: "arraybuffer",
  });
  return originalImage.data;
};

const reply = (token, payload) => {
  return axios({
    method: "post",
    url: "https://api.line.me/v2/bot/message/reply",
    headers: LINE_HEADER,
    data: { replyToken: token, messages: payload },
  });
};

const getUserProfile = (userId) => {
  return axios({
    method: "get",
    url: "https://api.line.me/v2/bot/profile/" + userId,
    headers: LINE_HEADER,
  });
};

const notify = (payload) => {
  return axios({
    method: "post",
    url: "https://notify-api.line.me/api/notify",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Bearer " + process.env.NOTIFY_TOKEN,
    },
    data: qs.stringify(payload),
  });
};

const quickReply = (token) => {
  return axios({
    method: "post",
    url: "https://api.line.me/v2/bot/message/reply",
    headers: LINE_HEADER,
    data: {replyToken: token, messages: [{
      type: "text",
      text: "อยากให้ผมทำอะไรกับรูปภาพ ? ครับ",
      quickReply: { // 2
        "items": [
          {
            "type": "action",
            "action": {
              "type": "postback",
              "label": "วิเคราะห์รูปภาพ",
              "data": "analyze",
            },
          },
          {
            "type": "action",
            "action": {
              "type": "postback",
              "label": "ระบุชนิด",
              "data": "describe",
            },
          },
          {
            "type": "action",
            "action": {
              "type": "postback",
              "label": "วิธีป้องกัน",
              "data": "extract",
            },
          },
          {
            "type": "action",
            "action": {
              "type": "postback",
              "label": "X3",
              "data": "x3",
            },
          },
        ]},
    }]},
  });
};

module.exports = { getImageBinary, reply, getUserProfile, notify,quickReply };