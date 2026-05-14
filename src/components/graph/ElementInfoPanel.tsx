import { useGraphSelectionStore } from '@/stores/graphSelectionStore';
import type { ElementsInfo } from '@/types/graph';
import { parseCamelCase } from '@/utils/elements';
import { useMemo } from 'react';

export function ElementInfoPanel() {
    const selectionInfo = useGraphSelectionStore((s) => s.selectionInfo);

    const infoToRender = useMemo(() => {
        if (selectionInfo.group === 'none') {
            return null;
        }
        return renderElementsDetails(selectionInfo);
    }, [selectionInfo]);

    return (
        <div className="absolute bottom-0 right-0 z-20 m-4 min-w-55 max-w-[320px]">
            {selectionInfo.group !== 'none' && (
                <div className="rounded border border-gray-200 p-3 text-xs shadow-lg">
                    {infoToRender}
                </div>
            )}
        </div>
    );
}

function renderElementsDetails(info: Exclude<ElementsInfo, { group: 'none' }>) {
    const parseValue = (value: string | number | boolean | null | undefined) => {
        if (typeof value === 'boolean') {
            return value ? 'Yes' : 'No';
        }
        return parseCamelCase(String(value));
    };

    return (
        <>
            {Object.entries(info).map(([key, value]) => {
                return (
                    <DetailRow
                        key={`${key}-${String(value)}`}
                        label={parseCamelCase(key)}
                        value={parseValue(value)}
                    />
                );
            })}
        </>
    );
}

function DetailRow({
    label,
    value,
}: Readonly<{
    label: string;
    value: string;
}>) {
    return (
        <div className="flex justify-between gap-3 py-0.5">
            <span className="font-semibold">{label}:</span>
            <span className="break-all text-right">{value}</span>
        </div>
    );
}
