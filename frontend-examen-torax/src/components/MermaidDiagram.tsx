'use client';

import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

interface MermaidDiagramProps {
    chart: string;
}

export default function MermaidDiagram({ chart }: MermaidDiagramProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        mermaid.initialize({
            startOnLoad: true,
            theme: 'dark',
            securityLevel: 'loose',
        });

        if (containerRef.current) {
            mermaid.render('mermaid-svg', chart).then((result) => {
                if (containerRef.current) {
                    containerRef.current.innerHTML = result.svg;
                }
            });
        }
    }, [chart]);

    return <div ref={containerRef} className="mermaid flex justify-center py-4 overflow-auto min-h-[300px]"></div>;
}
