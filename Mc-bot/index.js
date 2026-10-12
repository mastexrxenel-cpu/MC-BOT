const mineflayer = require('mineflayer');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 10000;

app.get('/', (req, res) => {
  res.send('Minecraft Bot Status: Online!');
});

app.listen(PORT, () => {
  console.log(`✅ Web Server running on port ${PORT}`);
});

function createBot() {
  const bot = mineflayer.createBot({
    host: process.env.MC_HOST || 'play.amorycraft.com',
    port: parseInt(process.env.MC_PORT) || 25565,
    username: process.env.MC_USERNAME || 'BOTAFK001',
    version: false
  });

  bot.on('spawn', () => {
    console.log('✅ บอทเข้าสู่เซิร์ฟเวอร์แล้ว');

    // 1. ส่งคำสั่งล็อกอิน
    setTimeout(() => {
      const password = 'MyPassword123'; // ⚠️ เปลี่ยนเป็นรหัสผ่านของคุณ
      bot.chat(`/register ${password} ${password}`);
      bot.chat(`/login ${password}`);
      console.log('🔑 ส่งคำสั่ง Register / Login เรียบร้อย');
    }, 2000);

    // 2. ถือเข็มทิศและกดคลิกขวาเปิดเมนู SERVER SELECTOR
    setTimeout(async () => {
      const compass = bot.inventory.items().find(item => item.name.includes('compass'));
      if (compass) {
        await bot.equip(compass, 'hand');
        bot.activateItem();
        console.log('🧭 คลิกขวาใช้เข็มทิศเพื่อเปิดเมนูแล้ว');
      } else {
        bot.activateItem(); // หากไม่พบเข็มทิศ ให้ลองคลิกขวาไอเทมในมือตรงๆ
        console.log('👆 คลิกขวาเปิดเมนู');
      }
    }, 5000);
  });

  // 3. เมื่อเมนู SERVER SELECTOR เปิดขึ้นมา -> สั่งคลิกบล็อกหญ้าทันที
  bot.on('windowOpen', async (window) => {
    console.log('🪟 หน้าต่างเมนูเปิดแล้ว กำลังคลิกบล็อกหญ้า...');

    // รอ 1 วินาทีให้เมนูโหลดไอเทมครบ
    setTimeout(async () => {
      // ค้นหาช่องที่มีบล็อกหญ้า (grass_block) หรือคลิกช่องสล็อตหมายเลข 10 ตรงๆ
      const grassItem = window.slots.find(item => item && item.name.includes('grass'));

      if (grassItem) {
        await bot.clickWindow(grassItem.slot, 0, 0);
        console.log(`🌱 คลิกบล็อกหญ้าที่ช่อง ${grassItem.slot} สำเร็จ!`);
      } else {
        // หากหาชื่อไม่เจอ ให้กดบังคับคลิกช่องสล็อตที่ 10 โดยตรง
        await bot.clickWindow(10, 0, 0);
        console.log('🌱 บังคับคลิกช่องสล็อตที่ 10 สำเร็จ!');
      }
    }, 1000);
  });

  // ระบบ Anti-AFK (กระโดดทุก 30 วินาที)
  setInterval(() => {
    if (bot && bot.entity) {
      bot.setControlState('jump', true);
      setTimeout(() => bot.setControlState('jump', false), 500);
    }
  }, 30000);

  bot.on('end', () => {
    console.log('⚠️ บอทหลุดจากเซิร์ฟเวอร์ กำลังเชื่อมต่อใหม่ใน 10 วินาที...');
    setTimeout(createBot, 10000);
  });

  bot.on('error', (err) => {
    console.log('❌ เกิดข้อผิดพลาด:', err);
  });
}

createBot();
