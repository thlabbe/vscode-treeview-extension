// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { CopyBook } from "./CopyBook";
import { CopyNodeProvider, subscribeToDocumentChanges } from './CopyNodeProvider';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	let activeEditor = vscode.window.activeTextEditor;
	if (activeEditor) {
		let copybook = new CopyBook(activeEditor.document.getText().split(/[\r\n]+/));
		const nodeCopysProvider = new CopyNodeProvider(copybook);
		vscode.window.registerTreeDataProvider('copy-outline',nodeCopysProvider);
		subscribeToDocumentChanges(context, nodeCopysProvider);
	}
	
	let disposable = vscode.commands.registerCommand('copy-outliner.refreshEntry', () => {

		let editor = vscode.window.activeTextEditor;

		if(editor){
			const document = editor.document;
			const text = document.getText();
			const copybook = new CopyBook(text.split(/[\r\n]+/));
			const nodeCopysProvider = new CopyNodeProvider(copybook);
			vscode.window.registerTreeDataProvider('copy-outline',nodeCopysProvider);

		}
	});
	
	context.subscriptions.push(disposable);
	
}

// this method is called when your extension is deactivated
export function deactivate() {
	console.log('Congratulations, your extension "helloworld" is now deactivate!');
}


// déclancher sur modification de document 
//export function subscribeToDocumentChanges(context: vscode.ExtensionContext, copyOutlinerTreeView: vsco)