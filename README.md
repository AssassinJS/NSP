Node Server Pages
=================

*NodeSP - A simple File Server with a Server Side JavaScript compiler*

Current Dev Version: 0.3

##Description
NodeSP is comparable with JSP. Instead of Java code in HTML, we use JavaScript, via NodeJS.
NodeSP is a sub project of AssassinJS

##Prerequisites
* Latest Version of NodeJs
* Install Dependencies by ```npm install -d```

##Running
To run the server ```node nsp.js [port] [host]```

The file extension used by nsp pages are ```.nsp```
The public folder is where all your files to be served will go, be it static html pages, or nsp files, or images/css/js... so on.

The javascript code to be executed on server side should be wrapped in start <$ and end $> tags, example
Example:

	<$ var x=1; $>

The tags <$= $> are used to directly print values in the html page
Example:

	<$=x$>

Less Compiler is included, which automatically converts less files to css files in the public directory. Also less file in lessBlocks directories are not compiled, which is usefull for individual blocks that are imported into other less files.


(Note that there are some known bugs, like with the compiler regarding ' "  not to work accurately every time)

The code is released under the MIT License

##Version Updates
* v0.3 - Standalone npm module
* v0.2 - Added Less compiler support
* v0.1 - Initial extraction of working fileserver code from AssassinJS with minor improvements
