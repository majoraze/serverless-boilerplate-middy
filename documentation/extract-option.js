const fs = require('fs')
const path = require('path')
const document = require('./documentation.json')
const paths = document.paths
const newPaths = {}
const fileName = path.join('documentation', 'documentation.json')

function deleteOption (path) {
  if (path.options) delete path.options
  return path
}

for (const pathFinded in paths) {
  const tempPath = paths[pathFinded]
  newPaths[pathFinded] = deleteOption(tempPath)
}

document.paths = newPaths
fs.writeFileSync(fileName, JSON.stringify(document, null, 2))
