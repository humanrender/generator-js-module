var generators = require('yeoman-generator'),
    changeCase = require('change-case');

module.exports = generators.Base.extend({
  init: function(){
    this.toParam = function(str){
      return changeCase.param(str)
    }
  },
  initializing:{
    promptName: function () {
      var done = this.async();
      this.prompt([{
          type: 'input', name: 'name',
          message : 'Your package name',
          default : this.appname
        },
        {
          type: 'input', name: 'description',
          message: 'Your package description',
        },
        {
          type: 'input', name: 'keywords',
          message: 'Your package keywords (separated by spaces)',
        }],
        function (answers) {
          this.name = answers.name;
          this.description = answers.description;
          this.keywords = answers.keywords;
          done();
        }.bind(this));
    },
    installDependencies: function(){
      var done = this.async();
      this.log("Installing npm dependencies");
      // done()
      this.npmInstall([ 'grunt',
                        'grunt-sass',
                        'grunt-contrib-jasmine',
                        'grunt-sprockets-directives',
                        'grunt-contrib-watch',
                        'grunt-autoprefixer'
                      ], { 'saveDev': true }, done);
    }
  },
  writing:{
    copyFiles: function(){
      this.template('.gitignore', ".gitignore");
      this.template('package.json', "package.json");
      this.template('bower.json', "bower.json");
      this.template('test/helpers/helpers.js', "test/helpers/helpers.js");
    },
    registerGruntTasks: function(){
      this.gruntfile.registerTask('build', ['build:styles', 'build:scripts']);
      this.gruntfile.registerTask('build:styles', [
          'sass',
          'autoprefixer'
      ]);
      this.gruntfile.registerTask('build:scripts', [
          'jshint',
          'directives'
      ]);
      this.gruntfile.registerTask('test', [
          'build:scripts',
          'jasmine'
      ]);
      this.gruntfile.registerTask('default', ['build', 'watch']);
    },
    loadGruntTasks: function(){
      this.gruntfile.loadNpmTasks("grunt-sass");
      this.gruntfile.loadNpmTasks("grunt-contrib-jasmine");
      this.gruntfile.loadNpmTasks("grunt-sprockets-directives");
      this.gruntfile.loadNpmTasks("grunt-contrib-watch");
      this.gruntfile.loadNpmTasks("grunt-contrib-jshint");
      this.gruntfile.loadNpmTasks("grunt-autoprefixer");
      
    },
    configGruntTasks: function(){
      this.gruntfile.insertConfig("sass", '{styles:{'+
        'cwd:"src/",'+
        'src:["*.scss"],'+
        'expand:true,'+
        'dest:"dist/",'+
        'ext:".css"'+
      '}}');
      this.gruntfile.insertConfig("directives", '{scripts:{'+
        'cwd:"src/",'+
        'src:["*.js"],'+
        'expand:true,'+
        'dest:"dist/"'+
      '}}');
      this.gruntfile.insertConfig("watch", '{'+
        'options: {'+
          'spawn: false,'+
        '},'+
        'scripts:{'+
          'files: ["src/**/*.js"],'+
          'tasks: ["build:scripts"]'+
        '},'+
        'styles:{'+
          'files: ["src/**/*.scss"],'+
          'tasks: ["build:styles"]'+
        '},'+
        'test:{'+
          'files: ["test/**/*.js"],'+
          'tasks: ["test"]'+
        '}'+
      '}');
      this.gruntfile.insertConfig("jshint", '{'+
          'scripts:["src/**/*.js"]'+
      '}');
      this.gruntfile.insertConfig("jasmine", '{'+
        'specs: {'+
          'src: "dist/**/*.js",'+
          'options: {'+
            'keepRunner: true,'+
            'specs: "test/specs/*.spec.js",'+
            'vendor: [],'+
            'helpers: ["test/helpers/*.js"]'+
          '}'+
        '}'+
      '}')
      this.gruntfile.insertConfig("autoprefixer", '{'+
        'styles: {'+
          'expand: true,'+
          'flatten: true,'+
          'cwd: "dist/",'+
          'src: "**/*.css",'+
          'dest: "dist/"'+
        '}'+
      '}')
    }
  }
});