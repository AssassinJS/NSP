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