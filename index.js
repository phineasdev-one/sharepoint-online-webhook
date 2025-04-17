require('dotenv').config();
const express = require('express');
const app = express();

app.use(express.json());

app.post('/webhook', (req, res) => {
  const notifications = req.body;
  const expectedClientState = process.env.CLIENT_STATE;

  console.log('📥 Webhook received:');
  notifications.forEach((notification) => {
    if (notification.clientState !== expectedClientState) {
      console.warn('❌ Invalid clientState:', notification.clientState);
      return;
    }

    console.log('✅ Valid Notification:', JSON.stringify(notification, null, 2));
  });

  res.sendStatus(202); // Trả lời để SharePoint không gửi lại
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Webhook Receiver running at http://localhost:${PORT}`);
});
