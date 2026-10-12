const mineflayer = require('mineflayer');
const express = require('express');
const { mineflayer: viewer } = require('prismarine-viewer');

const app = express();
const PORT = process.env.PORT || 10000;

app.get('/', (req, res) => {
  res.send('Minecraft Bot Viewer is online!');
});

app.listen(PORT, () => {
  console.log(`✅ Web Server running on port ${PORT}`);
});

function createBot() {
  const bot = mineflayer.createBot({
    host: process.env.MC_HOST || 'play.amorycraft.com',
    port: parseInt(process.env.MC_PORT) || 25565,
    username: 'BOTAFK001',
    version: '1.20.1' // ⚠️ ลองระบุเวอร์ชันให้ตรงกับเซิร์ฟเวอร์ (เช่น '1.20.1' หรือ '1.19.4') ป้องกันบอทโดนเตะ
  });

  bot.once('spawn', () => {
    console.log('✅ บอทเข้าสู่โลกสำเร็จแล้ว!');
    
    // เปิดระบบหน้าจอ 3D Viewer
    try {
      viewer(bot, { port: 3007, firstPerson: true });
      console.log('🎥 เปิดหน้าจอแสดงผล 3D สำเร็จ!');
    } catch (err) {
      console.log('⚠️ เปิด Viewer ไม่สำเร็จ:', err.message);
    }

    // รอ 3 วินาทีแล้วค่อยพิมพ์ล็อกอิน
    setTimeout(() => {
      const password = 'MyPassword123';
      bot.chat(`/register ${password} ${password}`);
      bot.chat(`/login ${password}`);
      console.log('🔑 ส่งคำสั่งล็อกอินเรียบร้อย');
    }, 3000);
  });

  bot.on('end', (reason) => {
    console.log(`⚠️ บอทหลุดจากเซิร์ฟเวอร์ (สาเหตุ: ${reason}) กำลังเชื่อมใหม่ใน 10 วิ...`);
    setTimeout(createBot, 10000);
  });

  bot.on('error', (err) => {
    console.log('❌ เกิดข้อผิดพลาด:', err);
  });
}

createBot();
