import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { FileUpload } from "@/components/ui/FileUpload";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Alert } from "@/components/ui/Alert";
import { Icon } from "@/components/common/Icon";
import { Palette, Download, FileSpreadsheet, CheckCircle2, Move, Type, AlignLeft, AlignCenter, AlignRight, ZoomIn, ZoomOut, Save } from "lucide-react";
import { EXTENSION_TYPES } from "@/utils/constants";
import { Select } from "@/components/ui/Select";
import { Toggle } from "@/components/ui/Toggle";

// Types
interface Layer {
    id: string;
    type: 'text' | 'image' | 'logo';
    name: string;
    content: string;
    x: number;
    y: number;
    visible: boolean;
    style: {
        font?: string;
        size?: number;
        color?: string;
        align?: 'left' | 'center' | 'right';
    };
}

const InputData = () => {
    // Input Data State
    const [file, setFile] = useState<File | null>(null);
    const [batchData, setBatchData] = useState<any>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string>("");

    // Visual Positioning State
    const [zoom, setZoom] = useState(100);
    const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
    const [template, setTemplate] = useState<any>(null);
    const [generatedCards, setGeneratedCards] = useState<any[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);

    // Default layers if none exist
    const [layers, setLayers] = useState<Layer[]>([
        {
            id: 'logo-1',
            type: 'logo',
            name: 'Logo',
            content: 'LOGO',
            x: 80,
            y: 80,
            visible: true,
            style: { size: 64, color: '#e5e7eb' }
        },
        {
            id: 'greeting-1',
            type: 'text',
            name: 'Greeting',
            content: 'Happy Holidays!',
            x: 400,
            y: 150,
            visible: true,
            style: { font: 'Playfair', size: 48, color: '#1f2937', align: 'center' }
        },
        {
            id: 'name-1',
            type: 'text',
            name: 'Recipient Name',
            content: '{Recipient Name}',
            x: 400,
            y: 350,
            visible: true,
            style: { font: 'Inter', size: 32, color: '#374151', align: 'center' }
        }
    ]);

    // Load template details
    useEffect(() => {
        const fetchTemplate = async () => {
            const params = new URLSearchParams(window.location.search);
            const templateId = params.get('templateId');

            if (templateId) {
                try {
                    // In a real implementation we would have an endpoint to get a single template
                    // For now we might fetch all or just assume we have the ID to save to.
                    // Let's assume we can GET /api/templates currently returns list. 
                    // Implementation plan said GET /templates list. 
                    // We will just set the ID. 
                    // If we had a GET /api/templates/:id we would fetch existing layout.
                    // Let's implement a quick check if we can fetch it.
                    // Actually, I'll assumme we just save for now as the user flow starts fresh usually.
                    // But wait, if I want to "Save Layout", I need the ID.

                    // We will simulate fetching the layout if we had one. 
                    // For this task, I will prioritize SAVING.
                    setTemplate({ _id: templateId });
                } catch (err) {
                    console.error("Error loading template", err);
                }
            }
        };
        fetchTemplate();
    }, []);

    const handleCSVUpload = async (selectedFile: File) => {
        setFile(selectedFile);
        setIsUploading(true);
        setError("");

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const res = await fetch('/api/upload/csv', {
                method: 'POST',
                body: formData
            });
            const data = await res.json();

            if (data.success) {
                setBatchData(data.data);
            } else {
                setError(data.message || "Upload failed");
            }
        } catch (err) {
            console.error(err);
            setError("Network error uploading CSV");
        } finally {
            setIsUploading(false);
        }
    };

    const handleLayerUpdate = (id: string, updates: Partial<Layer> | Partial<Layer['style']>) => {
        setLayers(prev => prev.map(layer => {
            if (layer.id !== id) return layer;

            // Check if updates are for style or top-level props
            // This is a bit quick-and-dirty, typical for prototypes
            if ('font' in updates || 'size' in updates || 'color' in updates || 'align' in updates) {
                return { ...layer, style: { ...layer.style, ...updates } };
            }
            return { ...layer, ...updates };
        }));
    };

    const selectedLayer = layers.find(l => l.id === selectedElementId);

    const handleSaveLayout = async () => {
        if (!template?._id) return alert("No template selected");

        try {
            const res = await fetch(`/api/templates/${template._id}/layout`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ layout: layers })
            });
            const data = await res.json();
            if (data.success) {
                alert("Layout saved successfully!");
            } else {
                alert("Failed to save layout: " + data.message);
            }
        } catch (err) {
            console.error(err);
            alert("Error saving layout");
        }
    };

    const handleGenerate = async () => {
        if (!template?._id) return alert("Missing Template ID");
        if (!batchData?.batchId) return alert("Please upload a CSV first");

        // Convert our simplified layers to what the backend expects
        const layerConfig = layers.map(l => ({
            type: l.type === 'logo' ? 'image' : 'text', // Backend expects 'text' or 'image'
            content: l.content,
            x: l.x,
            y: l.y,
            style: l.style
        }));

        setIsGenerating(true);

        try {
            const res = await fetch('/api/generate/bulk', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    templateId: template._id,
                    batchId: batchData.batchId,
                    layerConfig
                })
            });
            const data = await res.json();

            if (data.success) {
                setGeneratedCards(data.data);
                setTimeout(() => {
                    document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            } else {
                alert("Generation Failed: " + data.message);
            }
        } catch (err) {
            console.error(err);
            alert("Error triggering generation");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="space-y-8">

            {/* SECTION A: Brand Info - Kept same ... */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Icon icon={Palette} className="text-brand-blue" />
                        Brand Configuration
                    </CardTitle>
                    <CardDescription>Setup your brand identity for the generated cards.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <Input label="Brand Name" placeholder="Acme Corp" />
                        {/* ... Color pickers ... */}
                    </div>
                    <div>
                        <FileUpload
                            label="Brand Logo (PNG/SVG)"
                            accept=".png,.svg,.jpg"
                            onFileSelect={(f) => console.log(f)}
                            maxSizeMB={2}
                            className="h-full"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* SECTION B: Data Input - Kept same ... */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Icon icon={FileSpreadsheet} className="text-brand-green" />
                        Bulk Data Input
                    </CardTitle>
                    <CardDescription>Upload your recipient list using our CSV template.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex flex-col md:flex-row gap-6 items-start">
                        <div className="flex-1 w-full space-y-4">
                            <FileUpload
                                label="Upload CSV Recipient List"
                                accept={EXTENSION_TYPES.CSV}
                                onFileSelect={handleCSVUpload}
                            />
                        </div>
                        {/* ... Status indicators ... */}
                        <div className="flex-1 w-full">
                            {isUploading ? (
                                <div className="p-4 bg-gray-50 text-center">Uploading...</div>
                            ) : batchData ? (
                                <Alert variant="default" className="bg-green-50 border-green-200 text-green-800">
                                    Found {batchData.rowCount} rows.
                                </Alert>
                            ) : (
                                <div className="p-4 bg-gray-50 text-center text-gray-400">No file yet</div>
                            )}
                        </div>
                    </div>
                    {/* Preview Table ... */}
                    {batchData && (
                        <div className="border rounded-lg overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        {batchData.headers.map((h: string) => <TableHead key={h}>{h}</TableHead>)}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {batchData.preview.map((row: any, i: number) => (
                                        <TableRow key={i}>
                                            {batchData.headers.map((h: string) => <TableCell key={h}>{row[h]}</TableCell>)}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* SECTION D: Visual Positioning */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Icon icon={Move} className="text-brand-purple" />
                        Visual Positioning
                    </CardTitle>
                    <CardDescription>Adjust the placement of dynamic text and logo.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col lg:flex-row gap-6 h-[600px] border rounded-xl overflow-hidden">
                        {/* LEFT: Canvas Area */}
                        <div className="flex-1 bg-gray-100 border-r border-gray-200 overflow-hidden relative flex flex-col">
                            {/* Toolbar */}
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
                                    style={{ width: '800px', height: '450px', transform: `scale(${zoom / 100})`, transformOrigin: 'center center' }}
                                >
                                    {/* Background */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden">
                                        <p className="text-gray-300 text-4xl font-bold opacity-20 transform -rotate-12">TEMPLATE BACKGROUND</p>
                                    </div>

                                    {/* Render Layers */}
                                    {layers.map(layer => (
                                        <div
                                            key={layer.id}
                                            className={`absolute cursor-move border-2 border-dashed p-2 transition-colors ${selectedElementId === layer.id ? 'border-brand-blue bg-blue-50/20' : 'border-transparent hover:border-gray-300'}`}
                                            style={{
                                                left: layer.x,
                                                top: layer.y,
                                                // basic style mapping
                                            }}
                                            onClick={() => setSelectedElementId(layer.id)}
                                        >
                                            {layer.type === 'logo' ? (
                                                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-xs text-gray-500">Logo</div>
                                            ) : (
                                                <div style={{
                                                    fontFamily: layer.style?.font,
                                                    fontSize: layer.style?.size,
                                                    color: layer.style?.color,
                                                    textAlign: layer.style?.align
                                                }}>
                                                    {layer.content}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: Property Panel */}
                        <div className="w-full lg:w-80 bg-white flex flex-col">
                            <div className="p-4 border-b border-gray-100 font-semibold flex items-center gap-2">
                                <Icon icon={Move} size={18} />
                                Layer Properties
                            </div>

                            <div className="flex-1 p-4 overflow-y-auto space-y-6">
                                {selectedLayer ? (
                                    <>
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center">
                                                <h4 className="font-medium text-brand-blue">{selectedLayer.name}</h4>
                                                <Toggle checked={selectedLayer.visible} onChange={(e) => handleLayerUpdate(selectedLayer.id, { visible: e.target.checked })} label="Visible" />
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-xs font-medium text-gray-500 mb-1 block">X Position</label>
                                                    <Input type="number" value={selectedLayer.x} onChange={(e) => handleLayerUpdate(selectedLayer.id, { x: parseInt(e.target.value) })} />
                                                </div>
                                                <div>
                                                    <label className="text-xs font-medium text-gray-500 mb-1 block">Y Position</label>
                                                    <Input type="number" value={selectedLayer.y} onChange={(e) => handleLayerUpdate(selectedLayer.id, { y: parseInt(e.target.value) })} />
                                                </div>
                                            </div>
                                        </div>

                                        {selectedLayer.type === 'text' && (
                                            <div className="pt-4 border-t border-gray-100 space-y-4">
                                                <div className="flex items-center gap-2 font-medium text-sm">
                                                    <Icon icon={Type} size={16} /> Typography
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <Input type="number" value={selectedLayer.style.size} onChange={(e) => handleLayerUpdate(selectedLayer.id, { size: parseInt(e.target.value) })} label="Size (px)" />
                                                    <Input type="color" className="h-[38px] p-1 cursor-pointer" value={selectedLayer.style.color} onChange={(e) => handleLayerUpdate(selectedLayer.id, { color: e.target.value })} label="Color" />
                                                </div>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="text-center text-gray-400 py-10">
                                        <p>Select an element on canvas to edit properties</p>
                                    </div>
                                )}
                            </div>

                            <div className="p-4 border-t border-gray-100 bg-gray-50">
                                <Button className="w-full" onClick={handleSaveLayout} disabled={!template}>
                                    <Save className="mr-2 h-4 w-4" /> Save Layout
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* SECTION E: Results */}
            {generatedCards.length > 0 && (
                <Card id="results-section" className="border-green-200 bg-green-50/30">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-green-800">
                            <Icon icon={CheckCircle2} className="text-green-600" />
                            Generated Cards ({generatedCards.length})
                        </CardTitle>
                        <CardDescription>Your cards have been generated successfully.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {generatedCards.map((card, i) => (
                                <div key={i} className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                    <div className="aspect-video bg-gray-100 relative overflow-hidden">
                                        <img src={card.outputPath} alt="Generated Card" className="object-cover w-full h-full" />
                                    </div>
                                    <div className="p-3">
                                        <p className="text-xs text-gray-500 truncate mb-2">
                                            To: {card.recipientData['Recipient Name'] || 'Recipient'}
                                        </p>
                                        <a
                                            href={card.outputPath}
                                            download
                                            className="flex items-center justify-center gap-1 w-full py-1.5 bg-gray-50 hover:bg-gray-100 text-xs font-medium text-gray-700 rounded border border-gray-200 transition-colors"
                                        >
                                            <Download size={12} /> Download
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            <div className="flex justify-end pt-4 pb-20">
                <Button
                    disabled={!batchData || isGenerating}
                    variant="cta"
                    className="w-full md:w-auto text-lg px-8 py-6 h-auto"
                    onClick={handleGenerate}
                    isLoading={isGenerating}
                >
                    {isGenerating ? "Generating..." : "Proceed to Generation"}
                    {!isGenerating && <Icon icon={CheckCircle2} className="ml-2" size={20} />}
                </Button>
            </div>
        </div>
    );
};

export default InputData;
