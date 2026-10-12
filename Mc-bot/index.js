const mineflayer = require('mineflayer');
const express = require('express');

// สร้างเว็บเซิร์ฟเวอร์ Express เพื่อเปิดพอร์ตให้ Render ใช้งานตลอด 24 ชั่วโมง
const app = express();
const PORT = process.env.PORT || 10000;

app.get('/', (req, res) => {
  res.send('Minecraft Bot Status: Online & Ready!');
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
    console.log('✅ บอทเข้าสู่เซิร์ฟเวอร์แล้ว กำลังทำรายการ...');

    // 1. ส่งคำสั่งล็อกอินและสมัครสมาชิกอัตโนมัติ
    setTimeout(() => {
      const password = 'MyPassword123'; // ⚠️ เปลี่ยนเป็นรหัสผ่านของคุณ
      bot.chat(`/register ${password} ${password}`);
      bot.chat(`/login ${password}`);
      console.log('🔑 ส่งคำสั่ง Register / Login เรียบร้อย');
    }, 3000);

    // 2. ควักเข็มทิศขึ้นมาถือและคลิกขวาเปิดเมนู SERVER SELECTOR
    setTimeout(async () => {
      const compass = bot.inventory.items().find(item => item.name.includes('compass') || item.name.includes('clock'));
      if (compass) {
        await bot.equip(compass, 'hand');
        bot.activateItem();
        console.log('🧭 คลิกขวาใช้เข็มทิศเพื่อเปิดเมนูแล้ว');
      } else {
        // หากไม่เจอในช่องเก็บของ ให้คลิกขวาไอเทมในมือหลักทันที
        bot.activateItem();
        console.log('👆 คลิกขวาเปิดเมนูด้วยไอเทมในมือ');
      }
    }, 6000);
  });

  // 3. ระบบดักจับหน้าต่างเมนู (GUI) เมื่อเปิดขึ้นมา
  bot.on('windowOpen', async (window) => {
    console.log('🪟 หน้าต่างเมนู GUI เปิดขึ้นมาแล้ว!');

    // รอ 1 วินาทีให้ช่องในหน้าต่างโหลดข้อมูลไอเทมครบ
    setTimeout(async () => {
      try {
        // บังคับคลิกช่องสล็อตที่ 10 ทันที (ที่เป็นบล็อกหญ้าตามภาพที่คุณส่งมา)
        await bot.clickWindow(10, 0, 0);
        console.log('🌱 คลิกบล็อกหญ้าที่ช่อง 10 สำเร็จ!');
      } catch (err) {
        console.log('⚠️ เกิดข้อผิดพลาดในการคลิกเมนู:', err.message);
      }
    }, 1000);
  });

  // ระบบกันโดนเตะ AFK (ขยับตัว/กระโดดเบาๆ ทุก 30 วินาที)
  setInterval(() => {
    if (bot && bot.entity) {
      bot.setControlState('jump', true);
      setTimeout(() => bot.setControlState('jump', false), 500);
    }
  }, 30000);

  // ระบบเชื่อมต่อใหม่เมื่อหลุดจากเซิร์ฟเวอร์
  bot.on('end', (reason) => {
    console.log(`⚠️ บอทหลุดจากเซิร์ฟเวอร์ (สาเหตุ: ${reason}) กำลังเชื่อมต่อใหม่ใน 10 วินาที...`);
    setTimeout(createBot, 10000);
  });

  bot.on('error', (err) => {
    console.log('❌ เกิดข้อผิดพลาด:', err);
  });
}

createBot();
