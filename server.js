const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (response, request) => {
    request.send('Just a simple express server configuration')
})

app.listen(8000);