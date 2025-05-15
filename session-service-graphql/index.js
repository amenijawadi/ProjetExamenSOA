import { ApolloServer, gql } from 'apollo-server';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Session from './models/Session.js';

dotenv.config();

const typeDefs = gql`
  type Session {
    id: ID!
    title: String!
    date: String!
    studentId: String!
  }

  type Query {
    sessions: [Session]
  }

  type Mutation {
    createSession(title: String!, date: String!, studentId: String!): Session
  }
`;

const resolvers = {
  Query: {
    sessions: async () => await Session.find(),
  },
  Mutation: {
    createSession: async (_, { title, date, studentId }) => {
      const session = new Session({ title, date, studentId });
      return await session.save();
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log("✅ MongoDB connected");
    return server.listen({ port: process.env.PORT });
  })
  .then(({ url }) => {
    console.log(`🚀 GraphQL server ready at ${url}`);
  })
  .catch(err => console.error("MongoDB connection error:", err));
