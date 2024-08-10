const express = require('express');
const dataRoutes = require('./routes/dataRoutes.js');
const { pool } = require('./db.js');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api/data', dataRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
