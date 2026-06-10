import express from 'express'
import bootstrap from './src/app.controller.js'
import { PORT } from './config/config.service.js'
const app = express()
const port = PORT ||80

bootstrap(app,express)


app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

