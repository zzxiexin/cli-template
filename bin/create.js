const { program } = require("commander");
const inquirer = require("inquirer").default;
const { copy, remove } = require("fs-extra");
const { local_template, remote_template, library_template } = require("./template");
const fs = require("fs");
const path = require("path");
const shell = require("shelljs");
const download = require("download-git-repo");
let spinner = null;

const handleExistDestination = async ({ destination }) => {
  const finalDestination = path.join(process.cwd(), destination);
  if (fs.existsSync(finalDestination)) {
    const { isCover } = await inquirer.prompt([
      {
        type: "list",
        message: `${finalDestination}文件夹已经存在, 是否覆盖`,
        name: "isCover",
        default: true,
        choices: [
          { name: "是", value: true },
          { name: "否", value: false },
        ],
      },
    ]);
    if (!isCover) {
      return;
    } else {
      await remove(finalDestination);
    }
  }
};

const createDestination = async ({ destination, answers }) => {
  let source = null;
  let chalk = null;
  const finalDestination = path.join(process.cwd(), destination);
  // 如果目标文件夹不存在，创建它
  if (!fs.existsSync(finalDestination)) {
    try {
      import("ora").then((ora) => {
        spinner = ora.default("正在拉取").start();
        // 使用 spinner 继续你的逻辑
      });
      import("chalk").then((res) => {
        chalk = res.default;
      });
      fs.mkdirSync(destination, { recursive: true });
      if (answers.isRemote === "local") {
        source = path.join(__dirname, local_template?.[answers?.index]);
        try {
          copy(source, finalDestination, {
            filter: (src, dest) => {
              // 复制所有文件（包括 . 开头的文件）
              return true;
            },
          })
            .then(() => {
              spinner.succeed(chalk.green("拉取成功"));
            })
            .catch((err) => {
              spinner.fail(chalk.red("拉取失败"));
            });
        } catch (err) {
          spinner.fail(chalk.red("拉取失败"));
        }
      } else {
        try {
          let remote_url = ""
          if (answers?.index === 6){
            remote_url = library_template?.[0]
          } else {
            remote_url = remote_template?.[answers?.index]
          }
          download(
            remote_url,
            finalDestination,
            { clone: true },
            (err) => {
              if (err) {
                spinner.fail(chalk.red("拉取失败"));
              } else {
                spinner.succeed(chalk.green("拉取成功"));
              }
            }
          );
        } catch (err) {
          spinner.fail(chalk.red("拉取失败"));
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
};

const installDependice = async ({ answers, destination }) => {
  if (answers.isInstall) {
    const installType = answers.installType;
    // 使用 shelljs 进入文件夹并执行命令
    if (shell.cd(destination).code === 0) {
      // 如果进入文件夹成功，执行其他命令
      console.log(installType)
      shell.exec(`${installType} install`, (code, stdout, stderr) => {
        if (code === 0) {
          console.log("安装成功:", stdout);
        } else {
          console.error("安装失败:", stderr);
        }
      });
    } else {
      console.error("无法进入文件夹:", destination);
    }
  }
};

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
            message: "请选择你需要的技术栈",
            choices: [
              { name: "react+router+vite+jotai", value: 0 },
              { name: "react+router+vite+mobx", value: 1 },
              { name: "react+router+vite+rtk", value: 2 },
              { name: "react+router+vite+useContext", value: 3 },
              { name: "react+router+vite+useReducer", value: 4 },
              { name: "react+router+vite+zustand", value: 5 },
              { name: "react library", value: 6 },
            ],
          },
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
          },
        ])
        .then(async (answers) => {
          // 处理目录已有情况
          await handleExistDestination({ destination });

          // 目录不存在新建目录
          await createDestination({ destination, answers });

          // 是否安装依赖
          await installDependice({ destination, answers });
        })
        .catch((err) => {
          console.log(err);
        });
    });
};

module.exports = create;
