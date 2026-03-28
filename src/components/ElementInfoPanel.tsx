import type { ElementsInfo } from '@/types/graph';
import { parseCamelCase } from '@/utils/elements';
import { useGraphSelection } from '@Contexts';
import { useMemo } from 'react';

export function ElementInfoPanel() {
    const {
        selectionInfo: { info: selectionInfo },
    } = useGraphSelection();

    const infoToRender = useMemo(() => {
        if (selectionInfo.group === 'none') {
            return null;
        }
        return renderElementsDetails(selectionInfo);
    }, [selectionInfo]);

    return (
        <div
            style={{
                position: 'absolute',
                right: 0,
                bottom: 0,
                margin: '1rem',
                zIndex: 20,
                minWidth: 220,
                maxWidth: 320,
            }}
        >
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
