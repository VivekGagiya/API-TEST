const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const validator = require('validator');
const { ethers } = require('ethers');


const app = express();
const port = process.env.PORT || 3000;

// Ethereum provider setup
const provider = new ethers.providers.JsonRpcProvider('https://rpc-mumbai.maticvigil.com/');
const privateKey = '755467513f6048b06826196ebe875d2136a4ac9b20dea45c7e7aeab94de7a954'; // Replace with private key
const wallet = new ethers.Wallet(privateKey, provider);

// Smart contract setup
const contractAddress = '0x390ac3F7dA731Def06Ef94815E262B3f9114629f';
const contractAbi = [
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "symbol",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "baseTokenURI",
				"type": "string"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "approved",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "Approval",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "operator",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "approved",
				"type": "bool"
			}
		],
		"name": "ApprovalForAll",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "previousOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "Transfer",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "MAXIMUM_GAS_FEE",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "MINIMUM_GAS_FEE",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "approve",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "balanceOf",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "getApproved",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "operator",
				"type": "address"
			}
		],
		"name": "isApprovedForAll",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "recipient",
				"type": "address"
			},
			{
				"internalType": "bytes",
				"name": "metadataURI",
				"type": "bytes"
			}
		],
		"name": "mintNFT",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "name",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "ownerOf",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "renounceOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "safeTransferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			},
			{
				"internalType": "bytes",
				"name": "data",
				"type": "bytes"
			}
		],
		"name": "safeTransferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "operator",
				"type": "address"
			},
			{
				"internalType": "bool",
				"name": "approved",
				"type": "bool"
			}
		],
		"name": "setApprovalForAll",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "baseTokenURI",
				"type": "string"
			}
		],
		"name": "setBaseURI",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes4",
				"name": "interfaceId",
				"type": "bytes4"
			}
		],
		"name": "supportsInterface",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "symbol",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "index",
				"type": "uint256"
			}
		],
		"name": "tokenByIndex",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "index",
				"type": "uint256"
			}
		],
		"name": "tokenOfOwnerByIndex",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "tokenURI",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalSupply",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "transferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
];
const contract = new ethers.Contract(contractAddress, contractAbi, wallet);


// Middleware for parsing JSON requests
app.use(bodyParser.json());

// Function to create a MySQL connection
function createDBConnection() {
  return mysql.createConnection({
    host: '68.178.145.87', // Replace with the IP address of your MySQL server
    user: 'schbangnftdbuser',
    password: 'schbangnftdbuserpassword',
    database: 'schbangnftdb',
  });
}

// API endpoint for checking email existence
app.post('/check-email', (req, res) => {
  const { email } = req.body;
  console.log(email);

  // Validation: Check if email is not empty and is in the proper format
  if (!email || !validator.isEmail(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  // Additional Validation: Check if the email domain is "schbang.com"
  if (!email.endsWith('@schbang.com')) {
    return res.status(400).json({ message: 'Email must have a domain of "schbang.com"' });
  }

  const db = createDBConnection();

  // SQL injection prevention using parameterized queries
  const sql = 'SELECT * FROM users WHERE email = ?';
  db.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    db.query(sql, [email], (err, results) => {
      db.end(); // Close the database connection
      if (err) {
        console.error('SQL error:', err);
        return res.status(500).json({ message: 'Internal server error' });
      }

      if (results.length > 0) {
        return res.json({ message: 'Email exists', emailExists: true });
      } else {
        return res.json({ message: 'Email does not exist', emailExists: false });
      }
    });
  });
});

// API endpoint for user registration
app.post('/register-user', (req, res) => {
  const { name, email, department } = req.body;

  // Validation: Check if any of the fields are null or empty
  if (!name || !email || !department) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Validation: Check if the name contains only alphabets
  if (!/^[a-zA-Z]+$/.test(name)) {
    return res.status(400).json({ message: 'Name should contain only alphabets' });
  }

  // Validation: Check if email is in the proper format
  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  // Additional Validation: Check if the email domain is "schbang.com"
  if (!email.endsWith('@schbang.com')) {
    return res.status(400).json({ message: 'Email must have a domain of "schbang.com"' });
  }

  const db = createDBConnection();

  // SQL injection prevention using parameterized queries
  const sql = 'INSERT INTO users (name, email, department) VALUES (?, ?, ?)';
  db.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    db.query(sql, [name, email, department], (err, results) => {
      db.end(); // Close the database connection
      if (err) {
        console.error('SQL error:', err);
        return res.status(500).json({ message: 'Internal server error' });
      }

      return res.json({ message: 'User registered successfully' });
    });
  });
});

// API endpoint for getting all data from a table
app.get('/get-all-data', (req, res) => {
  const tableName = 'nft_json_records'; // Replace with the actual table name

  const db = createDBConnection();

  const sql = `SELECT * FROM ${tableName}`;

  db.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    db.query(sql, (err, results) => {
      db.end(); // Close the database connection
      if (err) {
        console.error('SQL error:', err);
        return res.status(500).json({ message: 'Internal server error' });
      }

      return res.json({ message: 'Data retrieved successfully', data: results });
    });
  });
});

// API endpoint for minting NFT
app.post('/mint-nft', async (req, res) => {
    const { username, walletAddress, category } = req.body;

    // Validate input fields
    if (!username || !walletAddress || !category) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const db = createDBConnection();
    const selectSQL = 'SELECT * FROM nft_json_records WHERE category = ? AND is_minted = "no" ORDER BY RAND() LIMIT 1';

    db.connect(async (err) => {
        if (err) {
            console.error('Error connecting to MySQL:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }

        try {
            db.query(selectSQL, [category], async (err, results) => {
                if (err) {
                    console.error('SQL query error:', err);
                    db.end();
                    return res.status(500).json({ message: 'Internal server error' });
                }

                if (results.length === 0) {
                    db.end();
                    return res.status(404).json({ message: 'No available NFT data found for the specified category' });
                }

                const nftData = results[0];
                const nftJsonUrl = nftData.nft_json_url;
                const nftId = nftData.nft_id;

                const nftJsonUrlBytes = ethers.utils.toUtf8Bytes(nftJsonUrl);

                try {
                    const mintTransaction = await contract.mintNFT(walletAddress, nftJsonUrlBytes, { value: ethers.utils.parseEther("0.05") });
                    const mintReceipt = await mintTransaction.wait();

                    if (mintReceipt.status === 1) {
                        // Update the "is_minted" value in the "nft_json_records" table
                        const updateNFTSQL = 'UPDATE nft_json_records SET is_minted = "yes" WHERE nft_id = ?';
                        db.query(updateNFTSQL, [nftId], (err, result) => {
                            if (err) {
                                console.error('SQL update error:', err);
                                db.end();
                                return res.status(500).json({ message: 'Internal server error' });
                            }

                            // Update the NFT ID and JSON URL in the "users" table
                            const updateUsersSQL = 'UPDATE users SET nft_id = ?, artwork_url = ? WHERE user_name = ?';
                            db.query(updateUsersSQL, [nftId, nftJsonUrl, username], (err, userResult) => {
                                db.end();
                                if (err) {
                                    console.error('SQL update error:', err);
                                    return res.status(500).json({ message: 'Internal server error' });
                                }

                                return res.json({ message: 'NFT minted successfully' });
                            });
                        });
                    } else {
                        db.end();
                        return res.status(500).json({ message: 'NFT minting failed' });
                    }
                } catch (mintingError) {
                    console.error('Error:', mintingError);
                    db.end();
                    return res.status(500).json({ message: 'Internal server error' });
                }
            });
        } catch (queryError) {
            console.error('SQL query error:', queryError);
            db.end();
            return res.status(500).json({ message: 'Internal server error' });
        }
    });
});





// ... (remaining code)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
