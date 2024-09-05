const fetch = require('node-fetch');
const fs = require('fs');

const urls = [
  'https://jsonplaceholder.typicode.com/posts',
  'https://jsonplaceholder.typicode.com/comments',
  'https://jsonplaceholder.typicode.com/albums',
  'https://jsonplaceholder.typicode.com/photos',
  'https://jsonplaceholder.typicode.com/ManageUsersPage',
  'https://jsonplaceholder.typicode.com/users'
];

async function fetchData() {
  const data = {};

  for (const url of urls) {
    const key = url.split('/').pop();
    try {
      const response = await fetch(url);
      const result = await response.json();
      data[key] = result;
    } catch (error) {
      console.error(`Error fetching ${url}:`, error);
    }
  }

  fs.writeFile('db.json', JSON.stringify(data, null, 2), (err) => {
    if (err) {
      console.error('Error writing to db.json:', err);
    } else {
      console.log('Data successfully written to db.json');
    }
  });
}

fetchData();
