import { ActionBar } from '@components/ActionBar';
import { GraphCanvas } from '@components/GraphCanvas';
import { LoadingHero } from '@components/LoadingHero';
import { PropertiesBar } from '@components/PropertiesBar';
import { PropertiesProvider } from '@contexts/PropertiesContext';
import React, { useEffect, useState } from 'react';
import { isDev } from 'utils';

export default function App() {
    const [loadingApp, setLoadingApp] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoadingApp(false);
        }, !isDev() ? 5.0 * 1000 : 10);

        return () => { clearTimeout(timer); };
    }, []);

    return loadingApp
        ? <LoadingHero />
        : <PropertiesProvider>
            <ActionBar>
                <PropertiesBar>
                    <GraphCanvas containerId='main-graph' />
                </PropertiesBar>
            </ActionBar>
        </PropertiesProvider>;
}
