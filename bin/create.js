const { program } = require("commander");
const inquirer = require("inquirer").default;
const { copy, remove } = require("fs-extra");
const { local_template, remote_template } = require("./template");
const fs = require("fs");
const path = require("path");
const shell = require("shelljs");
const download = require("download-git-repo");
let chalk = null;
let spinner = null;

const create = async () => {
  program
    .command("create")
    .description("create用于快速创建项目, project name是文件夹名称")
    .argument("<project name>", "目录名称")
    .action((destination) => {
      inquirer
        .prompt([
          {
            type: "list",
            name: "index",
            default: 0,
            message: "请选择你需要的技术栈？",
            choices: [
              { name: "react+router+vite+jotai", value: 0 },
              { name: "test", value: 1 },
            ],
          },
          // {
          //   type: "confirm",
          //   message: "是否安装依赖",
          //   name: "isInstall",
          //   default: true,
          // },
          {
            type: "list",
            name: "isRemote",
            default: "local",
            message: "安装远程还是本地模板?",
            choices: [
              { name: "local", value: "local" },
              { name: "remote", value: "remote" },
            ],
          },
          {
            type: "confirm",
            message: "是否安装依赖",
            name: "isInstall",
            default: true,
          },
          {
            type: "list",
            message: "请选择安装方式",
            name: "installType",
            choices: ["pnpm", "yarn", "npm"],
            default: true,
            when: (answers) => answers.isInstall,
          }
        ])
        .then(async (answers) => {
          let source = null;
          const lastDestination = path.join(process.cwd(), destination);
          if (fs.existsSync(destination)) {
            const { isCover } = await inquirer.prompt([{
              type: "list",
              message: `${destination}文件夹已经存在, 是否覆盖`,
              name: "isCover",
              default: true,
              choices: [{ name: "覆盖", value: true }, { name: "不覆盖", value: false }]
            }])
            if (!isCover) {
              return;
            } else {
              await remove(destination)
            }
          }

          // 如果目标文件夹不存在，创建它
          if (!fs.existsSync(lastDestination)) {
            try {
              import("ora").then((ora) => {
                spinner = ora.default("正在拉取").start();
                // 使用 spinner 继续你的逻辑
              });
              import("chalk").then((chalk) => {
                chalk = chalk.default;
              })
              fs.mkdirSync(destination, { recursive: true });
              if (answers.isRemote === "local") {
                source = path.join(__dirname, local_template?.[answers?.index])
                copy(source, lastDestination, {
                  filter: (src, dest) => {
                    // 复制所有文件（包括 . 开头的文件）
                    return true;
                  },
                })
                  .then(() => {
                    console.log(err, chalk.red("拉取成功"));
                    // spinner.succeed("拉取成功");
                  })
                  .catch((err) => {
                    console.log(err);
                  });

              } else {
                download(remote_template?.[answers?.index], destination, { clone: true }, (err) => {
                  if (err) {
                    console.error(err);
                    spinner.error("拉取失败")
                  } else {
                    console.log(err, chalk.red("拉取成功"));
                    // spinner.succeed('拉取成功');
                  }
                });
              }

            } catch (error) {
              console.log(error);
            }
          }

          if (answers.isInstall) {
            const installType = answers.installType;
            // 使用 shelljs 进入文件夹并执行命令
            if (shell.cd(destination).code === 0) {
              // 如果进入文件夹成功，执行其他命令
              shell.exec(`${installType} install`, (code, stdout, stderr) => {
                if (code === 0) {
                  console.log('安装成功:', stdout);
                } else {
                  console.error('安装失败:', stderr);
                }
              });
            } else {
              console.error('无法进入文件夹:', folderPath);
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    });
};

module.exports = create;
