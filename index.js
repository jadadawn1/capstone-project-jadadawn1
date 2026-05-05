// Entry point for Express backend
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');
app.use('/api/users', require('./routes/users'));

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));


// API routes
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
