/*const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const { createProxyMiddleware } = require('http-proxy-middleware');

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// REST proxies
app.use('/api/users', createProxyMiddleware({
  target: process.env.USER_SERVICE_URL,
  changeOrigin: true,
}));

app.use('/api/feedbacks', createProxyMiddleware({
  target: process.env.FEEDBACK_SERVICE_URL,
  changeOrigin: true,
}));

app.use('/api/notifications', createProxyMiddleware({
  target: process.env.NOTIFICATION_SERVICE_URL,
  changeOrigin: true,
}));

// GraphQL server
const server = new ApolloServer({ typeDefs, resolvers });

async function startServer() {
  await server.start();
  app.use('/api/sessions/graphql', expressMiddleware(server));

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`🚀 API Gateway running on http://localhost:${port}`);
  });
}

startServer();
*/











const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv').config();

const app = express();

// Middleware de logging des requêtes
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Configuration des proxys pour chaque service
const proxyRoutes = [

  { 
    path: '/api/users',
    target: process.env.USER_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
    '^/api/users': '/users'
  }
  },
  {
    path: '/api/sessions/graphql',
    target: process.env.SESSION_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
      '^/api/sessions/graphql': '/graphql'
    }
  },
  {
    path: '/api/feedbacks',
    target: process.env.FEEDBACK_SERVICE_URL,
    changeOrigin: true
  },
  {
    path: '/api/notifications',
    target: process.env.NOTIFICATION_SERVICE_URL,
    changeOrigin: true
  }
];

// Application des proxys
proxyRoutes.forEach(route => {
  app.use(route.path, createProxyMiddleware(route));
});

// Route pour vérifier l'état de l'API Gateway
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 API Gateway running on port ${PORT}`);
});