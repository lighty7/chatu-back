import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import dbConnection from './dbConfig/index.js';
import errorMiddleware from './middleware/errorMiddleware.js';
import router from './routes/index.js';
import path from 'path';
import userRoutes from './routes/userRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8800;
const __dirname = path.resolve();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(bodyParser.json()); // Ensure body-parser middleware is used before the router
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({ limit: '10mb' })); // Ensure express.json() middleware is used before the router

// Serve static files
app.use(express.static(path.join(__dirname, 'views/build')));

// API routes
app.use('/auth', userRoutes);
app.use(router); // Place the router after the middleware

// Catch-all handler for any request that doesn't match above routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/build', 'index.html'));
});

// Error middleware
app.use(errorMiddleware);

// Connect to the database
dbConnection();

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
