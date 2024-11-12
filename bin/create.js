let spinner = null;
const { program } = require("commander");
const inquirer = require("inquirer").default;
const { template } = require("./template");
const fs = require("fs");
const path = require("path");
const copy = require("fs-extra");

const create = () => {
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
        ])
        .then((answers) => {
          const source = path.join(__dirname, template?.[answers?.index]);
          const lastDestination = path.join(process.cwd(), destination);
          console.log("lastDestination", lastDestination);
          if (fs.existsSync(destination)) {
            console.error(`${destination}文件夹已经存在, 请重新更换文件夹名称`);
            process.exit(1);
          }

          // 如果目标文件夹不存在，创建它
          if (!fs.existsSync(lastDestination)) {
            try {
              import("ora").then((ora) => {
                spinner = ora.default("正在拉取").start();
                // 使用 spinner 继续你的逻辑
              });
              fs.mkdirSync(destination, { recursive: true });
              copy
                .copy(source, lastDestination, {
                  filter: (src, dest) => {
                    // 复制所有文件（包括 . 开头的文件）
                    return true;
                  },
                })
                .then(() => {
                  spinner.succeed("拉取成功");
                })
                .catch((err) => {
                  console.log(err);
                });
            } catch (error) {
              console.log(error);
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    });
};

module.exports = create;
