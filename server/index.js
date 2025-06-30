require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);

// Improved CORS configuration
const corsOptions = {
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range']
};

app.use(cors(corsOptions));
const io = socketio(server, { cors: corsOptions });
app.use(express.json());

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Create uploads directory if it doesn't exist
const fs = require('fs');
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

// Test route to check if uploads directory is working
app.get('/test-uploads', (req, res) => {
  const uploadsDir = path.join(__dirname, 'uploads');
  
  if (fs.existsSync(uploadsDir)) {
    const files = fs.readdirSync(uploadsDir);
    res.json({ 
      message: 'Uploads directory exists', 
      files: files,
      uploadsPath: uploadsDir
    });
  } else {
    res.json({ 
      message: 'Uploads directory does not exist',
      uploadsPath: uploadsDir
    });
  }
});

// Import routes (to be created)
const plotRoutes = require('./routes/plots');
const inquiryRoutes = require('./routes/inquiries');
const bookingRoutes = require('./routes/bookings');
const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');
const dealsRoutes = require('./routes/deals');
const messageRoutes = require('./routes/messages');

// Placeholder routes
app.get('/', (req, res) => {
  res.send('API is running');
});

app.use('/api/plots', plotRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/deals', dealsRoutes);
app.use('/api/messages', messageRoutes);

// Socket.IO logic
io.on('connection', (socket) => {
  // User connected

  // Join a deal room for chat
  socket.on('joinDeal', (dealId) => {
    socket.join(dealId);
    // User joined deal room
  });

  // Listen for new messages and broadcast to the room
  socket.on('sendMessage', (data) => {
    // data: { dealId, message }
    io.to(data.dealId).emit('receiveMessage', data.message);
  });

  socket.on('disconnect', () => {
    // User disconnected
  });
});

module.exports.io = io;

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  }); 