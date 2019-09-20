
import * as vscode from 'vscode';
import { CopyBook } from './CopyBook';
import { CopyItem } from './CopyItem';
export class CopyNodeProvider implements vscode.TreeDataProvider<CopyItem> {
    
    private _onDidChangeTreeData: vscode.EventEmitter<CopyItem | undefined> = new vscode.EventEmitter<CopyItem | undefined>();
    readonly onDidChangeTreeData: vscode.Event<CopyItem | undefined> = this._onDidChangeTreeData.event;

    constructor(private copy: CopyBook) {
    }

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }
    reloadFromDocument(document: vscode.TextDocument): void {
        const copybook = new CopyBook(document.getText().split(/[\r\n]+/));
        this.copy = copybook;
        this.refresh();
    }
    getTreeItem(element?: CopyItem): vscode.TreeItem {

        return (element) ? element : this.copy.items[0];
    }
    getChildren(element?: CopyItem): Thenable<CopyItem[]> {
        if (!this.copy) {
            vscode.window.showInformationMessage('Le document n\'est pas un CopyBook');
        }
        if (element) {
            return Promise.resolve(this.getSubCopyItems(element));
        } else {
            if (this.copy.items){ // && this.copy.items.length == 1) {
                return Promise.resolve(this.copy.items);
            } else {
                vscode.window.showInformationMessage('la rubrique n\'est pas une zone groupe');
                return Promise.resolve([]);
            }
        }
    }
    /**
     *  renvoie les enfant de la rubrique passée en argument
     */
    getSubCopyItems(copyItem: CopyItem): CopyItem[] {
        let copyItems: CopyItem[] = [];
        let subs = copyItem.rubrique.SubRubriques();
        for (let index = 0; index < subs.length; index++) {
            const element = subs[index];
            const collapsable = element.hasChildren() ? vscode.TreeItemCollapsibleState.Expanded : vscode.TreeItemCollapsibleState.None;
            copyItems.push(new CopyItem(element.Name(), element, collapsable));
        }
        return copyItems;
    }
}

export function subscribeToDocumentChanges(context: vscode.ExtensionContext, treeDataProvider: CopyNodeProvider): void{
    if (vscode.window.activeTextEditor) {
        treeDataProvider.reloadFromDocument(vscode.window.activeTextEditor.document);
    }    

    context.subscriptions.push(
        vscode.window.onDidChangeActiveTextEditor(editor => {
            if (editor) {
                treeDataProvider.reloadFromDocument(editor.document);
            }
        })
    );

    context.subscriptions.push(
        vscode.workspace.onDidChangeTextDocument(e => {
            treeDataProvider.reloadFromDocument(e.document);
        })
    );
}

