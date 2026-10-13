//The main gateway Express app

import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

export function createGateway() {
  const app = express();

  const upstreamTarget = process.env.UPSTREAM_SERVICE_URL || 'http://localhost:5001';

  // Health check endpoint directly on the Gateway
  app.get('/health', (req, res) => {
    res.json({
      status: 'healthy',
      gateway: 'API Sentinel',
      timestamp: new Date().toISOString()
    });
  });

  // Reverse Proxy Configuration
  const proxy = createProxyMiddleware({
    target: upstreamTarget,
    changeOrigin: true,
    // Optional: Log proxy events to see requests flowing through
    on: {
      proxyReq: (proxyReq, req, res) => {
        // We inject a custom header so upstream knows it passed through Sentinel
        proxyReq.setHeader('x-gateway-forwarded-by', 'api-sentinel');
      },
      error: (err, req, res) => {
        console.error('[Proxy Error]:', err.message);
        res.status(502).json({
          error: 'Bad Gateway',
          message: 'Unable to reach the upstream service.'
        });
      }
    }
  });

  // Forward all other routes to the upstream target
  app.use('/', proxy);

  return app;
}