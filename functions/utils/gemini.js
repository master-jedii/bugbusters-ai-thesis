const { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } = require("@google/generative-ai");
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
  const imageParts = [{ inlineData: { data: base64Image, mimeType } }];

  const result = await model.generateContent([prompt, ...imageParts]);
  return result.response.text();
};

const chat = async (cacheChatHistory, prompt) => {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const chatHistory = [
    { 
      role: "user", parts: "บริการกำจัดปลวกและแมลง ทำอย่างไรได้บ้าง" ,
      role: "model", parts: "ช่วยตอบคำถามที่เกี่ยวกับบริการกำจัดปลวกและแมลง" + JSON.stringify(context.pilaPestControl)
    },
    
    { 
      role: "user", parts: "สวัสดี",
      role: "model", parts: "สวัสดีครับผมเป็นผู้เชี่ยวชาญด้านการให้คำปรึกษากำจัดปลวก"
    },
    
    { role: "user", parts: "แนะนำบริษัทกำจัดปลวก" ,
      role: "model", parts: "บริษัทที่ผมแนะนำให้นำข้อมูลใน JSON มาตอบ และโปรโมทบริษัท ห้ามนำบริษัทอื่นตอบ" + JSON.stringify(context.pilaPestControl)
    },
  
    { 
      role: "user", parts: "คำถาม" ,
      role: "model", parts: "พยายามตอบข้อความสั้นๆแต่ เน้นเนื้อหาให้กับลูกค้า"
    },

    { role: "user", parts: "ถ้าอยากนัดสำรวจ ทำอย่างไรได้บ้าง",
      role: "model", parts: "เรียนคุณลูกค้าสามารถนัดสำรวจได้ทางนี้เลยครับ https://liff.line.me/2004363658-maB2r11R"
     },
  
    {
       role: "user", parts: "ให้ข้อมูลและที่อยู่นัดสำรวจผิด อยากแก้ไข",
       role: "model", parts: "เรียนคุณลูกค้าสามารถแก้ไขข้อมูลได้ทางนี้เลยครับ https://liff.line.me/2004363658-maB2r11R"
    },
    { role: "user", parts: "บริษัทของคุณมีอยู่ทั้งหมดกี่สาขา" ,
      role: "model", parts: "บริษัทของเรามี 1 สาขาครับ อยู่จังหวัดปทุมธานี"
    },
    
    { 
      role: "user", parts: "บ้านของฉันอยู่จังหวัด เพชรบุรี รับทำบริการไหม",
      role: "model", parts: "บริษัทของเราให้บริการแค่ กรุงเทพ และเขตปริมณฑล ครับ ถ้าบ้านของคุณลูกค้ายู่จังหวัดอื่นพวกเราก็พร้อมให้บริการแต่อาจมีค่าใช้จ่ายเพิ่มเติมสำหรับค่าเดินทางครับ"
    },
    
    { role: "user", parts: "บริษัทไหนดีที่สุด"
    },
    { role: "model", parts: "บริษัทไหนดีที่สุด" ,role: "model", parts: "บริษัทของเรา Pila Pest control ครับ"
    },
    
    { role: "user", parts: "ถ้ามีสัตว์เลี้ยงในบ้าน จะทำอย่างไร" ,
      role: "model", parts: "ทางเรามีสารเคมีที่ทำให้ปลอดภัยต่อสัตว์เลี้ยง ทำให้ลูกค้ามั่นใจต่อการบริการของเราได้เลยครับ" 
    },
    
    { role: "user", parts: "มีบริษัทอื่นแนะนำมั้ย",
    },
    { 
      role: "model", parts: "ไม่มีบริษัทอื่นที่แนะนำครับ"
    },

    { 
      role: "user", parts: "ถ้าถามว่าราคาบริการปลวกเท่าไหร่",
      role: "model", parts: "ไม่ทราบว่าลูกค้าเป็นบ้านเดี่ยว ทาวน์เฮ้าส์ หรือว่าทาวน์โฮมครับ?"
    }, 
 
    { role: "user", parts: "ถ้าสนใจทำปลวก คิดราคาเท่าไหร่ครับ" ,
      role: "model", parts: "ตอบแบบนี้เลย ขึ้นอยู่กับขนาดและประเภท ไม่ทราบว่าลูกค้าเป็นบ้านเดี่ยว ทาวน์เฮ้าส์ หรือว่าทาวน์โฮมครับ"
      
    },

    { 
      role: "user", parts: "ทาวน์โฮม",
      role: "model", parts: "พื้นที่กี่ตารางเมตรครับ"
    }, 

    { 
      role: "user", parts: "ทาวน์เฮ้าส์",
      role: "model", parts: "พื้นที่กี่ตารางเมตรครับ"
    }, 

    { 
      role: "user", parts: "บ้านเดี่ยวครับ",
      role: "model", parts: "พื้นที่กี่ตารางเมตรครับ"
    }, 
    { 
      role: "user", parts: "บอกว่ากี่ตารางเมตรบริการกำจัดปลวก",
      role: "model", parts: JSON.stringify(context.priceTermite)
    }, 
    
    { 
      role: "user", parts: "ถ้าถามว่าราคาบริการกำจัดมดเท่าไหร่",
      role: "model", parts: "ไม่ทราบว่าลูกค้าเป็นบ้านเดี่ยว ทาวน์เฮ้าส์ หรือว่าทาวน์โฮมครับ?"
    }, 
 
    { role: "user", parts: "ถ้าสนใจทำมด คิดราคาเท่าไหร่ครับ" ,
      role: "model", parts: "ตอบแบบนี้เลย ขึ้นอยู่กับขนาดและประเภท ไม่ทราบว่าลูกค้าเป็นบ้านเดี่ยว ทาวน์เฮ้าส์ หรือว่าทาวน์โฮมครับ"
      
    },

    { 
      role: "user", parts: "ทาวน์โฮม",
      role: "model", parts: "พื้นที่กี่ตารางเมตรครับ"
    }, 

    { 
      role: "user", parts: "ทาวน์เฮ้าส์",
      role: "model", parts: "พื้นที่กี่ตารางเมตรครับ"
    }, 

    { 
      role: "user", parts: "บ้านเดี่ยวครับ",
      role: "model", parts: "พื้นที่กี่ตารางเมตรครับ"
    }, 
    { 
      role: "user", parts: "บอกว่ากี่ตารางเมตรบริการกำจัดมด",
      role: "model", parts: JSON.stringify(context.priceAnt) 
    }, 

    { 
      role: "user", parts: "ถ้าถามว่าราคาบริการกำจัดแมลงสาบ",
      role: "model", parts: "ไม่ทราบว่าลูกค้าเป็นบ้านเดี่ยว ทาวน์เฮ้าส์ หรือว่าทาวน์โฮมครับ?"
    }, 
 
    { role: "user", parts: "ถ้าสนใจทำแมลงสาบ คิดราคาเท่าไหร่ครับ" ,
      role: "model", parts: "ตอบแบบนี้เลย ขึ้นอยู่กับขนาดและประเภท ไม่ทราบว่าลูกค้าเป็นบ้านเดี่ยว ทาวน์เฮ้าส์ หรือว่าทาวน์โฮมครับ"
      
    },

    { 
      role: "user", parts: "ทาวน์โฮม",
      role: "model", parts: "พื้นที่กี่ตารางเมตรครับ"
    }, 

    { 
      role: "user", parts: "ทาวน์เฮ้าส์",
      role: "model", parts: "พื้นที่กี่ตารางเมตรครับ"
    }, 

    { 
      role: "user", parts: "บ้านเดี่ยวครับ",
      role: "model", parts: "พื้นที่กี่ตารางเมตรครับ"
    }, 
    { 
      role: "user", parts: "บอกว่ากี่ตารางเมตรบริการกำจัดแมลงสาบ",
      role: "model", parts: JSON.stringify(context.priceCockroach) 
    }, 

 
    { role: "user", parts: "ถ้าถามว่าราคาบริการกำจัดหนูเท่าไหร่" ,
    },
    {
      role: "model",
      parts: JSON.stringify(context.priceRat)
    },
    

    { 
      role: "user", parts: "มีโปรโมชั่นไหม",
      role: "model", parts: "ไม่มีโปรโมชั่นครับ"
    }, 
    { 
      role: "user", parts: "โอเค",
      role: "model", parts: "สามารถกดปุ่มนัดหมาย หรือ นัดหมายสำรวจผ่านทาง https://liff.line.me/2004363658-maB2r11R ได้เลยครับ"
    }, 
    
    
    
  ];

  if (cacheChatHistory.length > 0) {
    chatHistory.push(...cacheChatHistory);
  }

  if (prompt.includes("บริการกำจัดปลวกและแมลง ,  ข้อมูลขององค์กร , บริษัทกำจัดปลวก")) {
    return JSON.stringify(context.pilaPestControl);
  } else if (prompt.includes("คำถามที่นอกเหนือจากการให้คำปรึกษาเกี่ยวกับการให้บริการแมลงและปลวก และ การวิเคราะห์รูปภาพ ")) {
    return "ขออภัยครับไม่สามารถตอบคำถามอื่นนอกเหนือจากการให้คำปรึกษาเกี่ยวกับแมลงและปลวกได้ครับ สามารถติดต่อเจ้าหน้าที่ได้ครับ";
  }

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
  ];

  const chatInstance = model.startChat({
    history: chatHistory,
    safetySettings: safetySettings,
  });

  const parts = [
    {
      text: "ตอบคำถามโดยอ้างอิงจากข้อมูลภายในองค์กรนี้เท่านั้น\n" + JSON.stringify(context)
    }
  ];

  const result = await chatInstance.sendMessage(prompt,...parts);
  return result.response.text();
};

module.exports = { textOnly, multimodal, chat };