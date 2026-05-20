require('dotenv').config();
const express = require('express');
const cors = require('cors');
const twilio = require('twilio');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/labor/start', async (req, res) => {
  res.json({ success: true, sessionId: Date.now(), ...req.body });
});

app.get('/api/parts/search', async (req, res) => {
  const q = (req.query.q || '').toLowerCase();
  const parts = [
    { sku:'X15-PM-KIT', name:'Cummins X15 PM Filter Kit', retail_price:'145.10', stock_quantity:2, warehouse_location:'Truck A' },
    { sku:'AB-3030-KIT', name:'Air Brake T30/30 Chamber Kit', retail_price:'210.45', stock_quantity:4, warehouse_location:'Service Truck A' },
    { sku:'HD-HUB-KIT', name:'Heavy Duty Hub Assembly Kit', retail_price:'489.00', stock_quantity:1, warehouse_location:'Main Hub' }
  ].filter(p => `${p.sku} ${p.name}`.toLowerCase().includes(q));
  res.json(parts);
});

app.post('/api/dispatch', async (req, res) => {
  const { clientPhone, clientName, jobAddress, estimatedCost, jobId } = req.body;
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_FROM_NUMBER;
  if (!accountSid || !authToken || !from) return res.status(400).json({ success:false, error:'Twilio env vars missing' });
  const client = twilio(accountSid, authToken);
  const body = `Hello ${clientName}, a Rolling Wrench technician has been dispatched to ${jobAddress}. Estimated quote: $${estimatedCost}. Track job: https://rwpro.app/${jobId}`;
  try {
    const message = await client.messages.create({ body, from, to: clientPhone });
    res.json({ success:true, messageSid: message.sid });
  } catch (error) {
    res.status(500).json({ success:false, error:error.message });
  }
});

app.listen(process.env.PORT || 3000, () => console.log('Rolling Wrench API online'));
