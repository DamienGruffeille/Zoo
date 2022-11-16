import chalk from 'chalk';

export default class Logging {
    public static log = (namespace: string, args: any) =>
        this.info(namespace, args);

    public static info = (namespace: string, args: any) =>
        console.log(
            chalk.blue(
                `[${new Date().toLocaleString()}] [INFO] [${namespace}]`
            ),
            typeof args === 'string' ? chalk.blueBright(args) : args
        );
    public static warn = (namespace: string, args: any) =>
        console.log(
            chalk.yellow(
                `[${new Date().toLocaleString()}] [WARN] [${namespace}]`
            ),
            typeof args === 'string' ? chalk.yellowBright(args) : args
        );
    public static error = (namespace: string, args: any) =>
        console.log(
            chalk.red(
                `[${new Date().toLocaleString()}] [ERROR] [${namespace}]`
            ),
            typeof args === 'string' ? chalk.redBright(args) : args
        );
}
