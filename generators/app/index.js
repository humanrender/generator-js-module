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
    }
  },
  writing: {
    copyFiles: function(){
      this.template('module/module.js', "src/"+this.name+'.js');
      this.template('module/styles.css.scss', "src/"+this.name+".css.scss");
      this.template('module/spec.js', "test/specs/"+this.name+'.spec.js');
    },
    addToBower: function(){
      if(this.dest.exists("bower.json")){
        var bowerFile = this.dest.readJSON('bower.json');
        if(!bowerFile.main) bowerFile.main = [];
        if(bowerFile.main.indexOf("dist/"+this.name+'.js') == -1)
          bowerFile.main.push("dist/"+this.name+'.js')
        if(bowerFile.main.indexOf("dist/"+this.name+'.css') == -1)
          bowerFile.main.push("dist/"+this.name+'.css')
        this.dest.write("bower.json", JSON.stringify(bowerFile, null, 2))
      }
    }
  }
});