var path = require('path');
var fs = require('fs');
var through = require('through2');

function toBase64(options) {
    var opts = options || {};
    var rule = opts.rule || /url\([^\)]+\)/g;
    var initFileType = opts.filetype || 'css';
    var baseDir = opts.baseDir || '.';

    return through.obj(function (file, enc, cb) {
        if (file.isNull()) {
            this.push(file);
            return cb();
        }

        if (file.isStream()) {
            this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
            return cb();
        }

        var content = file.contents.toString();
        var images = content.match(rule);
        var currentPath = __dirname + '../../../' + baseDir;
        images.forEach(function(item) {
            imageURL = item.replace(/\(|\)|\'/g, '');
            imageURL = imageURL.replace(/^url/g, '');
            var route = path.join(currentPath, imageURL);
            var filepath = fs.realpathSync(route);
            console.log(filepath);
            var extname = path.extname(imageURL).slice(1);
            var imageContent = new Buffer(fs.readFileSync(filepath)).toString('base64');
            typemap = {
                png:"image/png",
                jpeg:"image/jpg",
                jpg:"image/jpg",
                mp3:"audio/mp3",
                xml:"text/xmldata",
                js:"text/javascript"

            };            
            content = content.replace(item, 'data:' + typemap[extname.toLowerCase()] + ';base64,' + imageContent);
        });

        file.contents = new Buffer(content);
        this.push(file);

        cb();
    });
}

module.exports = toBase64;