const express = require('express');
const { Client, middleware } = require('@line/bot-sdk');
const fs = require('fs');

const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
};

const client = new Client(config);
const app = express();

app.use(middleware(config));
app.use(express.json());

// 大学名とURLの対応辞書を読み込み
const universityLinks = JSON.parse(fs.readFileSync('universityLinks.json', 'utf8'));

app.post('/webhook', async (req, res) => {
  const events = req.body.events;

  for (const event of events) {
    if (event.type === 'message' && event.message.type === 'text') {
      const keyword = event.message.text.trim();
      const link = universityLinks[keyword];

      const replyText = link
  ? `📎 ${keyword} 募集要項リンク：${link}`
  : `「${keyword}」の情報は登録されていません。`;

      await client.replyMessage(event.replyToken, {
        type: 'text',
        text: replyText
      });
    }
  }

  res.status(200).end();
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
