const mineflayer = require('mineflayer');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 10000;

app.get('/', (req, res) => {
  res.send('Minecraft Bot is Running 24/7!');
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

  // เมื่อเข้าเซิร์ฟเวอร์ -> พิมพ์คำสั่งล็อกอิน
  bot.on('spawn', () => {
    console.log('✅ บอทเชื่อมต่อเข้าเซิร์ฟเวอร์เรียบร้อยแล้ว!');

    setTimeout(() => {
      const password = 'MyPassword123'; // ⚠️ เปลี่ยนเป็นรหัสผ่านของคุณ

      bot.chat(`/register ${password} ${password}`);
      bot.chat(`/login ${password}`);
      console.log('🔑 ส่งคำสั่ง Register / Login เรียบร้อย');

      // รอ 3 วินาที แล้วคลิกขวาไอเทมในมือเพื่อเปิดเมนู
      setTimeout(() => {
        bot.activateItem();
        console.log('👆 คลิกขวาไอเทมในมือเรียบร้อย');
      }, 3000);
    }, 2000);
  });

  // เมื่อหน้าต่างเมนู (GUI) เปิดขึ้นมา -> คลิกเลือกบล็อกหญ้า
  bot.on('windowOpen', async (window) => {
    console.log('🪟 หน้าต่างเมนูเปิดแล้ว กำลังค้นหาบล็อกหญ้า...');

    const grassSlot = window.slots.find(item => item && item.name.includes('grass'));

    if (grassSlot) {
      await bot.clickWindow(grassSlot.slot, 0, 0);
      console.log('🌱 คลิกเลือกบล็อกหญ้าเพื่อเข้าโลกสำเร็จ!');
    } else {
      console.log('⚠️ ไม่พบบล็อกหญ้าในเมนู');
    }
  });

  // ระบบกันโดนเตะ AFK (กระโดดทุก 30 วินาที)
  setInterval(() => {
    if (bot && bot.entity) {
      bot.setControlState('jump', true);
      setTimeout(() => bot.setControlState('jump', false), 500);
    }
  }, 30000);

  // ระบบ Reconnect อัตโนมัติเมื่อหลุด
  bot.on('end', () => {
    console.log('⚠️ บอทหลุดจากเซิร์ฟเวอร์ กำลังเชื่อมต่อใหม่ใน 10 วินาที...');
    setTimeout(createBot, 10000);
  });

  bot.on('error', (err) => {
    console.log('❌ เกิดข้อผิดพลาด:', err);
  });
}

createBot();
