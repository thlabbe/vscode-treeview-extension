import * as path from 'path';
import * as vscode from 'vscode';
import { Rubrique } from './Rubrique';

export class CopyItem extends vscode.TreeItem {
    constructor(public readonly label: string, public readonly rubrique: Rubrique, public readonly collapsibleState: vscode.TreeItemCollapsibleState, public readonly command?: vscode.Command) {
        super(label, collapsibleState);
    }
    get tooltip(): string {
        return `${this.rubrique.tooltip()}`;
    }
    get description(): string {
        return ` ${this.rubrique.description()}`;
    }
    iconPath = {
        light: path.join(__filename, '..', '..', 'resources', 'light', 'string.svg'),
        dark: path.join(__filename, '..', '..', 'resources', 'dark', 'string.svg'),
    };
    contextValue = 'copyItem';
}
