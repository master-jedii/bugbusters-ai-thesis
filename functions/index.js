const { onRequest } = require("firebase-functions/v2/https");
const { setGlobalOptions } = require("firebase-functions/v2");
setGlobalOptions({ maxInstances: 10 });
const line = require("./utils/line");
const gemini = require("./utils/gemini");
const dialogflow = require("./utils/dialogflow");
const firestore = require("./utils/firestore");
const { WebhookClient } = require("dialogflow-fulfillment");
const NodeCache = require("node-cache");
const myCache = new NodeCache();
const axios = require("axios");

const CACHE_IMAGE = "image_";
const CACHE_CHAT = "chat_";

exports.webhook = onRequest(async (req, res) => {
  if (req.method === "POST") {
    const events = req.body.events;

    for (const event of events) {
      var userId = event.source.userId;
      var replyToken = event.replyToken;
      await loading(userId);
      var userData = await firestore.getUser(userId);

      var userMode = "bot";
      if (userData == undefined) {
        let profile = await line.getUserProfile(userId);
        await firestore.updateUser(profile.data, userMode);
      } else {
        userMode = userData.mode;
      }

      switch (event.type) {
        
        case "message":
          if (event.message.type === "text") {

            const prompt = event.message.text;

            const cacheImage = myCache.get(CACHE_IMAGE + userId);
            if(cacheImage){
              const text = await gemini.multimodal(prompt , cacheImage);
              await line.reply(event.replyToken,[{type : "text" , text:text}])
              break
            }
            

            


            var notifyStatus = myCache.get("NotifyTheStaff");
            if (notifyStatus === undefined) {
              notifyStatus = [];
            }

            if (event.message.text.toLowerCase() == "mode") {
              await line.reply(replyToken, [
                {
                  type: "text",
                  text:
                    "ตอนนี้คุณอยู่ในโหมดคุยกับ " +
                    userMode +
                    " หากต้องการเปลี่ยนโหมดสามารถเลือกได้เลยครับ",
                  quickReply: {
                    items: [
                      {
                        type: "action",
                        action: {
                          type: "message",
                          label: "Bot",
                          text: "Bot",
                        },
                      },
                      {
                        type: "action",
                        action: {
                          type: "message",
                          label: "ติดต่อเจ้าหน้าที่",
                          text: "ติดต่อเจ้าหน้าที่",
                        },
                      },
                    ],
                  },
                },
              ]);
              return res.end();
            } else if (event.message.text.toLowerCase() == "gemini") {
              console.log("Change mode to Gemini");
              await line.reply(replyToken, [
                {
                  type: "text",
                  text: "สามารถสอบถามและรับคำปรึกษาได้เลยครับ",
                },
                
              ]);
              
              await firestore.updateUser(userData, "bot");
              return res.end();
            } else if (event.message.text.toLowerCase() == "bot") {
              console.log("Change mode to Bot");
              await line.reply(replyToken, [
                {
                  type: "text",
                  text: "สามารถสอบถามและรับคำปรึกษาได้เลยครับ",
                },
                {
                  type: "text",
                  text: "บอทอาจใช้เวลาในการตอบคำถามนานเล็กน้อย โปรดรอสักครู่นะครับ ",
                },
              ]);
              
              await firestore.updateUser(userData, "bot");
              return res.end();
              

              

            } else if (event.message.text.toLowerCase() == "ติดต่อเจ้าหน้าที่") {
              console.log("Change mode to ติดต่อเจ้าหน้าที่");
              await line.reply(replyToken, [
                {
                  type: "text",
                  text: "ติดต่อเจ้าหน้าที่แล้วครับ สามารถสอบถามต่อได้เลย",
                },
              ]);
              await firestore.updateUser(userData, "ติดต่อเจ้าหน้าที่");
              return res.end();
            }
            
            console.log("User Mode " + userMode);
            

            if (userMode == "ติดต่อเจ้าหน้าที่") {
              if (!notifyStatus.includes(userId)) {
                notifyStatus.push(userId);
                await line.notify({
                  message:
                    "มีผู้ใช้ชื่อ " +
                    userData.displayName +
                    " ต้องการติดต่อ " +
                    event.message.text,
                  imageFullsize: userData.pictureUrl,
                  imageThumbnail: userData.pictureUrl,
                });
                await line.reply(replyToken, [
                  {
                    type: "text",
                    text: "เราได้แจ้งเตือนไปยังเจ้าหน้าที่แล้วครับ รอสักครู่ครับ ",
                  },
                ]);
              }
              if(userData.conversationstaff == undefined)
              {
                userData.conversationstaff = [];
              }
              else 
              {
                userData.conversationstaff.push(event.message.text);
              }
              await firestore.updateUser(userData , userMode);
              myCache.set("NotifyTheStaff", notifyStatus, 120);
              return res.end();
            } else if (userMode == "gemini") {
              let question = event.message.text;
              const msg = await gemini.chat(question);
              console.log(msg);
              if (msg.includes("ขออภัยครับ ไม่พบข้อมูลดังกล่าว")) {
                await line.reply(replyToken, [
                  {
                    type: "text",
                    text: "ขออภัยครับ ไม่พบข้อมูลดังกล่าว ตอนนี้คุณอยู่ในโหมดคคุยกับ Bot คุณสามารถถามคำถามต่อไป หรือหากต้องการเปลี่ยนโหมดติดต่อเจ้าหน้าที่ สามารถเลือกได้เลย",

                    quickReply: {
                      items: [
                        {
                          type: "action",
                          action: {
                            type: "message",
                            label: "ติดต่อเจ้าหน้าที่",
                            text: "ติดต่อเจ้าหน้าที่",
                          },
                        },
                      ],
                    },
                  },
                ]);
              } else {
                await line.reply(replyToken, [
                  {
                    type: "text",
                    sender: {
                      name: "ให้คำปรึกษา",
                      iconUrl: "https://blogger.googleusercontent.com/img/a/AVvXsEjvvsTbETpRZLOEs7SCzWgsvE2XkdAWVzUTKCMIvx2_pJPpoMsG9IkbbTDtgQdE3XX0DJHjTqtU6NwvUatzp-eqnfWfKXmLb-Y0d1ep1Yti4y14k0SMOhGYDyz7DBj3xHYNF3uG-aFJs9cPdF2J_0LhQ3wAxKgXA9PmnB6r2LEu_XOG5vsV9T3GnH5xdKGE",
                    },
                    text: msg,
                  },
                ]);
              }
              return res.end();
            } else if (userMode == "bot") {
              await dialogflow.postToDialogflow(req);
              return res.end();
            }
          }
          if (event.message.type === "image") {
            const imageBinary = await line.getImageBinary(event.message.id);
            const imageBase64 = Buffer.from(imageBinary,"binary").toString("base64");
            myCache.set(CACHE_IMAGE + userId, imageBase64, 25);
          
            await line.reply(event.replyToken, [{
              type: "text",
              text: "อยากให้ผมทำอะไรกับภาพนี้ครับ?",
              quickReply: {
                items: [
                  {
                    type: "action",
                    action: {
                      type: "message",
                      label: "ระบุชนิด",
                      text: "ระบุชนิด",
                    },
                  },
                  {
                    type: "action",
                    action: {
                      type: "message",
                      label: "วิธีป้องกัน",
                      text: "วิธีป้องกัน",
                    },
                  },
                  {
                    type: "action",
                    action: {
                      type: "message",
                      label: "วิเคราะห์รูปภาพ",
                      text: "วิเคราะห์รูปภาพ",
                    },
                  },
                ],
              },
            }]);
          }
          
        
        
      }
    }
  }
  return res.send(req.method);
});

exports.dialogflowFulfillment = onRequest(async (req, res) => {
  console.log("Dialogflow Fullfillment");
  if (req.method === "POST") {
    let userId =
      req.body.originalDetectIntentRequest.payload.data.source.userId;
    let replyToken =
      req.body.originalDetectIntentRequest.payload.data.replyToken;

    var userData = await firestore.getUser(userId);
    var userMode = "bot";
    await firestore.updateUser(userData, userMode);

    const agent = new WebhookClient({ request: req, response: res });
    console.log("Query " + agent.query);

    let question = agent.query;
    let chatHistory = myCache.get(CACHE_CHAT + userId);
    if(!chatHistory){chatHistory = [];}

    const msg = await gemini.chat(chatHistory,question);
   

    console.log(msg);
    if (msg.includes("ขออภัยครับ ไม่พบข้อมูลดังกล่าว")) {
      await line.reply(replyToken, [
        {
          type: "text",
          text: "ขออภัยครับ ไม่พบข้อมูลดังกล่าว ตอนนี้คุณอยู่ในโหมดคุยกับ Bot คุณสามารถถามคำถามต่อไป หรือหากต้องการเปลี่ยนโหมดติดต่อเจ้าหน้าที่ได้เลย",

          quickReply: {
            items: [
              {
                type: "action",
                action: {
                  type: "message",
                  label: "ติดต่อเจ้าหน้าที่",
                  text: "ติดต่อเจ้าหน้าที่",
                },
              },
            ],
          },
        },
      ]);
    } else {
      await line.reply(replyToken,[{type : 'text' , text :msg}]);

            console.log("Change mode to Bot");
            chatHistory.push({role: "user" , parts: question});
            chatHistory.push({role: "model" , parts: msg});

            myCache.set(CACHE_CHAT + userId , chatHistory , 60)
    }


    return res.end();
  }
  return res.send(req.method);
});



function loading(userId) {
  return axios({
    method: "post",
    url: "https://api.line.me/v2/bot/chat/loading/start",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.CHANNEL_ACCESS_TOKEN}`
    },
    data: { chatId: userId }
  })
  .then(response => {
    console.log("Loading started:", response.data);
  })
  .catch(error => {
    console.error("Error starting loading:", error.response ? error.response.data : error.message);
  });
}
