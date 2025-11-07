const iconCache = new Map<string, Promise<string>>();

function checkForSpecialFileName(fileName: string): string | null {
	const lowerCaseName = fileName.toLowerCase();

	switch (lowerCaseName) {
		case '.gitignore':
			return '/fileLogos/git.svg';
		case '.npmrc':
			return '/fileLogos/npm.svg';
		case '.prettierignore':
		case '.prettierrc':
			return '/fileLogos/prettier.svg';
		default:
			return null;
	}
}

export function getFileIcon(fileName: string): Promise<string> {
	if (iconCache.has(fileName)) {
		return iconCache.get(fileName)!;
	}

	const promise = (async () => {
		const specialIcon = checkForSpecialFileName(fileName);
		if (specialIcon) {
			return specialIcon;
		}

		const extension = fileName.split('.').pop()?.toLowerCase();
		const iconPath = extension
			? `/fileLogos/${extension}.svg`
			: '/fileLogos/file.svg';

		try {
			const response = await fetch(iconPath, { method: 'HEAD' });
			return response.ok ? iconPath : '/fileLogos/file.svg';
		} catch {
			return '/fileLogos/file.svg';
		}
	})();

	iconCache.set(fileName, promise);
	return promise;
}