export function ControlsInfo() {
    return (
        <>
            <p className="text-lg font-semibold">Canvas</p>
            <ul className="list-none list-inside ml-2 mt-1 space-y-1">
                <li>
                    <strong>Panning</strong>:
                    <p className="inline ml-2 mt-1 text-sm text-base-content/80">
                        Click and drag on the empty background.
                    </p>
                </li>
                <li>
                    <strong>Zoom</strong>:
                    <p className="inline ml-2 mt-1 text-sm text-base-content/80">
                        Use the mouse wheel or trackpad gesture to zoom in and out.
                    </p>
                </li>
            </ul>
            <p className="text-lg font-semibold mt-2">Graph Elements</p>
            <ul className="list-none list-inside ml-2 mt-1 space-y-1">
                <li>
                    <strong>Move</strong>:
                    <p className="inline ml-2 mt-1 text-sm text-base-content/80">
                        Click and drag nodes to reposition them on the canvas. Its edges will adjust
                        accordingly.
                    </p>
                </li>
                <li>
                    <strong>Select</strong>:
                    <ul className="list-disc list-inside ml-6 mt-1 text-sm text-base-content/80">
                        <li>Click on a node or edge to select it.</li>
                        <li>Shift + Click to select multiple elements.</li>
                        <li>Click and drag on the background to drag-select multiple elements.</li>
                    </ul>
                </li>
            </ul>
        </>
    );
}
