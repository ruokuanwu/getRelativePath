import * as vscode from 'vscode';
import {copy} from 'copy-paste'

function getRelativePath(src: vscode.Uri, tar: vscode.Uri): String | null {
	// src is the current file
	// tar is the relartive file

	let srcPath: String = src.path;
	let tarPath: String = tar.path;

	if (srcPath === tarPath) {
		vscode.window.showInformationMessage('the src file is same with tar file!');
		return null;
	}

	// split path
	let srcPaths=null;
	let tarPaths=null;

	srcPaths=srcPath.split('/')
	tarPaths=tarPath.split('/')
	// ignore the first '/'
	srcPaths=srcPaths.slice(1)
	tarPaths=tarPaths.slice(1)


	let ret: String[] = [];
	let i = 0;
	let j = 0;

	while (i < srcPaths.length && j < tarPaths.length) {
		if (srcPaths[i] == tarPaths[j]) {
			i += 1;
			j += 1;
			continue;
		}
		break;
	}

	if (i == srcPaths.length - 1) {
		// in the same folder
		ret.push('.');
	} else if (i != 0) {
		// in the different folders
		while (i < srcPaths.length - 1) {
			ret.push('..');
			i += 1;
		}
	} else {
		// in windows, the two files are in the different logical disks, return the absolute path of tar file
		vscode.window.showInformationMessage('The src file and tar file are in the different logical disks, return the absolute path of tar file!');
		return tarPath;
	}

	while (j < tarPaths.length) {
		ret.push(tarPaths[j]);
		j += 1;
	}

	return ret.join('/');
}

function activate(context: vscode.ExtensionContext) {
	var disposable = vscode.commands.registerCommand('extension.getRelativePath', function (tar_uri: vscode.Uri) {
		if (typeof tar_uri === null) {
			return;
		}

		let src_uri = vscode.window.activeTextEditor?.document.uri;
		if (src_uri === null) {
			vscode.window.showErrorMessage('There is no activated file!');
			return;
		}

		let ret = getRelativePath(src_uri as vscode.Uri, tar_uri);
		if (ret == null) {
			return;
		}

		copy(ret as String);
	});

	context.subscriptions.push(disposable);
}
exports.activate = activate;


function deactivate() {
}
exports.deactivate = deactivate;