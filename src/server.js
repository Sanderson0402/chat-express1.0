const express = require('express');
const socketio = require('socket.io');
const bodyParser = require('body-parser');
const path = require("path");
const mysql = require('mysql');

const app = express();
const server = require('http').createServer(app);
const cors = require('cors');
const io = socketio(server, { 
    'transports': ['websocket', 'polling'], 
    'cors': {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST']
    }
});

// Create a MySQL connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'CHAT'
});

// Connect to MySQL
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Middleware
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// Handle login request
app.post('/', (req, res) => {
    const { username, password } = req.body;
  
    connection.query(
      'SELECT * FROM USER WHERE NOME = ? AND SENHA = ?',
      [username, password],
      (err, results) => {
        if (err) {
          console.error('Error querying database:', err);
          return res.status(500).json({ message: 'Internal server error' });
        }
  
        if (results.length === 1) {
            socket.username = username;
            return res.status(200).json({ message: 'Authenticated' });
        } else {
          return res.status(401).json({ message: 'Unauthorized' });
        }
      }
    );
  });

let messages = [];

// Fetch old messages from the database
connection.query('SELECT * FROM CHAT', function (err, rows, fields) {
  if (err) throw err;

  rows.forEach(row => {
    messages.push({
      author: row.NICKNAME,
      message: row.MSG
    });
  });
});

io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  // Send old messages to the connected client
  socket.emit('previousMessages', messages);

  // Listen for new messages from clients
  socket.on('sendMessage', ({ author, message }) => {
    // Insert the message into the database
    connection.query('INSERT INTO CHAT (NICKNAME, MSG) VALUES (?, ?)', [author, message], (error, results, fields) => {
      if (error) {
        console.log('Error inserting message into database:', error);
      } else {
        // Create the new message object
        const newMessage = { author, message };
        messages.push(newMessage);

        // Broadcast the new message to all clients
        socket.emit('receivedMessage', newMessage);
        socket.broadcast.emit('receivedMessage', newMessage);
      }
    });
  });

  // Handle client disconnect
  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

server.listen(5000, () => {
  console.log('Server is listening on port 5000');
});
