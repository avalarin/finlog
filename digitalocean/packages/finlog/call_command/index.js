const { callCommand } = require('./core')

exports.main = async (args) => {
  const { command, req } = args
  return await callCommand(command, req)
}
