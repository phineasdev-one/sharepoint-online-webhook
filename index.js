require('dotenv').config();
const express = require('express');
const app = express();

// Middleware để parse JSON
app.use(express.json());

// 👉 Bước xác minh webhook: Microsoft sẽ gửi GET kèm validationToken
app.get('/webhook', (req, res) => {
  const validationToken = req.query.validationToken;

  if (validationToken) {
    console.log('🔐 Received validationToken:', validationToken);
    res.status(200).send(validationToken); // Phải trả đúng token để xác minh thành công
  } else {
    console.warn('⚠️ Missing validationToken in GET /webhook');
    res.status(400).send('Missing validationToken');
  }
});

// 👉 Nhận thông báo từ SharePoint (sau khi đã xác minh webhook)
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
    // Bạn có thể xử lý thêm ở đây: ghi log DB, gọi API, gửi noti...
  });

  res.sendStatus(202); // Trả về 202 để SharePoint không gửi lại
});

// Chạy server
const PORT = process.env.PORT || 3007;
app.listen(PORT, () => {
  console.log(`🚀 Webhook Receiver running at http://localhost:${PORT}`);
});
