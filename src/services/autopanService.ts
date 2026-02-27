import { DefaultAutopanOptions } from '@/constants/graphDefaults';
import type { AutopanOptions } from '@/types/graph';
import type cytoscape from 'cytoscape';

/**
 * Binds autopan-on-drag behavior to a Cytoscape instance.
 *
 * When a node matching `options.selector` is dragged and the cursor enters the
 * viewport edge margin, the canvas pans at a speed proportional to how deep into
 * the margin the cursor is. Panning continues until the drag ends or the cursor
 * leaves the margin area.
 *
 * @returns Cleanup function removing listeners and stopping the animation loop.
 */
export function bindAutopan(
    cy: cytoscape.Core,
    options: Partial<AutopanOptions> = {}
): () => void {
    const autopanOptions: AutopanOptions = { ...DefaultAutopanOptions, ...options };
    let mousePos: { x: number; y: number } | null = null;
    let animFrameId: number | null = null;
    let grabCount = 0;
    let cachedRect: DOMRect | null = null;

    const container = cy.container();
    if (!container) {
        return () => undefined;
    }

    function panLoop() {
        if (grabCount === 0 || !container) {
            animFrameId = null;
            return;
        }

        if (!mousePos) {
            animFrameId = requestAnimationFrame(panLoop);
            return;
        }

        const rect = cachedRect ?? container.getBoundingClientRect();
        const { margin, speed } = autopanOptions;

        let panX = 0;
        let panY = 0;

        if (mousePos.x <= margin) {
            panX = speed;
        } else if (mousePos.x >= rect.width - margin) {
            panX = -speed;
        }

        if (mousePos.y <= margin) {
            panY = speed;
        } else if (mousePos.y >= rect.height - margin) {
            panY = -speed;
        }

        if (panX !== 0 && panY !== 0) {
            panX *= Math.SQRT1_2;
            panY *= Math.SQRT1_2;
        }

        if (panX !== 0 || panY !== 0) {
            cy.panBy({ x: panX, y: panY });
        } else {
            animFrameId = null;
            return;
        }

        animFrameId = requestAnimationFrame(panLoop);
    }

    function startLoop() {
        animFrameId ??= requestAnimationFrame(panLoop);
    }

    function stopLoop() {
        if (animFrameId !== null) {
            cancelAnimationFrame(animFrameId);
            animFrameId = null;
        }
    }

    const setPositionFromClient = (clientX: number, clientY: number) => {
        const rect = cachedRect ?? container.getBoundingClientRect();
        mousePos = {
            x: clientX - rect.left,
            y: clientY - rect.top,
        };
    };

    const setPositionFromOriginalEvent = (evt?: Event) => {
        if (!evt) {
            return;
        }

        if (evt instanceof MouseEvent) {
            setPositionFromClient(evt.clientX, evt.clientY);
            return;
        }

        if (
            typeof TouchEvent !== 'undefined' &&
            evt instanceof TouchEvent &&
            evt.touches.length > 0
        ) {
            setPositionFromClient(evt.touches[0].clientX, evt.touches[0].clientY);
        }
    };

    const onDrag: cytoscape.EventHandler = (e: cytoscape.EventObject) => {
        const originalEvt = e.originalEvent as Event | undefined;
        if (originalEvt) {
            setPositionFromOriginalEvent(originalEvt);
        } else {
            const pos = (e.target as cytoscape.NodeSingular).renderedPosition();
            mousePos = { x: pos.x, y: pos.y };
        }
        startLoop();
    };

    const onGrab: cytoscape.EventHandler = (e: cytoscape.EventObject) => {
        grabCount++;
        if (grabCount === 1) {
            cachedRect = container.getBoundingClientRect();
        }
        setPositionFromOriginalEvent(e.originalEvent as Event | undefined);
        startLoop();
    };

    const onFree: cytoscape.EventHandler = () => {
        grabCount = Math.max(0, grabCount - 1);
        if (grabCount === 0) {
            mousePos = null;
            cachedRect = null;
            stopLoop();
        }
    };

    cy.on('grab', autopanOptions.selector, onGrab);
    cy.on('drag', autopanOptions.selector, onDrag);
    cy.on('free', autopanOptions.selector, onFree);

    return () => {
        cy.off('grab', autopanOptions.selector, onGrab);
        cy.off('drag', autopanOptions.selector, onDrag);
        cy.off('free', autopanOptions.selector, onFree);
        stopLoop();
        mousePos = null;
        grabCount = 0;
        cachedRect = null;
    };
}
