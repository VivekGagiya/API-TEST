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
