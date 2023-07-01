const { UploadHandler, connectDatabase, UploadsStorage, createLogger, CommandError } = require('./core')

const process = async (command, args) => {
  const logger = createLogger()
  const db = connectDatabase(logger)

  const storage = new UploadsStorage(db, logger)
  const handler = new UploadHandler(storage, logger)
  
  if (!command) throw new CommandError('Parameter command is required')
  return await handler.handle(command, args)
}
    
exports.main = async (args) => {
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
