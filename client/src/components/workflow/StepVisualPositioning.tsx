import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/common/Icon";
import { ZoomIn, ZoomOut, Save, Undo, Redo, LayoutTemplate } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { useEditorStore, Layer } from "@/store/editorStore";

// New Components
// New Components
import { VisualCanvas } from "@/components/editor/VisualCanvas";
import { FloatingToolbar } from "@/components/editor/FloatingToolbar";
import { LayerListPanel } from "@/components/editor/LayerListPanel";

// Default layers to start with if none exist
const DEFAULT_LAYERS: Layer[] = [
    {
        id: 'logo-1',
        type: 'logo',
        name: 'Logo',
        content: 'LOGO',
        x: 100,
        y: 100,
        visible: true,
        style: { size: 60, color: '#e5e7eb' }
    },
    {
        id: 'name-1',
        type: 'text',
        name: 'Recipient Name',
        content: '{Name}',
        placeholderKey: 'name',
        x: 540, // Center of 1080
        y: 1100,
        visible: true,
        style: { font: 'Inter', size: 48, color: '#1f2937', align: 'center', weight: 'bold' }
    },
    {
        id: 'position-1',
        type: 'text',
        name: 'Role / Position',
        content: '{Position}',
        placeholderKey: 'position',
        x: 540,
        y: 1180,
        visible: true,
        style: { font: 'Inter', size: 32, color: '#4b5563', align: 'center' }
    },
    {
        id: 'occasion-1',
        type: 'text',
        name: 'Occasion',
        content: '{Occasion}',
        placeholderKey: 'occasion',
        x: 540,
        y: 200,
        visible: true,
        style: { font: 'Playfair Display', size: 72, color: '#111827', align: 'center' }
    }
];

interface StepVisualPositioningProps {
    onNext: (data: { layers: Layer[] }) => void;
    onBack: () => void;
}

const StepVisualPositioning = ({ onNext, onBack }: StepVisualPositioningProps) => {
    // Global Store
    const {
        layoutLayers, setLayoutLayers,
        selectedTemplate, inputData
    } = useEditorStore();

    const [zoom, setZoom] = useState(50); // Start at 50% for visibility
    const [leftPanelOpen, setLeftPanelOpen] = useState(true);

    // Enforce Template Selection - STRICT RULE
    if (!selectedTemplate) {
        return (
            <div className="flex flex-col items-center justify-center h-[600px] space-y-6 animate-in fade-in">
                <div className="bg-red-50 text-red-600 p-6 rounded-full shadow-sm"><Icon icon={Save} size={32} /></div>
                <div className="text-center space-y-2">
                    <h3 className="text-xl font-bold text-gray-900">Template Not Selected</h3>
                    <p className="text-gray-500 max-w-md mx-auto">You must select a design template in Step 1 to proceed with customization.</p>
                </div>
                <Button onClick={onBack} variant="outline" className="min-w-[200px]">Return to Step 1</Button>
            </div>
        );
    }

    // Canvas Logic 
    const canvasDims = selectedTemplate.dimensions || { width: 1080, height: 1920 };
    const canvasLabel = `${selectedTemplate.orientation} (${canvasDims.width}x${canvasDims.height})`;
    const backgroundUrl = selectedTemplate.previewImage;

    // Initialize Layers
    useEffect(() => {
        if (layoutLayers.length === 0) {
            let initialLayers = JSON.parse(JSON.stringify(DEFAULT_LAYERS));

            // In Manual Mode: Pre-fill placeholders with actual values
            // allowing the user to simply edit the text directly.
            if (inputData.mode === 'manual' && inputData.manualData) {
                initialLayers = initialLayers.map((layer: Layer) => {
                    if (layer.type === 'text' && layer.content) {
                        const newContent = layer.content.replace(/\{(\w+)\}/g, (match, key) => {
                            // Map {Name} -> manualData.name (case insensitive lookup)
                            const dataKey = Object.keys(inputData.manualData).find(k => k.toLowerCase() === key.toLowerCase());
                            // @ts-ignore
                            const val = dataKey ? inputData.manualData[dataKey] : '';
                            return val || match;
                        });
                        return { ...layer, content: newContent };
                    }
                    return layer;
                });
            }

            setLayoutLayers(initialLayers);
        }
    }, [layoutLayers.length, setLayoutLayers, inputData]);

    const handleContinue = () => {
        onNext({ layers: layoutLayers });
    };

    return (
        <div className="flex flex-col h-[calc(100vh-140px)] animate-in fade-in slide-in-from-bottom-4 duration-500 bg-gray-50 -m-6 rounded-lg overflow-hidden border border-gray-200 shadow-sm relative">

            {/* TOOLBAR */}
            <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 z-20 shadow-sm">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => setLeftPanelOpen(!leftPanelOpen)} className={leftPanelOpen ? 'bg-blue-50 text-brand-blue' : ''}>
                        <Icon icon={LayoutTemplate} size={20} />
                    </Button>
                    <div className="h-6 w-[1px] bg-gray-200"></div>
                    <span className="font-semibold text-gray-800">Visual Editor</span>
                    <Badge variant="secondary" className="bg-gray-100 text-gray-600 font-normal">{canvasLabel}</Badge>
                </div>

                {/* Center Actions */}
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-700"><Icon icon={Undo} size={18} /></Button>
                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-700"><Icon icon={Redo} size={18} /></Button>

                    <div className="h-6 w-[1px] bg-gray-200 mx-2"></div>

                    <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setZoom(z => Math.max(z - 10, 10))}><ZoomOut size={16} /></Button>
                        <span className="text-xs font-semibold w-9 text-center tabular-nums">{zoom}%</span>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setZoom(z => Math.min(z + 10, 200))}><ZoomIn size={16} /></Button>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="secondary" onClick={onBack}>Back</Button>
                    <Button variant="cta" onClick={handleContinue}>Next: Output</Button>
                </div>
            </div>

            {/* MAIN EDITOR AREA */}
            <div className="flex-1 flex overflow-hidden relative">

                {/* LEFT PANEL */}
                {leftPanelOpen && (
                    <LayerListPanel />
                )}

                {/* CANVAS AREA (Scrollable) */}
                <div className="flex-1 bg-gray-100/50 overflow-hidden relative flex flex-col items-center justify-center p-8 border-l border-gray-200">

                    {/* Floating Toolbar - Absolute to this container so it stays on top of canvas */}
                    <div className="absolute top-4 z-50">
                        <FloatingToolbar />
                    </div>

                    <div className="overflow-auto w-full h-full flex items-center justify-center p-20 cursor-move relative">
                        <VisualCanvas
                            width={canvasDims.width}
                            height={canvasDims.height}
                            zoom={zoom}
                            backgroundUrl={backgroundUrl}
                        />
                    </div>
                </div>

                {/* Removed PropertiesPanel - It is now the FloatingToolbar */}
            </div>
        </div>
    );
};

export default StepVisualPositioning;
