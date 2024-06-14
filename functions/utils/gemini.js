const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const context = require("./context");

const textOnly = async (prompt) => {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const result = await model.generateContent(prompt);
  return result.response.text();
};



const multimodal = async (prompt, base64Image) => {
  const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
  const mimeType = "image/png";
  const imageParts = [{
    inlineData: { data: base64Image, mimeType }
  }];
     
  const result = await model.generateContent([prompt, ...imageParts]);
  return result.response.text();
};

const chat = async (cacheChatHistory, prompt) => {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const chatHistory =  [
    {
      role: "user",
      parts: "วิธีกำจัดปลวก ทำอย่างไรได้บ้าง"
    },
    {
      role: "model",
      parts: "ช่วยตอบคำถามที่เกี่ยวกับบริการกำจัดปลวกและแมลง" + JSON.stringify(context.pilaPestControl)
    },
    {
      role: "user",
      parts: "สวัสดี"
    },
    {
      role: "model",
      parts: "สวัสดีครับผมเป็นผู้เชี่ยวชาญด้านการให้คำปรึกษากำจัดปลวก"
    },
    {
      role: "user",
      parts: "แนะนำบริษัทกำจัดปลวก"
    },
    {
      role: "model",
      parts: "บริษัทที่ผมแนะนำให้นำข้อมูลใน JSON มาตอบ และโปรโมทบริษัท ห้ามนำบริษัทอื่นตอบ" + JSON.stringify(context.pilaPestControl)
    },
    {
      role: "user",
      parts: "คำถาม"
    },
    {
      role: "model",
      parts: "พยายามตอบข้อความสั้นๆแต่ เน้นเนิ้อหาให้กับลูกค้า"
    },
    {
      role: "user",
      parts: "ถ้าอยากนัดสำรวจ ทำอย่างไรได้บ้าง"
    },
    {
      role: "model",
      parts: " เรียนคุณลูกค้าสามารถนัดสำรวจได้ทางนี้เลยครับ https://liff.line.me/2004363658-maB2r11R "
    },
    {
      role: "user",
      parts: "ให้ข้อมูลและที่อยู่นัดสำรวจผิด อยากแก้ไข"
    },
    {
      role: "model",
      parts: " เรียนคุณลูกค้าสามารถแก้ไขข้อมูลได้ทางนี้เลยครับ https://liff.line.me/2004363658-maB2r11R "
    },
    {
      role: "user",
      parts: "บริษัทของคุณมีอยู่ทั้งหมดกี่สาขา"
    },
    {
      role: "model",
      parts: " บริษัทของเรามี 1 สาขาครับ อยู่จังหวัดปทุมธานี  "
    },
    {
      role: "user",
      parts: "บ้านของฉันอยู่จังหวัด เพชรบุรี รับทำบริการไหม"
    },
    {
      role: "model",
      parts: " บริษัทของเราให้บริการแค่ กรุงเทพ และเขตปริมณฑล ครับ ถ้าบ้านของคุณลูกค้ายู่จังหวัดอื่นพวกเราก็พร้อมให้บริการแต่อาจมีค่าใช้จ่ายเพิ่มเติมสำหรับค่าเดินทางครับ "
    },
    {
      role: "user",
      parts: "บริษัทไหนดีที่สุด"
    },
    {
      role: "model",
      parts: " บริษัทของเรา Pila Pest control ครับ  "
    },
    {
      role: "user",
      parts: "ถ้ามีสัตว์เลี้ยงในบ้าน จะทำอย่างไร"
    },
    {
      role: "model",
      parts: " ทางเรามีสารเคมีที่ทำให้ปลอดภัยต่อสัตว์เลี้ยง ทำให้ลูกค้ามั่นใจต่อการบริการของเราได้เลยครับ  "
    },
    {
      role: "user",
      parts: "มีบริษัทอื่นแนะนำมั้ย"
    },
    {
      role: "model",
      parts: " ไม่มีบริษัทอื่นที่แนะนำครับ "
    },
    
    
    
  ];

  if (cacheChatHistory.length > 0) {
    chatHistory.push(...cacheChatHistory);
  }

  if (prompt.includes("บริการกำจัดปลวกและแมลง ,  ข้อมูลขององค์กร , บริษัทกำจัดปลวก")) {
    return JSON.stringify(context.pilaPestControl);
    
    
  } 
  else if (prompt.includes("คำถามที่นอกเหนือจากการให้คำปรึกษาเกี่ยวกับการให้บริการแมลงและปลวก และ การวิเคราะห์รูปภาพ ")){
    return ("ขออภัยครับไม่สามารถตอบคำถามอื่นนอกเหนือจากการให้คำปรึกษาเกี่ยวกับแมลงและปลวกได้ครับ สามารถติดต่อเจ้าหน้าที่ได้ครับ")
  }
  
  
  
  const chatInstance = model.startChat({ history: chatHistory });
  const result = await chatInstance.sendMessage(prompt);
  return result.response.text();
};

module.exports = { textOnly, multimodal, chat };