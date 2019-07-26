const stdin = process.stdin
const stdout = process.stdout
const inputChunks = []

const targetRestApiName = process.env.APPLICATION_NAME || 'serverless-boilerplate-api'

stdin.resume()
stdin.setEncoding('utf8')

stdin.on('data', function (chunk) {
  inputChunks.push(chunk)
})

stdin.on('end', function () {
  const inputJSON = inputChunks.join('')
  const parsedData = JSON.parse(inputJSON)
  parsedData.items.forEach(function (curr) {
    if (curr.name === targetRestApiName) {
      stdout.write(curr.id)
      stdout.write('\n')
    }
  })
})
