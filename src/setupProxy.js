const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
    app.use(
        "/api",
        createProxyMiddleware({
            target: "http://localhost:8080",
            changeOrigin: true,
            timeout: 300000,        // 프록시 → 서버 응답 대기: 5분
            proxyTimeout: 300000,   // 서버 연결 타임아웃: 5분
        })
    );
};
