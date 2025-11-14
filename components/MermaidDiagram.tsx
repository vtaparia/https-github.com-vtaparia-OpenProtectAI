import React, { useEffect, useRef } from 'react';
// @ts-ignore
import mermaid from 'mermaid';

interface MermaidDiagramProps {
  chart: string;
}

let currentId = 0;

const MermaidDiagram: React.FC<MermaidDiagramProps> = ({ chart }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const diagramId = `mermaid-diagram-${currentId++}`;

  // Fix: The mermaid.render API is now promise-based. The previous callback implementation was for an older version.
  // This updates the logic to use an async function to await the result of mermaid.render and handle potential errors correctly.
  useEffect(() => {
    if (containerRef.current) {
        const renderDiagram = async () => {
            try {
                const { svg } = await mermaid.render(diagramId, chart);
                if(containerRef.current) {
                    containerRef.current.innerHTML = svg;
                }
            } catch (e) {
                console.error('Mermaid rendering error:', e);
                if (containerRef.current) {
                    containerRef.current.innerHTML = `<pre class="text-red-400">Mermaid Error:\n${(e as Error).message}</pre>`;
                }
            }
        };
        renderDiagram();
    }
  }, [chart, diagramId]);

  return (
    <div className="mermaid-container my-4 p-4 bg-gray-800 rounded-lg overflow-x-auto">
      <div ref={containerRef} className="text-white">
        {/* Mermaid diagram will be rendered here */}
      </div>
    </div>
  );
};

export default MermaidDiagram;
