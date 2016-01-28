var express = require('express'),
	website = express(),
	http = require('http').Server(website),
	path = require('path'),
	logger = require('express-logger'),
	json = require('express-json'),
	bodyParser = require('body-parser'),
	expressSession = require('express-session'),
	methodOverride = require('express-method-override'),
	exphbs = require('express-handlebars'),
	chalk = require('chalk');

website.engine('hbs', exphbs({
	extname:'hbs',
	defaultLayout:'index.hbs',
	partialsDir: ['views/_partials']
}));

website.set('port', process.env.PORT || 3001);
website.set('views', path.join(__dirname, 'views'));
website.set('view engine', 'hbs');
website.use(logger({path: './logs/logfile.txt'}));
website.use(expressSession({secret: '18dhN7skw9AY82jb',
                 saveUninitialized: true,
                 resave: true}));
website.use(json());
website.use(bodyParser.urlencoded({ extended: false }));
website.use(methodOverride());
website.use(express.static(path.join(__dirname, 'public')));

// Setup routing
require('./routes/main')(website);

http.listen(website.get('port'), function(){
	console.log('Website ready, listening on port: ' + website.get('port'));
});

http.on('error', function(err) {

	console.log('');
	console.log(chalk.inverse('SERVER ERROR'))
	console.log(chalk.inverse('Error code: %s'), err.code);

	if(err.code === 'EADDRINUSE'){
		console.log('>> It looks like port ' + chalk.underline(website.get('port')) + ' is being used by another process. The port can only be used by ' + chalk.underline('one') + ' process.');
	}

	console.log('>> ' + chalk.underline('Full Error'), err);
	console.log('');
})

module.exports = website;
