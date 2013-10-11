Node Server Pages
===

NSP - A simple File Server with a Server Side JavaScript compiler

Current Version: 0.1-DEV

NSP is comparable with JSP. Instead of Java code in HTML, we use JavaScript, via NodeJS.

NSP is a sub project of AssassinJS

The file extension used by nsp pages are .nsp

The public folder is where all your files to be served will go, be it static html pages, or nsp files, or images/css/js... so on.

The javascript code to be executed on server side should be wrapped in start <$ and end $> tags, example
	<$ var x=1; $>

The tags <$= $> are used to directly print values in the html page
	<$=x$>

(Note that there are some known bugs, like with the compiler regarding ' " , and accessing the port and host via command line parameters seems not to work)

The code is released under the MIT License