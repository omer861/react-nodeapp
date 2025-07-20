const express = require('express');
const bodyParser = require('express').json;
const employeeRoutes = require('./routes/employee');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser());
app.use(cors());
app.use('/api/employees', employeeRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req, res) => {
  res.send('Employee Excel CRUD API is running');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 