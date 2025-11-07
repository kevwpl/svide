type KeyCombo = string[];
type ShortcutCallback = () => void;

interface ShortcutBinding {
	keys: Set<string>;
	callback: ShortcutCallback;
}

export function setupShortcuts(): {
	register: (keys: KeyCombo, callback: ShortcutCallback) => void;
	destroy: () => void;
} {
	const bindings: ShortcutBinding[] = [];
	const pressedKeys = new Set<string>();

	function handleKeyDown(event: KeyboardEvent) {
		pressedKeys.add(event.key);

		bindings.forEach(({ keys, callback }) => {
			if (keys.size === pressedKeys.size && [...keys].every(k => pressedKeys.has(k))) {
				callback();
				event.preventDefault();
			}
		});
	}

	function handleKeyUp(event: KeyboardEvent) {
		pressedKeys.delete(event.key);
	}

	window.addEventListener('keydown', handleKeyDown);
	window.addEventListener('keyup', handleKeyUp);

	return {
		register: (keys: KeyCombo, callback: ShortcutCallback) => {
			bindings.push({
				keys: new Set(keys),
				callback,
			});
		},
		destroy: () => {
			window.removeEventListener('keydown', handleKeyDown);
			window.removeEventListener('keyup', handleKeyUp);
		},
	};
}