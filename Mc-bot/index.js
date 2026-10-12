const mineflayer = require('mineflayer');
const express = require('express');

// สร้าง Web Server เพื่อให้ Render รู้ว่าโปรแกรมทำงานอยู่
const app = express();
const PORT = process.env.PORT || 10000;

app.get('/', (req, res) => {
  res.send('Minecraft Bot is running 24/7!');
});

app.listen(PORT, () => {
  console.log(`✅ Web Server running on port ${PORT}`);
});

// ตั้งค่าบอทจาก Environment Variables
function createBot() {
  const bot = mineflayer.createBot({
    host: process.env.MC_HOST || 'play.amorycraft.com',
    port: parseInt(process.env.MC_PORT) || 19132,
    username: process.env.MC_USERNAME || 'BOTAFK001',
    version: false
  });

  // 1. เมื่อเข้าเซิร์ฟเวอร์ -> ล็อกอิน / สมัครสมาชิก
  bot.on('spawn', () => {
    console.log('✅ บอทเชื่อมต่อเข้าเซิร์ฟเวอร์เรียบร้อยแล้ว!');

    setTimeout(() => {
      const password = 'MyPassword123'; // ⚠️ เปลี่ยนเป็นรหัสผ่านของคุณ

      bot.chat(`/register ${password} ${password}`);
      bot.chat(`/login ${password}`);
      console.log('🔑 ส่งคำสั่ง Register / Login เรียบร้อย');

      // รอล็อกอิน 3 วินาที แล้วคลิกขวาไอเทมในมือ (เช่น เข็มทิศเมนู)
      setTimeout(() => {
        bot.activateItem();
        console.log('👆 คลิกขวาไอเทมในมือเรียบร้อย');
      }, 3000);
    }, 2000);
  });

  // 2. เมื่อหน้าต่างเมนู (GUI) เปิดขึ้นมา -> คลิกบล็อกหญ้าเพื่อเข้าโลก
  bot.on('windowOpen', async (window) => {
    console.log('🪟 หน้าต่างเมนูเปิดแล้ว กำลังหาบล็อกหญ้า...');

    const grassSlot = window.slots.find(item => item && item.name.includes('grass'));

    if (grassSlot) {
      await bot.clickWindow(grassSlot.slot, 0, 0);
      console.log('🌱 คลิกเลือกบล็อกหญ้าเพื่อเข้าโลกสำเร็จ!');
    } else {
      console.log('⚠️ ไม่พบบล็อกหญ้าในเมนู');
    }
  });

  // 3. ระบบ Anti-AFK (กระโดดทุกๆ 30 วินาที ป้องกันโดนเตะ)
  setInterval(() => {
    if (bot && bot.entity) {
      bot.setControlState('jump', true);
      setTimeout(() => bot.setControlState('jump', false), 500);
    }
  }, 30000);

  // 4. ระบบ Reconnect อัตโนมัติเมื่อหลุด
  bot.on('end', () => {
    console.log('⚠️ บอทหลุดจากเซิร์ฟเวอร์ กำลังเชื่อมต่อใหม่ใน 10 วินาที...');
    setTimeout(createBot, 10000);
  });

  bot.on('error', (err) => {
    console.log('❌ เกิดข้อผิดพลาด:', err);
  });
}

createBot();
