import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Icon } from "@/components/common/Icon";
import { Eye, Check, Search, Image as ImageIcon } from "lucide-react";
import { Input } from "@/components/ui/Input";

interface Template {
    _id: string;
    name: string;
    type: string;
    previewPath: string;
    tags?: string[];
}

const SelectTemplate = () => {
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [previewId, setPreviewId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [templates, setTemplates] = useState<Template[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/templates')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setTemplates(data.data);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const filteredTemplates = templates.filter(m =>
        m.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <div className="w-full md:w-96">
                    <div className="relative">
                        <Icon icon={Search} className="absolute left-3 top-3 text-gray-400" size={16} />
                        <Input
                            placeholder="Search templates..."
                            className="pl-9 bg-gray-50 border-gray-200"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="ghost">All Types</Button>
                    <Button variant="ghost">Portrait</Button>
                    <Button variant="ghost">Landscape</Button>
                </div>
            </div>

            {/* Grid */}
            {loading ? (
                <div className="text-center py-20 text-gray-500">Loading templates...</div>
            ) : filteredTemplates.length === 0 ? (
                <div className="text-center py-20 text-gray-500">No templates found. Go to "Generate Template" to add one.</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredTemplates.map((template) => (
                        <Card key={template._id} className={`group cursor-pointer transition-all border-2 ${selectedId === template._id ? 'border-brand-blue ring-2 ring-blue-100' : 'border-transparent hover:border-gray-200 hover:shadow-md'}`} onClick={() => setSelectedId(template._id)}>
                            <div className="aspect-[3/4] bg-gray-100 relative overflow-hidden rounded-t-xl">
                                <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                                    {template.previewPath ? (
                                        <img src={template.previewPath} alt={template.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <Icon icon={ImageIcon} size={48} />
                                    )}
                                </div>
                                {/* Overlay Actions */}
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                    <Button
                                        size="icon"
                                        variant="secondary"
                                        className="rounded-full"
                                        onClick={(e) => { e.stopPropagation(); setPreviewId(template._id); }}
                                    >
                                        <Eye size={18} />
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant="default" // Primary Blue
                                        className="rounded-full"
                                        onClick={(e) => { e.stopPropagation(); setSelectedId(template._id); }}
                                    >
                                        <Check size={18} />
                                    </Button>
                                </div>
                            </div>
                            <CardContent className="p-4">
                                <h3 className="font-semibold text-gray-900 truncate">{template.name}</h3>
                                <div className="flex items-center justify-between mt-2">
                                    <Badge variant="secondary" className="text-[10px]">{template.type}</Badge>
                                    {selectedId === template._id && (
                                        <Badge variant="default" className="bg-brand-blue">Selected</Badge>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Preview Modal */}
            <Modal
                isOpen={!!previewId}
                onClose={() => setPreviewId(null)}
                title="Template Preview"
                className="max-w-2xl"
                footer={
                    <div className="flex justify-between w-full">
                        <Button variant="secondary" onClick={() => setPreviewId(null)}>Close</Button>
                        <Button onClick={() => { setSelectedId(previewId); setPreviewId(null); }}>Select This Template</Button>
                    </div>
                }
            >
                <div className="flex justify-center bg-gray-50 py-10 rounded-lg border border-gray-100">
                    {/* Simulated Image */}
                    <div className="w-80 h-96 bg-white shadow-xl rounded flex items-center justify-center overflow-hidden">
                        {previewId && templates.find(t => t._id === previewId)?.previewPath ? (
                            <img src={templates.find(t => t._id === previewId)?.previewPath} className="w-full h-full object-contain" />
                        ) : (
                            <span className="text-gray-400">Preview Image</span>
                        )}
                    </div>
                </div>
                <div className="mt-6 space-y-2">
                    <h4 className="font-semibold text-lg">{previewId && templates.find(m => m._id === previewId)?.name}</h4>
                    <p className="text-sm text-gray-500">Local template ready for bulk generation.</p>
                    <div className="flex gap-2 mt-2">
                        {/* Tags handled if present */}
                    </div>
                </div>
            </Modal>

            {/* Floating Action Bar if Selected */}
            {selectedId && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-gray-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-6 animate-in slide-in-from-bottom-10 fade-in">
                    <span className="font-medium">1 Template Selected</span>
                    <div className="h-4 w-[1px] bg-gray-700"></div>
                    <Button variant="cta" className="rounded-full h-8" onClick={() => alert("Proceeding to Input Data (ID: " + selectedId + ")")}>
                        Next Step: Input Data
                    </Button>
                </div>
            )}
        </div>
    );
};

export default SelectTemplate;
