var generators = require('yeoman-generator');

module.exports = generators.Base.extend({
  initializing:{
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
  writing:{
    copyFiles: function(){
      this.template('.gitignore', ".gitignore");
    },
    setGruntfileTasks: function(){
      this.gruntfile.registerTask('build', ['sass', 'directives']);
      this.gruntfile.registerTask('build:styles', [
          'sass'
      ]);
      this.gruntfile.registerTask('build:scripts', [
          'jshint',
          'directives'
      ]);
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
          'tasks: ["build:scripts"]'+
        '},'+
        'styles:{'+
          'files: ["src/**/*.scss"],'+
          'tasks: ["build:styles"]'+
        '}'+
      '}');
      this.gruntfile.insertConfig("jshint", '{'+
          'scripts:["src/**/*.js"]'+
      '}');
      this.gruntfile.loadNpmTasks("grunt-sass");
      this.gruntfile.loadNpmTasks("grunt-contrib-jasmine");
      this.gruntfile.loadNpmTasks("grunt-sprockets-directives");
      this.gruntfile.loadNpmTasks("grunt-contrib-watch");
      this.gruntfile.loadNpmTasks("grunt-contrib-jshint");
    }
  }
});