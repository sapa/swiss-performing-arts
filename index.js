const p = require('barnard59')
const path = require('path')

function convertCsvw (filename) {
  const filenameInput = 'input/STS/' + filename
  const filenameMetadata = filenameInput + '-metadata.json'
  const filenameOutput = 'target/STS/' + path.basename(filename, '.csv') + '.nt'

  return p.rdf.dataset().import(p.file.read(filenameMetadata).pipe(p.jsonld.parse())).then((metadata) => {
    p.file.read(filenameInput)
      .pipe(p.csvw.parse({
        metadata: metadata
      }))
      .pipe(p.ntriples.serialize())
      .pipe(p.file.write(filenameOutput))
  })
}

const filenames = [
  'Entwuerfe.csv',
  'Masken.csv',
  'Modelle.csv',
  'Plakate.csv',
  'RepProfi.csv'
]

p.run(() => {
  p.shell.mkdir('-p', 'target/STS/')

  return p.Promise.serially(filenames, (filename) => {
    console.log('convert: ' + filename)

    return convertCsvw(filename)
  })
}).then(() => {
  console.log('done')
}).catch((err) => {
  console.error(err.stack)
})
