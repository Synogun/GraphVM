import { useGetGraph } from '@/hooks/useGraphRegistry';
import { setGraphDirected } from '@/services/graph';
import { useGraphMeta, useGraphWorkspace } from '@Contexts';
import { ToggleInput } from '../common/inputs/ToggleInput';

export function GraphSection() {
    const graphRef = useGetGraph('main-graph');
    const { directed, setDirected } = useGraphMeta();
    const { activeTabId, markTabPendingSave } = useGraphWorkspace();

    const handleToggleDirected = (value: boolean) => {
        const graph = graphRef.current;

        if (!graph) {
            return;
        }

        setGraphDirected(graph, value);
        setDirected(value);
        markTabPendingSave(activeTabId);
    };

    return (
        <>
            <div className="divider mb-1">
                <h1 className="text-lg font-bold text-center">Graph</h1>
            </div>

            <ToggleInput
                label="Directed"
                checked={directed}
                defaultValue={false}
                onChange={(e) => {
                    handleToggleDirected(e.target.checked);
                }}
                tooltip={{
                    content:
                        'When enabled, new and existing edges show direction arrows.',
                }}
                stateLabels={{ on: 'Directed', off: 'Undirected' }}
            />
        </>
    );
}
