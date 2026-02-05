import { useEditorStore, Layer } from "@/store/editorStore";
import { Icon } from "@/components/common/Icon";
import {
    Bold, Italic, Underline,
    AlignLeft, AlignCenter, AlignRight,
    Trash2, Copy, Lock, Unlock
} from "lucide-react";
import { Select } from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export const FloatingToolbar = () => {
    const {
        layoutLayers, selectedId,
        updateLayoutLayer, deleteElement, addLayoutLayer
    } = useEditorStore();

    const selectedLayer = layoutLayers.find(l => l.id === selectedId);

    if (!selectedLayer) return null;

    const isText = selectedLayer.type === 'text';

    const handleStyleChange = (styleUpdates: Partial<Layer['style']>) => {
        if (selectedLayer.locked) return;
        // @ts-ignore
        updateLayoutLayer(selectedLayer.id, { style: styleUpdates });
    };

    const handleDuplicate = () => {
        const newLayer = {
            ...selectedLayer,
            id: `${selectedLayer.type}-${Date.now()}`,
            x: selectedLayer.x + 20,
            y: selectedLayer.y + 20,
            name: `${selectedLayer.name} (Copy)`
        };
        addLayoutLayer(newLayer);
    };

    const toggleLock = () => {
        updateLayoutLayer(selectedLayer.id, { locked: !selectedLayer.locked });
    };

    return (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white rounded-lg shadow-xl border border-gray-200 p-2 flex items-center gap-3 z-50 animate-in slide-in-from-top-2">

            {/* TEXT CONTROLS */}
            {isText && (
                <>
                    {/* Font Family */}
                    <div className="w-32">
                        <Select
                            value={selectedLayer.style.font || 'Inter'}
                            onChange={(val) => handleStyleChange({ font: val })}
                            options={[
                                { label: 'Inter', value: 'Inter' },
                                { label: 'Roboto', value: 'Roboto' },
                                { label: 'Playfair Display', value: 'Playfair Display' },
                                { label: 'Poppins', value: 'Poppins' },
                                { label: 'Lora', value: 'Lora' },
                            ]}
                        />
                    </div>

                    <div className="h-6 w-px bg-gray-200"></div>

                    {/* Font Size */}
                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleStyleChange({ size: (selectedLayer.style.size || 16) - 1 })}
                        >-</Button>
                        <Input
                            type="number"
                            className="w-14 h-8 text-center px-1"
                            value={selectedLayer.style.size || 16}
                            onChange={(e) => handleStyleChange({ size: Number(e.target.value) })}
                        />
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleStyleChange({ size: (selectedLayer.style.size || 16) + 1 })}
                        >+</Button>
                    </div>

                    <div className="h-6 w-px bg-gray-200"></div>

                    {/* Color Picker */}
                    <div className="relative group">
                        <div
                            className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
                            style={{ backgroundColor: selectedLayer.style.color || '#000' }}
                        />
                        <input
                            type="color"
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                            value={selectedLayer.style.color || '#000000'}
                            onChange={(e) => handleStyleChange({ color: e.target.value })}
                        />
                    </div>

                    <div className="h-6 w-px bg-gray-200"></div>

                    {/* Style Toggles */}
                    <div className="flex bg-gray-50 rounded-md p-0.5">
                        <Button
                            variant="ghost"
                            size="icon"
                            className={`h-8 w-8 ${selectedLayer.style.weight === 'bold' ? 'bg-white shadow text-black' : 'text-gray-500'}`}
                            onClick={() => handleStyleChange({ weight: selectedLayer.style.weight === 'bold' ? 'normal' : 'bold' })}
                        >
                            <Icon icon={Bold} size={16} />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className={`h-8 w-8 ${selectedLayer.style.fontStyle === 'italic' ? 'bg-white shadow text-black' : 'text-gray-500'}`}
                            onClick={() => handleStyleChange({ fontStyle: selectedLayer.style.fontStyle === 'italic' ? 'normal' : 'italic' })}
                        >
                            <Icon icon={Italic} size={16} />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className={`h-8 w-8 ${selectedLayer.style.textDecoration === 'underline' ? 'bg-white shadow text-black' : 'text-gray-500'}`}
                            onClick={() => handleStyleChange({ textDecoration: selectedLayer.style.textDecoration === 'underline' ? 'none' : 'underline' })}
                        >
                            <Icon icon={Underline} size={16} />
                        </Button>
                    </div>

                    <div className="h-6 w-px bg-gray-200"></div>

                    {/* Alignment */}
                    <div className="flex bg-gray-50 rounded-md p-0.5">
                        <Button
                            variant="ghost"
                            size="icon"
                            className={`h-8 w-8 ${selectedLayer.style.align === 'left' ? 'bg-white shadow text-black' : 'text-gray-500'}`}
                            onClick={() => handleStyleChange({ align: 'left' })}
                        >
                            <Icon icon={AlignLeft} size={16} />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className={`h-8 w-8 ${selectedLayer.style.align === 'center' ? 'bg-white shadow text-black' : 'text-gray-500'}`}
                            onClick={() => handleStyleChange({ align: 'center' })}
                        >
                            <Icon icon={AlignCenter} size={16} />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className={`h-8 w-8 ${selectedLayer.style.align === 'right' ? 'bg-white shadow text-black' : 'text-gray-500'}`}
                            onClick={() => handleStyleChange({ align: 'right' })}
                        >
                            <Icon icon={AlignRight} size={16} />
                        </Button>
                    </div>

                    <div className="h-6 w-px bg-gray-200"></div>
                </>
            )}

            {/* Common Actions */}
            <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500" onClick={handleDuplicate} title="Duplicate">
                    <Icon icon={Copy} size={16} />
                </Button>

                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500" onClick={toggleLock} title={selectedLayer.locked ? 'Unlock' : 'Lock'}>
                    <Icon icon={selectedLayer.locked ? Lock : Unlock} size={16} />
                </Button>

                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:bg-red-50" onClick={() => deleteElement(selectedLayer.id)} title="Delete">
                    <Icon icon={Trash2} size={16} />
                </Button>
            </div>
        </div>
    );
};
