const dotenv = require('dotenv');
dotenv.config({path: './config.env'});

const app = require('./app');

app.listen(process.env.PORT || 3002, ()=>{
    console.log(`Server started at http://localhost:${process.env.PORT || 3002}`)
})