const cors = require('cors')
const express = require('express')
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')
const mongoose = require('mongoose')
const morgan = require('morgan')
const path = require('path')
const xss = require('xss-clean')
const swaggerJsDocs = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

const config = require('./config')

const app = express()

app.use(morgan('common'))
app.use(helmet({
  contentSecurityPolicy: false
}))
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(xss())
app.use(mongoSanitize())

// <---------------swagger api docs--------------->
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    info: {
      title: 'Expence Tracker API',
      description: 'API documentation for Expence Tracker',
      version: '1.0.0'
    },
    servers: [
      {
        url: 'http://localhost:3000/api/v1'
      }
    ]
  },
  apis: ['./routes/v1/*.js', './routes/v1/Auth/*.js']
}
const swaggerDocs = swaggerJsDocs(swaggerOptions)

app.use(express.static(path.join(__dirname, 'public')))
app.use('/api/v1', require('./routes/v1'))
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))
app.use(require('./routes/errors').clientErrorHandler)
app.use(require('./routes/errors').errorHandler)

mongoose.connect(config.mongoose.connectionString, config.mongoose.options).then(() => {
  console.log('Connected to MongoDB')
  app.listen(config.port, () =>
    console.log(`App listening on port ${config.port}`)
  )
}).catch(err => {
  console.error(err)
  console.log('Failed to connect to MongoDB')
})
