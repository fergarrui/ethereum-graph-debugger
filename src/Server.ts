import 'reflect-metadata'
import { Express } from 'express'
import express = require('express')
import methodOverride = require('method-override')
import * as bodyParser from 'body-parser'
import { logger } from './Logger'
import { transports } from 'winston'
import * as expressWinston from 'express-winston'

export class Server {
  express: Express
  constructor() {
    this.express = express()
    this.express.use(bodyParser.urlencoded({ extended: true }))
    this.express.use(bodyParser.json())
    this.express.use(methodOverride())
  }

  setLogConfig(logLevel: string, productionMode: boolean) {
    const consoleLogConfig: object = productionMode ? { json: true } : { colorize: true }

    if (logLevel === 'info') {
      logger.add(transports.Console, {
        type: 'debug',
        colorize: true,
        prettyPrint: true,
        handleExceptions: true,
        humanReadableUnhandledException: true
      })
    }

    if (logLevel === 'debug') {
      this.express.use(
        expressWinston.errorLogger({
          transports: [new transports.Console(consoleLogConfig)]
        })
      )
    }

    if (logLevel === 'info') {
      this.express.use(
        expressWinston.logger({
          transports: [new transports.Console(consoleLogConfig)]
        })
      )
    }
    return this
  }

  // withErrorHandlers() {
  //   this.express.use(clientError)
  //   this.express.use(systemError)
  //   return this
  // }

  async startOn(port: number): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!port) {
        reject('Invalid port')
        return
      }
      const instance = this.express.listen(port, () => {
        logger.info(`Server Started!`)
        logger.info(`listening on port ${port}`)
        resolve(instance)
      })
    })
  }
}
