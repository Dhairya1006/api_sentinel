//Server bootstrap & startup
import dotenv from 'dotenv';
dotenv.config();

import { createGateway } from './gateway.js';

const PORT = process.env.PORT || 4000;
const app = createGateway();

app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(` [API Sentinel Gateway] Running on port ${PORT}`);
  console.log(` Forwarding traffic to: ${process.env.UPSTREAM_SERVICE_URL}`);
  console.log(`===============================================`);
});