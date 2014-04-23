/* viewcompiler.js
 ***** Part of AssassinJS - NSP *****
  - (c)2013 Adithya and Sai Teja under MIT (Open Source) License
  
 This is the file that compiles the *.nsp files to *.nsp.js to be executed

*/

var fs = require('fs');
var logger = require('./logger');
var rfs = require('./recursiveFS');

var nspFiles = [];

//var fileDir = 'public';
var fileDir = './';

//Dynamically Reading the nsp folder to get all the nsp files
function readNSP(callback)
{
	//nspFiles = fs.readdirSync('./nsp/');
	
	//getFileList is the function with parameters as follows
	//first parameter is directory to read
	//second parameter is default directory, true removes the parent dir from each entry in the list
	//third parameter is the file extension to read in the list
	nspFiles = rfs.getFileList(fileDir,true,'nsp'); 
	rfs.createRecursiveDirectories(fileDir,'compiled_views');
	compileNSP();
	callback();
	return;
}

function compileNSP()
{
	for(file in nspFiles)
	{
		var ext = nspFiles[file].split('.').pop();
		if(ext.toLowerCase() == 'nsp')
		{
			compileNSPFile(nspFiles[file]);
			watchNSP(nspFiles[file]);
		}
	}
}

function compileNSPFile(filename)
{
	var nspStartDirectoryReg = new RegExp('^nsp/');
	var nspExtensionReg = new RegExp('.nsp$');
	var compiledCode = '';
	
	compiledCode = compiledCode + fs.readFileSync('./system/respond.js','utf-8').toString();
	
	compiledCode = compiledCode + "\r\n\r\n/*\r\nThe NSP Response starts from here\r\n*/";
	compiledCode = compiledCode + "\r\n\r\nfunction render(__request,__response,__dataObj){\r\nvar outputstr='';\r\n";
	compiledCode = compiledCode + "\r\ntry{";
	var filedata = fs.readFileSync(fileDir+'/'+filename,'utf-8').toString();
	//logger.write('view contents '+filedata,'viewcompiler');
	if(filedata.trim().indexOf('<$!$>') != 0)
		compiledCode = compiledCode+getCompiledCode(filedata);
	compiledCode = compiledCode+"__createResponse(__response,200,{'Content-Type': 'text/html'},outputstr);\r\n/**/}\r\n";
	compiledCode = compiledCode+"catch(err){__createResponse(__response,200,{'Content-Type': 'text/plain'},err.toString());\r\n/**/}\r\n";
	compiledCode = compiledCode+"}\r\nexports.render = render;";
	//fs.writeFile('compiled_views/'+filename+'.js',compiledCode,function(err){
	//	if(err)
	//		logger.write('file write error for view file '+filename,'viewcompiler.js');
		//else
			//logger.write('file write successful for view file '+filename,'viewcompiler.js');
	//});
	try
	{
		fs.writeFileSync('compiled_views/'+filename+'.js',compiledCode);
	}
	catch(err)
	{
		logger.write('file write error for view file '+filename,'viewcompiler.js');
	}
}

function compileNSPFileAsync(filename)
{
	var nspStartDirectoryReg = new RegExp('^nsp/');
	var nspExtensionReg = new RegExp('.nsp$');
	var compiledCode = '';
	
	fs.readFileSync('./system/respond.js','utf-8',function(err,data){
		compiledCode = compiledCode + data.toString();
		compiledCode = compiledCode + "\r\n\r\n/*\r\nThe NSP Response starts from here\r\n*/";
		compiledCode = compiledCode + "\r\n\r\nfunction render(__request,__response,__dataObj){\r\nvar outputstr='';\r\n";
		compiledCode = compiledCode + "\r\ntry{";
		
		fs.readFileSync(fileDir+'/'+filename,'utf-8',function(err,data2){
			var filedata = data2.toString();
			//logger.write('view contents '+filedata,'viewcompiler');
			if(filedata.trim().indexOf('<$!$>') != 0)
				compiledCode = compiledCode+getCompiledCode(filedata);
			compiledCode = compiledCode+"__createResponse(__response,200,{'Content-Type': 'text/html'},outputstr);\r\n/**/}\r\n";
			compiledCode = compiledCode+"catch(err){__createResponse(__response,200,{'Content-Type': 'text/plain'},err.toString());\r\n/**/}\r\n";
			compiledCode = compiledCode+"}\r\nexports.render = render;";
			fs.writeFile('compiled_views/'+filename+'.js',compiledCode,function(err){
				if(err)
					logger.write('file write error for view file '+filename,'viewcompiler.js');
				//else
					//logger.write('file write successful for view file '+filename,'viewcompiler.js');
			});
		});
	});
}

function getCompiledCode(filedata)
{
	var compiledCode='';
	if(filedata!=null || filedata!=undefined)
	{
		var startTagSplit = filedata.split('<$');
		for(line in startTagSplit)
		{
			if(startTagSplit[line].indexOf('$>')!=-1)
			{
				var endTagSplit = startTagSplit[line].split('$>');
				if(endTagSplit[0] != null && endTagSplit[0] != undefined)
				{
					if((/^=/).test(endTagSplit[0]))
					{
						compiledCode = compiledCode+"var expression"+endTagSplit[0]+";\r\n\t";
						compiledCode = compiledCode+"outputstr=outputstr+expression;\r\n";
					}
					else if((/^@/).test(endTagSplit[0]))
					{
						//globalCode = globalCode+endTagSplit[0];
						var includeFile = endTagSplit[0].split(/^@/)[1].trim();
						var includeData = fs.readFileSync(fileDir+'/'+includeFile,'utf-8').toString();
						compiledCode = compiledCode+getCompiledCode(includeData);
					}
					else if((/^!/).test(endTagSplit[0]))
					{
						compiledCode = compiledCode+'';
					}
					else
						compiledCode = compiledCode+endTagSplit[0];
				}
				if(endTagSplit[1] != null && endTagSplit[1] != undefined && endTagSplit[1] != '')
					compiledCode = compiledCode+"outputstr=outputstr+'"+endTagSplit[1].replace(/\r/g,"").replace(/\n/g," ").replace('\'','\\\'')+"';\r\n";
			}
			else
			{
				compiledCode = compiledCode+"outputstr=outputstr+'"+startTagSplit[line].replace(/\r/g,"").replace(/\n/g," ").replace('\'','\\\'')+"';\r\n";
			}
		}
	}
	return compiledCode;
}

function watchNSP(filename)
{
	fs.watchFile('public/'+filename,{persistent: true, interval: 500 },function (curr, prev) {
		//logger.write('the current mtime is: ' + curr.mtime,'viewcompiler.js');
		//logger.write('the previous mtime was: ' + prev.mtime,'viewcompiler.js');
		//if(curr.mtime.getTime() != prev.mtime.getTime())
		if(curr.mtime != prev.mtime)
		{
			compileNSPFile(filename);
			//compileNSPFileAsync(filename);//Trying out async for optimization
			logger.write("called compileNSPFile again for "+filename,'viewcompiler.js');
			//logger.write("called compileNSPFile again for "+filename+'\nthe current mtime is: ' + curr.mtime+'\ncurr is ' +JSON.stringify(curr)+'\nthe previous mtime was: ' +prev.mtime +'\nprev is '+JSON.stringify(prev),'viewcompiler.js');
		}
	});
	/*fs.watch('nsp/'+filename,{persistent: true, interval: 5000 },function (event, file) {
		if(event == 'change')
		{
			compileNSPFile(filename);
			logger.write("called compileNSPFile again for "+filename+' and event is '+event+' triggered by '+file,'viewcompiler.js');
		}
	});*/
}

exports.readNSP = readNSP;
exports.compileNSP = compileNSP;
