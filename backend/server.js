const express = require('express'); // Import Express framework
const cors = require('cors');  //allows frontend to acces backend
require('dotenv').config(); // loads environment variables from a .env file into process.env

const app = express(); //create express app
const PORT = process.env.PORT || 8080; // Define the port, 8080 if not set

app.use(cors()); // Enable CORS for all routes (cross-origin requests)
app.use(express.json()); // Middleware to parse JSON request bodies

// Simple test route
app.get('/', (req, res)=> {
    res.json({ message: 'NakUrut backend berjaya yeyy!🙌'});
});

// Start the server
app.listen(PORT, ()=> {
    console.log(`Server tengah running kat http://localhost:${PORT}`);
})