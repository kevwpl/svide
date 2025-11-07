import { readTextFile, writeTextFile } from '@tauri-apps/plugin-fs';

export async function loadFile(
	editor: any,
	monaco: any,
	path: string
): Promise<string> {
	const content = await readTextFile(path);
	const language = getLanguageFromPath(path);
	const model = editor.getModel();

	if (model && monaco) {
		monaco.editor.setModelLanguage(model, language);
	}

	editor.setValue(content);
	return content;
}

export async function saveFile(path: string, content: string): Promise<void> {
	await writeTextFile(path, content);
}

export function getLanguageFromPath(path: string): string {
	const extension = path.split('.').pop()?.toLowerCase();
	const languageMap: Record<string, string> = {
		ts: 'typescript',
		tsx: 'typescript',
		js: 'javascript',
		jsx: 'javascript',
		svelte: 'html',
		vue: 'html',
		json: 'json',
		html: 'html',
		css: 'css',
		scss: 'scss',
		less: 'less',
		py: 'python',
		rs: 'rust',
		go: 'go',
		java: 'java',
		cpp: 'cpp',
		c: 'c',
		php: 'php',
		rb: 'ruby',
		sql: 'sql',
		xml: 'xml',
		yaml: 'yaml',
		yml: 'yaml',
		sh: 'shell',
		bash: 'shell',
		dockerfile: 'dockerfile',
		md: 'markdown',
	};

	return languageMap[extension || ''] || 'plaintext';
}