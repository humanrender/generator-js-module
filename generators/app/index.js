var generators = require('yeoman-generator');

module.exports = generators.Base.extend({
  initializing:{
    promptName: function () {
      var done = this.async();
      this.prompt({
        type    : 'input',
        name    : 'name',
        message : 'Your module name',
        default : this.appname // Default to current folder name
      }, function (answers) {
        this.name = answers.name;
        done();
      }.bind(this));
    },
    installDependencies: function(){
      var done = this.async();
      this.log("Installing npm dependencies");
      done()
      // this.npmInstall([ 'grunt',
      //                   'grunt-sass',
      //                   'grunt-contrib-jasmine',
      //                   'grunt-sprockets-directives',
      //                   'grunt-contrib-watch'
      //                 ], { 'saveDev': true }, done);
    }
  },
  writing: {
    copyFiles: function(){
      this.template('.gitignore', ".gitignore");

      this.template('module/module.js', "src/"+this.name+'.js');
      this.template('module/styles.css.scss', "src/"+this.name+".css.scss");
      this.template('module/spec.js', "test/specs/"+this.name+'.spec.js');
    },
    setGruntfileTasks: function(){
      this.gruntfile.registerTask('build', ['sass', 'directives']);
      this.gruntfile.registerTask('default', ['build', 'watch']);
      this.gruntfile.insertConfig("sass", '{styles:{'+
        'cwd:"src/",'+
        'src:["*.scss"],'+
        'expand:true,'+
        'dest:"dist/"'+
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
          'tasks: ["directives"]'+
        '},'+
        'styles:{'+
          'files: ["src/**/*.scss"],'+
          'tasks: ["sass"]'+
        '}'+
      '}');
      this.gruntfile.loadNpmTasks("grunt-sass");
      this.gruntfile.loadNpmTasks("grunt-contrib-jasmine");
      this.gruntfile.loadNpmTasks("grunt-sprockets-directives");
      this.gruntfile.loadNpmTasks("grunt-contrib-watch");
    }
  }
});