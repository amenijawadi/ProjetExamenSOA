const { gql } = require('graphql-tag');

const typeDefs = gql`
  type Session {
    id: ID!
    title: String!
    date: String!
    studentId: String!
  }

  type Query {
    sessions: [Session]
    feedbackCount(studentId: String!): Int
    sessionFeedbackCount(sessionId: String!): Int
  }
`;

module.exports = typeDefs;
