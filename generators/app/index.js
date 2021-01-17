"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const cowsay = require("cowsay");

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    // 注册命令行参数
    this.argument("appname", {
      type: String,
      required: true
    });
  }

  prompting() {
    this.log(
      cowsay.say({
        text: `Welcome to the epic ${chalk.red(
          "generator-custom-react"
        )} generator! Let's go`,
        e: "oO",
        T: "U "
      })
    );
  }

  writing() {
    this.fs.copy(
      this.sourceRoot(),
      // Copy到指定的appname
      this.destinationPath(this.options.appname)
    );

    // 读取package.json，并修改配置
    const packageJson = this.fs.readJSON(this.templatePath("package.json"));
    const configJson = {
      name: this.options.appname,
      ...packageJson
    };
    this.fs.writeJSON(
      this.destinationPath(`${this.options.appname}/package.json`),
      configJson
    );
  }

  install() {
    this.destinationRoot(this.options.appname);
    this.installDependencies({
      npm: true,
      bower: false,
      yarn: true
    }).then(() =>
      this.log(
        "Everything is ready, please run yarn start to activate your app"
      )
    );
  }
};
