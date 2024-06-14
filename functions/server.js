const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

// CORS Middleware
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // ปรับให้อนุญาตทุก origin หรือระบุเฉพาะ origin ที่ต้องการอนุญาต
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
});

app.post('/send-message', async (req, res) => {
    try {
        const accessToken = 'ARt7mWOWXP6E0nMzCO8oBwPl8AJWiSe5ZsiaC+++px2/Tcc/JMLd8TYe5zPoXMGXe1P5pxUVTDPyouhErZhkwBam8Cqi/hPGJV6HT5AztVmhG2qcUdasYB6Uv5UBRCWSw9MLd6h3cXBysQN0jYPyaQdB04t89/1O/w1cDnyilFU='; // ใส่ Access Token ของคุณที่นี่
        const url = 'https://api.line.me/v2/bot/message/push';

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        };

        const data = req.body;

        const response = await axios.post(url, data, { headers });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.response ? error.response.data : error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
