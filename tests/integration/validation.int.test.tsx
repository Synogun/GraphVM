import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

function ValidationComponent() {
    return <div data-testid="validation">GraphVM Integration</div>;
}

describe('integration validation', () => {
    it('renders a React component end-to-end through ReactDOM server', () => {
        const html = renderToString(<ValidationComponent />);
        expect(html).toContain('GraphVM Integration');
    });
});
