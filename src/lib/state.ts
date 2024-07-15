import * as vscode from 'vscode';
export class State {
    #data: { [key: string]: any } = {};
    constructor() {
        if (State.instance) {
            vscode.window.showErrorMessage(`Pretty Home instance already running.`);
        }
    }
    get data() {
        return this.#data;
    }
    static instance: State;
    static {
        this.instance = new State();
    }
    static getInstance() {
        return this.instance;
    }
}