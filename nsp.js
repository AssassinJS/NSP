/* nsp.js
 ***** Part of AssassinJS - NSP *****
  - (c)2013 Adithya and Sai Teja under MIT (Open Source) License
  
 This runs the actual NSP server on the specified port and address

*/

var http = require('http');
var viewcompiler = require('./system/viewcompiler.js');
var lesscompiler = require('./system/lesscompiler.js');
var fileserver = require('./system/fileserver.js');
var logger = require('./system/logger.js');
	
//This function invokes the precompiler of jssp views
viewcompiler.readNSP(function(){

//This function invokes the precompiler of jssp views
lesscompiler.readLess(function(){

//This function reads all the views in compiled_views folder
fileserver.LoadViews(function(){

//Now the server running code
initServer();

});
});
});

//Server Initialization
function initServer()
{
	var server = http.createServer();
	server.on('request',route);

	if(process.argv[2]!=null && process.argv[2]!=undefined)
		var port = parseInt(process.argv[2]);
	else
		var port = 8000;
	if(process.argv[3]!=null && process.argv[3]!=undefined)
		var host = process.argv[3];
	else
		var host = '0.0.0.0';
		
	if(port!=undefined && host!=undefined)
	{
		//server.listen(config.assassinjsPort,config.assassinjsAddress);
		server.listen(port,host);
		logger.write('Server running at '+host+':'+port);
	}
	else
		logger.write('Config Parameters not defined: port and address');
}

//Actual Routing Function
function route(request,response)
{			
	if(request.method == 'POST')//for post requests, to get the entire request body
	{
		var reqbody = '';
		var reqbodyList = [];
        request.on('data', function (data) {
			reqbody += data;
            toAdd = new Buffer(data,'binary');
			reqbodyList.push(toAdd);
        });
        request.on('end', function () {
			request.body = reqbody;
			request.bodyBinary = Buffer.concat(reqbodyList);
			//logger.write(request.body,'router.js');
		
			controller(request,response);
        });
    }
    else//for get requests
    {
		controller(request,response);
	}
}
//Process function for customization through a data object (only if necessary)
function controller(req,res)
{
	var dataObj={};
	fileserver.serveFile(req,res,null,dataObj);
}