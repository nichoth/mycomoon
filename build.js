var fs = require('fs')
var path = require('path')
var mkdirp = require('mkdirp')
const matter = require('gray-matter')
const marked = require('marked')
var hyperstream = require('hyperstream')

fs.readdir(__dirname + '/src/_pages', (err, files) => {
    if (err) throw err

    files.forEach(fileName => {
        var name = path.basename(fileName, '.md')
        var dirPath = path.join(__dirname + '/public', name)

        mkdirp(dirPath).then(() => {
            console.log('made dir', dirPath)
            // then write the index file
            var srcPath = __dirname + '/src/_pages/' + fileName 
            fs.readFile(srcPath, (err, content) => {
                if (err) throw err

                var hs = hyperstream({
                    'body': {
                        class: { append: 'page-' + name }
                    },
                    '#content': {
                        _appendHtml: marked( matter(content).content )
                    }
                })

                var rs = fs.createReadStream(__dirname + '/src/_index.html');
                var ws = fs.createWriteStream(dirPath + '/index.html')
                rs.pipe(hs).pipe(ws)
            })
        })
    })
})
