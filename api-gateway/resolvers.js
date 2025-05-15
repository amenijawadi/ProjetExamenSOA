const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const { default: fetch } = require('node-fetch');

// Load proto
const packageDef = protoLoader.loadSync('proto/analytics.proto');
const grpcObject = grpc.loadPackageDefinition(packageDef);
const analyticsClient = new grpcObject.AnalyticsService('localhost:50051', grpc.credentials.createInsecure());

module.exports = {
  Query: {
    sessions: async () => {
      const response = await fetch(`${process.env.SESSION_SERVICE_URL}/graphql`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: '{ sessions { id title date studentId } }' })
      });
      const json = await response.json();
      return json.data.sessions;
    },

    feedbackCount: (_, { studentId }) => {
      return new Promise((resolve, reject) => {
        analyticsClient.GetFeedbackStats({ studentId }, (err, res) => {
          if (err) reject(err);
          else resolve(res.count);
        });
      });
    },

    sessionFeedbackCount: (_, { sessionId }) => {
      return new Promise((resolve, reject) => {
        analyticsClient.GetSessionStats({ sessionId }, (err, res) => {
          if (err) reject(err);
          else resolve(res.count);
        });
      });
    }
  }
};
