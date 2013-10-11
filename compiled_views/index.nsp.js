/* respond.js
 ***** Part of AssassinJS - NSP *****
  - (c)2013 Adithya and Sai Teja under MIT (Open Source) License
  
 Generates the HTML response

*/

function __createResponse(response,StatusCode,ResponseHeader,ResponseContent)
{
	if(ResponseHeader == null)
	{
		ResponseHeader = {'Content-Type': 'text/plain'}
	}
	if(StatusCode == null)
		StatusCode = 200;
	response.writeHead(StatusCode, ResponseHeader);
	response.write(ResponseContent);
	response.end();
}

exports.createResponse = __createResponse;

/*
The NSP Response starts from here
*/

function render(__request,__response,__dataObj){
var outputstr='';

try{outputstr=outputstr+'<html> <head> 	<title>NSP Test Page</title> </head> <body> <h1>NSP Test Page</h1> <p> ';
var expression=JSON.stringify(process.argv);
	outputstr=outputstr+expression;
outputstr=outputstr+' </p> </body> </html> ';
console.log(JSON.stringify(process.argv));__createResponse(__response,200,{'Content-Type': 'text/html'},outputstr);
/**/}
catch(err){__createResponse(__response,200,{'Content-Type': 'text/plain'},err.toString());
/**/}
}
exports.render = render;