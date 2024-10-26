import { window } from 'vscode';

const outputChannel = window.createOutputChannel('Pretty Home');

export class Logger {
    static instance: Logger ;
    static {
        this.instance = new Logger();
    }

    static GetInstance() {
        return this.instance;
    }

    log(message: string) {
        outputChannel.appendLine(message);
    }
}