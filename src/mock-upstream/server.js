//A dummy service our gateway will protect

import express from 'express';

const app = express();
const PORT = 5001;

app.use(express.json());

// A mock resource representing internal data
app.get('/api/v1/products', (req, res) => {
  res.json({
    status: 'success',
    source: 'Mock Upstream Service (:5001)',
    data: [
      { id: 'prod_1', name: 'Cloud Server Tier A', price: 49.99 },
      { id: 'prod_2', name: 'Database Managed Node', price: 99.00 }
    ]
  });
});

// A dummy POST endpoint to test body forwarding
app.post('/api/v1/orders', (req, res) => {
  res.status(201).json({
    status: 'created',
    source: 'Mock Upstream Service (:5001)',
    order: {
      orderId: `ord_${Date.now()}`,
      item: req.body?.item || 'Default Item',
      createdAt: new Date().toISOString()
    }
  });
});

app.listen(PORT, () => {
  console.log(`[Upstream Service] Running privately at http://localhost:${PORT}`);
});