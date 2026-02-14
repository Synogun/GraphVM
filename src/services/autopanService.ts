import { DefaultAutopanOptions } from '@/config/graphDefaults';
import type { AutopanOptions } from '@/types/graph';
import { Logger } from '@Logger';
import type cytoscape from 'cytoscape';

const logger = Logger.createContextLogger('AutopanService');

/**
 * Binds autopan-on-drag behavior to a Cytoscape instance.
 *
 * When a node matching `options.selector` is dragged and the cursor enters the
 * viewport edge margin, the canvas pans continuously at a fixed rate until the
 * drag ends or the cursor leaves the margin area.
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
    let isDragging = false;

    const container = cy.container();
    if (!container) {
        logger.warn('bindAutopan > container not found');
        return () => undefined;
    }

    function panLoop() {
        if (!isDragging || !container) {
            animFrameId = null;
            return;
        }

        if (!mousePos) {
            animFrameId = requestAnimationFrame(panLoop);
            return;
        }

        const rect = container.getBoundingClientRect();
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

        if (panX !== 0 || panY !== 0) {
            cy.panBy({ x: panX, y: panY });
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
        const rect = container.getBoundingClientRect();
        mousePos = {
            x: clientX - rect.left,
            y: clientY - rect.top,
        };
    };

    const setPositionFromOriginalEvent = (evt?: Event) => {
        if (!evt) {
            return;
        }

        if (evt instanceof PointerEvent) {
            setPositionFromClient(evt.clientX, evt.clientY);
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

    const onPointerMove = (evt: PointerEvent) => {
        setPositionFromClient(evt.clientX, evt.clientY);
    };

    const onGrab: cytoscape.EventHandler = (e: cytoscape.EventObject) => {
        isDragging = true;
        setPositionFromOriginalEvent(e.originalEvent as Event | undefined);
        container.addEventListener('pointermove', onPointerMove);
        startLoop();
    };

    const onFree: cytoscape.EventHandler = () => {
        isDragging = false;
        mousePos = null;
        container.removeEventListener('pointermove', onPointerMove);
        stopLoop();
    };

    cy.on('grab', autopanOptions.selector, onGrab);
    cy.on('free', autopanOptions.selector, onFree);

    logger.info('bindAutopan > bound autopan listeners', {
        selector: autopanOptions.selector,
        speed: autopanOptions.speed,
    });

    return () => {
        cy.off('grab', autopanOptions.selector, onGrab);
        cy.off('free', autopanOptions.selector, onFree);
        container.removeEventListener('pointermove', onPointerMove);
        stopLoop();
        mousePos = null;
        isDragging = false;
        logger.info('bindAutopan > unbound autopan listeners');
    };
}
