require('dotenv').config();
const express = require('express');
const app = express();

// Middleware để parse JSON đúng chuẩn
app.use(express.json({ type: 'application/json' }));

// 👉 Xác minh webhook
app.get('/webhook', (req, res) => {
  const validationToken = req.query.validationToken;
  if (validationToken) {
    console.log('🔐 Validation token received:', validationToken);
    res.status(200).send(validationToken);
  } else {
    res.status(400).send('Missing validationToken');
  }
});

// 👉 Xử lý notification thực tế
app.post('/webhook', (req, res) => {
  const validationToken = req.query.validationtoken;

  // 👉 Đây là bước xác minh webhook ban đầu
  if (validationToken) {
    console.log('🔐 Validation Token Received:', validationToken);
    return res.status(200).send(validationToken);
  }

  const body = req.body;
  const expectedClientState = process.env.CLIENT_STATE;

  console.log('📥 Webhook received body:', JSON.stringify(body, null, 2));

  if (!body.value || !Array.isArray(body.value)) {
    console.warn('⚠️ Missing or invalid "value" array in webhook payload.');
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

const PORT = process.env.PORT || 3007;
app.listen(PORT, () => {
  console.log(`🚀 Webhook Receiver running at http://localhost:${PORT}`);
});
