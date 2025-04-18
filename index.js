require('dotenv').config();
const express = require('express');
const app = express();

app.use(express.json());

app.post('/webhook', (req, res) => {
  const body = req.body;
  const expectedClientState = process.env.CLIENT_STATE;

  console.log('📥 Webhook received body:', JSON.stringify(body, null, 2));

  if (!body.value || !Array.isArray(body.value)) {
    console.warn('⚠️ Webhook payload missing "value" array.');
    return res.sendStatus(400); // Bad request
  }

  body.value.forEach((notification) => {
    if (notification.clientState !== expectedClientState) {
      console.warn('❌ Invalid clientState:', notification.clientState);
      return;
    }

    console.log('✅ Valid Notification:', JSON.stringify(notification, null, 2));
  });

  res.sendStatus(202); // OK
});
