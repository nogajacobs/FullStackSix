const axios = require('axios');
const fs = require('fs');

const endpoints = [
  'https://jsonplaceholder.typicode.com/posts',
  'https://jsonplaceholder.typicode.com/comments',
  'https://jsonplaceholder.typicode.com/albums',
  'https://jsonplaceholder.typicode.com/photos',
  'https://jsonplaceholder.typicode.com/ManageUsersPage',
  'https://jsonplaceholder.typicode.com/users'
];

const fetchData = async () => {
  try {
    const data = await Promise.all(endpoints.map(url => axios.get(url).then(response => response.data)));

    const dbData = {
      posts: data[0],
      comments: data[1],
      albums: data[2],
      photos: data[3],
      ManageUsersPage: data[4],
      users: data[5]
    };

    fs.writeFile('db.json', JSON.stringify(dbData, null, 2), err => {
      if (err) {
        console.error('Error writing to db.json:', err);
        return;
      }
      console.log('Data successfully written to db.json');
    });
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

fetchData();
