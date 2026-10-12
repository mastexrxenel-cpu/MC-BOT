const mineflayer = require('mineflayer');
const express = require('express');

// --- 1. ตั้งค่า Web Server เพื่อรองรับ UptimeRobot ---
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Minecraft Bot Status: Online!');
});

app.listen(PORT, () => {
  console.log(`Web server running on port ${PORT}`);
});

// --- 2. ตั้งค่าบอท Minecraft ---
function createBot() {
  const bot = mineflayer.createBot({
    host: process.env.MC_HOST || 'PLAY.YOURSERVER.COM', // IP ของเซิร์ฟเวอร์
    port: parseInt(process.env.MC_PORT) || 25565,        // Port
    username: process.env.MC_USERNAME || 'BotName',      // ชื่อบอท
    // auth: 'microsoft' // ปลดล็อกคอมเมนต์นี้หากใช้ไอดีแท้ Microsoft
  });

  bot.on('spawn', () => {
    console.log('✅ บอทเข้าเซิร์ฟเวอร์เรียบร้อยแล้ว!');
  });

  bot.on('chat', (username, message) => {
    if (username === bot.username) return;
    if (message === '!ping') {
      bot.chat('pong!');
    }
  });

  bot.on('error', (err) => console.log('❌ Bot Error:', err));

  // หากหลุด ให้เชื่อมต่อใหม่โดยอัตโนมัติ
  bot.on('end', () => {
    console.log('⚠️ บอทหลุดจากเซิร์ฟเวอร์ กำลังเชื่อมต่อใหม่ใน 10 วินาที...');
    setTimeout(createBot, 10000);
  });
}

createBot();
