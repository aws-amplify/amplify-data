import fetch from 'node-fetch';

const checkServer = async (url) => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    if (response.status === 200) {
      console.log(`Success: Server at ${url} is up and returning 200 OK`);
      return true;
    } else {
      console.log(`Failure: Server at ${url} is not returning 200 OK. Status: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.error(`Error: Unable to reach server at ${url}. ${error.message}`);
    return false;
  }
};

const url = 'http://localhost:3000/main.bundle.js';

checkServer(url).then((result) => {
  process.exit(result ? 0 : 1);
});
