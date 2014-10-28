var generators = require('yeoman-generator'),
    changeCase = require('change-case');

module.exports = generators.Base.extend({
  init: function(){
    this.option([{
      name: "npm-install",
      defaults: false,
      type: "boolean"
    }])
    this.toParam = function(str){
      return changeCase.param(str)
    }
  },
  _promptVars: function(data, done){
    var promptNext = function(data){
      var n = (data || []).shift();
      if(n){
        this.prompt(n, function (answers) {
          this[n.name] = answers[n.name];
          promptNext(data);
        }.bind(this))
      }else{
        done();
      }
    }.bind(this);
    promptNext(data)
    
  },
  prompting:{
    prompt: function () {
      var done = this.async();
      this._promptVars([{
        type: 'input', name: 'name',
        message : 'Your package name',
        default : this.appname
      },{
        type: 'input', name: 'description',
        message: 'Your package description',
      },{
        type: 'input', name: 'keywords',
        message: 'Your package keywords (separated by spaces)',
      },{
        type: 'input', name: 'repository',
        message: 'Your package repository',
      }], done)
    }
  },
  configuring: {
    copyFiles: function(){
      this.log("Copying files")
      this.template('.gitignore', ".gitignore");
      this.template('package.json', "package.json");
      this.template('bower.json', "bower.json");
      this.template('test/helpers/helpers.js', "test/helpers/helpers.js");
    }
  },
  writing:{
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
      this.gruntfile.registerTask('docs', [
          'jshint',
          'jsdoc'
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
      this.gruntfile.loadNpmTasks("grunt-jsdoc");      
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
      this.gruntfile.insertConfig("jsdoc", '{'+
        'dist : {'+
          'src: ["src/*.js"], '+
          'options: {'+
            'destination: "docs"'+
          '}'+
        '}'+
      '}');
    }
  },
  install: {
    installDependencies: function(){
      var done = this.async();
      if(this.options["npm-install"] != false){
        this.log("Installing npm dependencies");
        this.npmInstall([ 'grunt',
                          'grunt-sass',
                          'grunt-contrib-jasmine',
                          'grunt-sprockets-directives',
                          'grunt-contrib-watch',
                          'grunt-autoprefixer',
                          'grunt-contrib-jshint',
                          'grunt-jsdoc',
                        ], { 'saveDev': true }, done);
      }else{
        this.log("Skipping npm dependencies installation");
        done();
      }
    }
  }
});