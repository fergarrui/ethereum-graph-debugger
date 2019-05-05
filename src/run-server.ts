import { Server } from './Server'
import { RegisterRoutes } from './routes'

import './api/service/controller/DebuggerController'
import './api/service/controller/TransactionController'
import './api/service/controller/FileController'
import './api/service/controller/DisassembleController'
import './api/service/controller/ControlFlowGraphController'
import './api/service/controller/StorageRecoverController'

const server = new Server()
// make it configurable
const port = 9090
RegisterRoutes(server.express)

server.express.use((err: any, _req, res, next) => {
  const status = err.status || 500
  const body: any = {
    message: err.message || 'Sorry, there has been an error',
    name: err.name,
    status,
    error: true
  }
  res.status(status).json(body)
  next()
})

const runServer = () => {
  server.setLogConfig('info' as any, false).startOn(port)
}

server.express.get('/', function(request, response) {
  response.sendFile(__dirname + '/index.html')
})

server.express.get('/bundle.js', function(request, response) {
  response.sendFile(__dirname + '/bundle.js')
})

runServer()
