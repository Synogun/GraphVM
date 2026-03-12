const MODIFIER_KEYS = new Set(['Ctrl', 'Meta', 'Alt', 'Shift']);
const MODIFIER_ORDER = ['Ctrl', 'Meta', 'Alt', 'Shift'];

export type ShortcutInput = {
    key: string;
    ctrlKey: boolean;
    metaKey: boolean;
    altKey: boolean;
    shiftKey: boolean;
};

export function isEditableTarget(target: EventTarget | null): boolean {
    if (!(target instanceof HTMLElement)) {
        return false;
    }

    const tagName = target.tagName.toLowerCase();
    if (tagName === 'input' || tagName === 'textarea' || tagName === 'select') {
        return true;
    }

    if (target.isContentEditable) {
        return true;
    }

    const editableContainer = target.closest(
        '[contenteditable="true"], [role="textbox"]'
    );
    return editableContainer !== null;
}

export function isShortcutMatch(binding: string, eventShortcut: string): boolean {
    const normalizedBinding = normalizeShortcut(binding);
    if (!normalizedBinding) {
        return false;
    }

    if (normalizedBinding === eventShortcut) {
        return true;
    }

    return toPrimaryModifierAlternate(normalizedBinding) === eventShortcut;
}

export function formatShortcutInput(input: ShortcutInput): string {
    const key = normalizeShortcutKey(input.key);

    if (MODIFIER_KEYS.has(key)) {
        return '';
    }

    const parts: string[] = [];

    if (input.ctrlKey) {
        parts.push('Ctrl');
    }

    if (input.metaKey) {
        parts.push('Meta');
    }

    if (input.altKey) {
        parts.push('Alt');
    }

    if (input.shiftKey) {
        parts.push('Shift');
    }

    parts.push(key);
    return parts.join('+');
}

export function normalizeShortcut(shortcut: string): string {
    const parts = shortcut
        .split('+')
        .map((part) => normalizeShortcutKey(part.trim()))
        .filter(Boolean);

    if (parts.length === 0) {
        return '';
    }

    const orderedModifiers = MODIFIER_ORDER.filter((modifier) =>
        parts.includes(modifier)
    );
    const key = parts.find((part) => !MODIFIER_ORDER.includes(part)) ?? '';

    return [...orderedModifiers, key].filter(Boolean).join('+');
}

function normalizeShortcutKey(key: string): string {
    const map: Record<string, string> = {
        ' ': 'Space',
        Esc: 'Escape',
        Control: 'Ctrl',
        Option: 'Alt',
        Command: 'Meta',
    };

    if (key in map) {
        return map[key];
    }

    if (key.length === 1) {
        return key.toUpperCase();
    }

    return key.charAt(0).toUpperCase() + key.slice(1);
}

function toPrimaryModifierAlternate(binding: string): string {
    const parts = binding.split('+').filter(Boolean);

    const hasCtrl = parts.includes('Ctrl');
    const hasMeta = parts.includes('Meta');

    if (hasCtrl && !hasMeta) {
        return parts.map((part) => (part === 'Ctrl' ? 'Meta' : part)).join('+');
    }

    if (hasMeta && !hasCtrl) {
        return parts.map((part) => (part === 'Meta' ? 'Ctrl' : part)).join('+');
    }

    return binding;
}
