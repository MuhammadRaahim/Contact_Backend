const express = require('express');
const dotEnv = require('dotenv').config();
const bodyParser = require('body-parser');
const errorHandler = require('./middleware/errorHandler')
const contactRounter = require('./routes/contactRoutes');
const userRounter = require('./routes/userRoutes');
const connectDb = require('./config/dbConnection');

connectDb();
const app = express();
const port = process.env.PORT;


app.use(express.json())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));
app.use(errorHandler);

app.listen(port, () => {
    console.log(`server running on ${port}`);
});


app.use('/api', contactRounter);
app.use('/api/user', userRounter);


