// Function to check email existence
function checkEmailExistence(email) {
  return fetch('/check-email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  })
    .then((response) => response.json())
    .then((data) => {
      return data; // Contains the response from the API
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

// Function to get all data from a table
function getAllDataFromTable() {
  return fetch('/get-all-data')
    .then((response) => response.json())
    .then((data) => {
      return data; // Contains the response from the API
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

// Function to register a user
function registerUser(name, email, department) {
  const userData = { name, email, department };
  return fetch('/register-user', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  })
    .then((response) => response.json())
    .then((data) => {
      return data; // Contains the response from the API
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

//Function to test mint-nft endpoint
const http = require('http');

async function mintNFT(username, walletAddress, category) {
  const data = JSON.stringify({
    username,
    walletAddress,
    category,
  });

  const options = {
    hostname: 'localhost', // Replace with your server's hostname or IP address
    port: 3000, // Replace with your server's port
    path: '/mint-nft',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length,
    },
  };

  const req = http.request(options, (res) => {
    let response = '';

    res.on('data', (chunk) => {
      response += chunk;
    });

    res.on('end', () => {
      if (res.statusCode === 200) {
        console.log('NFT minted successfully');
      } else {
         // Check if the response contains an error message
         const jsonResponse = JSON.parse(response);
         if (jsonResponse.message) {
           console.error('Error:', jsonResponse.message);
         } else {
           console.error('NFT minting failed');
         }
      }
    });
  });

  req.on('error', (error) => {
    console.error('Error calling /mint-nft:', error.message);
  });

  req.write(data);
  req.end();
}


// Usage example:
mintNFT('Chirag Shah', '0xC8a1930aF1C6dF5Bce3477207662851FbA3df398', 'A-gold');

