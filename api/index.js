const express = require('express');
const cors = require('cors');

const userRoutes = require('./routes/userRoutes');

const { errorHandler } = require('./middlewares/errorHandler');

const connectDB = require('./db');
const { PORT } = require('./config');

connectDB();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/users', userRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});