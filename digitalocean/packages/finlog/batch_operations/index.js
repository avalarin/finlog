const { UploadHandler, connectDatabase, UploadsStorage, createLogger, CommandError } = require('./core')

const process = async (command, args) => {
  const logger = createLogger()
    const db = connectDatabase(logger)

    const storage = new UploadsStorage(db, logger)
    const handler = new UploadHandler(storage, logger)
  
    if (!command) throw new CommandError('Parameter command is required')
    else if (command === 'start') {
      const { ownerId, contentString, params } = args
      return await handler.create(ownerId, contentString, params)
    } else if (command === 'get') {
      const { id, ownerId } = args
      return await handler.get(id, ownerId)
    } else if (command === 'update_params') {
      const { id, ownerId, params } = args
      return await handler.updateParams(id, ownerId, params)
    } else if (command === 'complete') {
      const { id, ownerId } = args
      return await handler.complete(id, ownerId)
    } else {
      throw new CommandError(`Unknown command ${command}`)
    }
  }
  
export const main = async (args) => {
    const { command } = args
  
    try {
      const result = await process(command, args)
      return {
        body: {
          status: 'ok',
          result: result
        }
      }
    } catch (err) {
      if (err.userMessage) {
        return {
          body: {
            status: 'error',
            error: err.userMessage
          }
        }
      }
  
      console.error('Unexpected error occurred', err)
      return {
        body: {
          status: 'error'
        }
      }
    }
  }
  