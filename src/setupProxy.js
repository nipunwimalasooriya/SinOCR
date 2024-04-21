const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://16.171.148.194:8000',
      changeOrigin: true,
    })
  );
};
