import { useState } from 'react';
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Toggle } from "@/components/ui/Toggle";
import { Select } from "@/components/ui/Select";
import { Icon } from "@/components/common/Icon";
import { Move, Type, AlignLeft, AlignCenter, AlignRight, ZoomIn, ZoomOut, Save } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

const VisualPositioning = () => {
    const [zoom, setZoom] = useState(100);
    const [selectedElement, setSelectedElement] = useState<string | null>("Greeting");

    return (
        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)]">
            {/* LEFT: Canvas Area */}
            <div className="flex-1 bg-gray-100 rounded-xl border border-gray-200 overflow-hidden relative flex flex-col">
                {/* Canvas Toolbar */}
                <div className="h-12 bg-white border-b border-gray-200 flex items-center justify-between px-4">
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => setZoom(z => Math.max(z - 10, 50))}><ZoomOut size={16} /></Button>
                        <span className="text-xs font-medium w-12 text-center">{zoom}%</span>
                        <Button variant="ghost" size="icon" onClick={() => setZoom(z => Math.min(z + 10, 200))}><ZoomIn size={16} /></Button>
                    </div>
                    <Badge variant="outline" className="bg-gray-50">1920 x 1080 px</Badge>
                </div>

                {/* Canvas Content */}
                <div className="flex-1 overflow-auto flex items-center justify-center p-8">
                    <div
                        className="bg-white shadow-2xl relative transition-transform duration-200"
                        style={{ width: '800px', height: '450px', transform: `scale(${zoom / 100})` }}
                    >
                        {/* Template Background Placeholder */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-dashed border-gray-200 flex items-center justify-center">
                            <p className="text-gray-300 text-4xl font-bold opacity-20 transform -rotate-12">TEMPLATE BACKGROUND</p>
                        </div>

                        {/* Draggable Overlays */}
                        <div
                            className={`absolute top-20 left-20 border-2 border-dashed p-2 cursor-move ${selectedElement === 'Logo' ? 'border-brand-blue bg-blue-50/20' : 'border-transparent hover:border-gray-300'}`}
                            onClick={() => setSelectedElement('Logo')}
                        >
                            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-xs text-gray-500">Logo</div>
                        </div>

                        <div
                            className={`absolute top-40 left-1/2 -translate-x-1/2 border-2 border-dashed p-2 cursor-move ${selectedElement === 'Greeting' ? 'border-brand-blue bg-blue-50/20' : 'border-transparent hover:border-gray-300'}`}
                            onClick={() => setSelectedElement('Greeting')}
                        >
                            <h1 className="text-4xl font-serif text-gray-800 text-center">Happy Holidays!</h1>
                        </div>

                        <div
                            className={`absolute bottom-32 left-1/2 -translate-x-1/2 border-2 border-dashed p-2 cursor-move ${selectedElement === 'Name' ? 'border-brand-blue bg-blue-50/20' : 'border-transparent hover:border-gray-300'}`}
                            onClick={() => setSelectedElement('Name')}
                        >
                            <p className="text-xl font-medium text-gray-700">{`{Recipient Name}`}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT: Property Panel */}
            <div className="w-full lg:w-80 bg-white border border-gray-200 rounded-xl flex flex-col shadow-sm">
                <div className="p-4 border-b border-gray-100 font-semibold flex items-center gap-2">
                    <Icon icon={Move} size={18} />
                    Layer Properties
                </div>

                <div className="flex-1 p-4 overflow-y-auto space-y-6">
                    {selectedElement ? (
                        <>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h4 className="font-medium text-brand-blue">{selectedElement}</h4>
                                    <Toggle defaultChecked label="Visible" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-gray-500">Layer Type</label>
                                    <Input value="Text Layer" readOnly className="bg-gray-50 text-gray-500" />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-medium text-gray-500 mb-1 block">X Position</label>
                                        <Input type="number" defaultValue="50" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-gray-500 mb-1 block">Y Position</label>
                                        <Input type="number" defaultValue="120" />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-100 space-y-4">
                                <div className="flex items-center gap-2 font-medium text-sm">
                                    <Icon icon={Type} size={16} /> Typography
                                </div>

                                <Select
                                    options={[{ label: 'Inter', value: 'Inter' }, { label: 'Playfair Display', value: 'Playfair' }, { label: 'Roboto', value: 'Roboto' }]}
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <Input type="number" defaultValue="42" label="Size (px)" />
                                    <Input type="color" className="h-[38px] p-1 cursor-pointer" defaultValue="#1f2937" label="Color" />
                                </div>

                                <div className="flex bg-gray-100 rounded-lg p-1">
                                    <Button variant="ghost" size="sm" className="flex-1 h-8 bg-white shadow-sm"><AlignLeft size={14} /></Button>
                                    <Button variant="ghost" size="sm" className="flex-1 h-8"><AlignCenter size={14} /></Button>
                                    <Button variant="ghost" size="sm" className="flex-1 h-8"><AlignRight size={14} /></Button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="text-center text-gray-400 py-10">
                            <p>Select an element on canvas to edit properties</p>
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-xl">
                    <Button className="w-full">
                        <Save className="mr-2 h-4 w-4" /> Save Layout
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default VisualPositioning;
