require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT;
const routes = require('./routes/index');
const swaggerJSDoc = require('swagger-jsdoc')
const swaggerUI = require('swagger-ui-express');

// swagger configuration

const swaggerOptions = {
    swaggerDefinition:{
        info: {
            title:"Inventory API",
            version:"1.0.0"
        },
    },
    apis:[
        './routes/*.js'
    ]
}



const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use('/api-docs',swaggerUI.serve, swaggerUI.setup(swaggerDocs));

app.use('/', routes);



// server start
app.listen(port, () => {
    console.log(`running on http://localhost:${port}`);
})

