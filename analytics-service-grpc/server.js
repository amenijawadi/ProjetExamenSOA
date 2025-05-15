 const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const { connect, getCollection } = require('./db');

const PROTO_PATH = path.join(__dirname, 'proto', 'analytics.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const analyticsProto = grpc.loadPackageDefinition(packageDefinition).AnalyticsService;

async function startServer() {
  await connect();
  const collection = getCollection();

  const server = new grpc.Server();

  server.addService(analyticsProto.service, {
    GetFeedbackStats: async (call, callback) => {
      const studentId = call.request.studentId;
      const count = await collection.countDocuments({ studentId });
      callback(null, { count });
    },
    GetSessionStats: async (call, callback) => {
      const sessionId = call.request.sessionId;
      const count = await collection.countDocuments({ sessionId });
      callback(null, { count });
    }
  });

  server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
    console.log(' Analytics gRPC server running on port 50051');
    server.start();
  });
}

startServer();