module.exports = function() {
    var client = './src/';
    var clientApp = client + 'app/';
    var temp = './.tmp/';
    var config = {
        temp: temp,
        // all js to vet
        alljs: [
            './src/**/*.js',
            './*.js'
        ],
        build: './dist/',
        client: client,
        css: temp + 'main.css',
        images: client + 'images/**/**.*',
        htmltemplates: client + 'views/**/*.html',
        index: client + 'index.html',
		html: client + '**/*.html',
        js: [
            clientApp + '**/*.module.js',
            clientApp + '**/*.js',
            '!' + clientApp + '**/*.spec.js',
        ],

        sass: client + 'sass/',
         /**
         * template cache
         */
        templateCache:{
            file: 'template.js',
            options:{
                module: 'app',
                standAlone: false,
                root: 'views/'
            }
        },
        /**
         * browser sync
         */
        browserReloadDelay: 1000,

        /**
         * Bower and NPM locations
         */
        bower: {
            json: require('./bower.json'),
            directory: './bower_components/',
            ignorePath: '../'
        },

        defaultPort: 7203,

    };

    config.getWiredepDefaultOptions = function() {
        var options = {
            bowerJson: config.bower.json,
            directory: config.bower.directory,
            ignorePath: config.bower.ignorePath
        };
        return options;
    };

    return config;
};
