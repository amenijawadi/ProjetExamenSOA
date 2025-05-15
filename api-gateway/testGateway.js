const fetch = require('node-fetch');

async function testApiGateway() {
  const endpoints = [
    '/api/feedbacks',
    '/api/users',
    '/api/users/students',
  ];

  for (const ep of endpoints) {
    try {
      const res = await fetch('http://localhost:3000' + ep);
      console.log(`GET ${ep} => Status: ${res.status}`);
      const text = await res.text();
      console.log(text);
    } catch (err) {
      console.error(`Error fetching ${ep}:`, err.message);
    }
  }
}

testApiGateway();
