/* lesscompiler.js
 ***** Part of AssassinJS - NSP *****
  - (c)2013 Adithya and Sai Teja under MIT (Open Source) License
  
 This is the file that compiles the *.less files to *.css

*/

var fs = require('fs');
var path = require('path');
var less = require('less');
var LessParser = less.Parser;
//var sourcemap = require('source-map');
//var SourceMapGen = sourcemap.SourceMapGenerator;
var logger = require('./logger');
var rfs = require('./recursiveFS');

var lessFiles = [];

//var fileDir = 'public';
var fileDir = '.';
var noCompileDir = 'lessBlocks';

//Dynamically Reading the public folder to get all the less files
function readLess(callback)
{
	
	//getFileList is the function with parameters as follows
	//first parameter is directory to read
	//second parameter is default directory, true removes the parent dir from each entry in the list
	//third parameter is the file extension to read in the list
	lessFiles = rfs.getFileList(fileDir,true,'less');
	compileLess();
	callback();
	return;
}

function compileLess()
{
	for(file in lessFiles)
	{
		var ext = lessFiles[file].split('.').pop();
		if(ext.toLowerCase() == 'less')
		{
			compileLessFile(lessFiles[file]);
			watchLess(lessFiles[file]);
		}
	}
}

function compileLessFile(filename)
{
	if(filename.indexOf(noCompileDir)>=0)
	{
		logger.write("not compiled "+filename,'lesscompiler.js');
		return;
	}
	var lessExtensionReg = new RegExp('.less$');
	
	var writeSourceMap = function(output) {
		var mapfilename = options.sourceMapFullFilename;
		ensureDirectory(mapfilename);
		//fs.writeFileSync(mapfilename, output, 'utf8');
		fs.writeFile(mapfilename,output,function(err){
			if(err)
				logger.write('file write error for css map file '+mapfilename,'lesscompiler.js');
			else
				logger.write('success writing '+mapfilename,'lesscompiler.js');
		});
	};
	
	var options = {};
	options.paths = [ './'+fileDir +'/' ];
	options.filename = filename;
	options.sourceMap = filename.replace(lessExtensionReg,'.css.map');
	options.sourceMapFilename = filename.replace(lessExtensionReg,'.css.map');
	options.sourceMapFullFilename = fileDir+'/'+filename.replace(lessExtensionReg,'.css.map');
	options.sourceMapBasepath = (filename ? path.dirname(filename) : process.cwd());
	
	var lessdata = fs.readFileSync(fileDir+'/'+filename,'utf-8').toString();
	
	lessParser = new LessParser(options);
	
	lessParser.parse(lessdata, function(err, tree){
		if(err)
			logger.write('Error compiling less to css file '+filename+'  '+err,'lesscompiler.js');
		var css = tree.toCSS({
			sourceMap:Boolean(options.sourceMap),
			sourceMapFilename: options.sourceMapFilename,
			writeSourceMap: writeSourceMap
		});
		
		var cssfilename = fileDir+'/'+filename.replace(lessExtensionReg,'.css');
		ensureDirectory(cssfilename);
		fs.writeFile(cssfilename,css,function(err){
			if(err)
				logger.write('file write error for less to css file '+cssfilename,'lesscompiler.js');
			else
				logger.write('success writing '+cssfilename,'lesscompiler.js');
		});
		
	});
	
	
}

function watchLess(filename)
{
	fs.watchFile(fileDir+filename,{persistent: true, interval: 500 },function (curr, prev) {
		if(curr.mtime != prev.mtime)
		{
			compileLessFile(filename);
			logger.write("called compileLessFile again for "+filename,'lesscompiler.js');
		}
	});
}

function ensureDirectory(filepath)
{
    var dir = path.dirname(filepath),
        cmd,
        existsSync = fs.existsSync || path.existsSync;
    if (!existsSync(dir)) {
        if (mkdirp === undefined) {
            try {mkdirp = require('mkdirp');}
            catch(e) { mkdirp = null; }
        }
        cmd = mkdirp && mkdirp.sync || fs.mkdirSync;
        cmd(dir);
    }
};

exports.readLess = readLess;
exports.compileLess = compileLess;
