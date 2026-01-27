import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Select } from "@/components/ui/Select";
import { Toggle } from "@/components/ui/Toggle";
import { Alert } from "@/components/ui/Alert";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Icon } from "@/components/common/Icon";
import { Download, Mail, Share2, Instagram, Smartphone } from "lucide-react";


const OutputDistribution = () => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isComplete, setIsComplete] = useState(false);

    const handleGenerate = () => {
        setIsGenerating(true);
        setProgress(0);

        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setIsGenerating(false);
                    setIsComplete(true);
                    return 100;
                }
                return prev + 10;
            });
        }, 300);
    };

    return (
        <div className="space-y-8">
            {/* Settings Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Output Configurations</CardTitle>
                        <CardDescription>Define how the final assets should be generated.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-4">
                            <Select
                                label="File Format"
                                options={[{ label: 'JPG (Web Optimized)', value: 'jpg' }, { label: 'PNG (High Quality)', value: 'png' }, { label: 'PDF (Print)', value: 'pdf' }]}
                            />
                            <Select
                                label="Resolution"
                                options={[{ label: 'Screen (72 DPI)', value: '72' }, { label: 'Print (300 DPI)', value: '300' }]}
                            />

                            <div className="pt-2">
                                <h4 className="text-sm font-medium text-gray-700 mb-2">Naming Convention</h4>
                                <div className="flex flex-wrap gap-2 text-xs">
                                    <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">Template Name</Badge>
                                    <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">Recipient Name</Badge>
                                    <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">Date</Badge>
                                </div>
                                <p className="text-xs text-gray-400 mt-2">Example: Holiday_Card_John_Doe_2024.jpg</p>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-100">
                            <Button
                                onClick={handleGenerate}
                                disabled={isGenerating || isComplete}
                                variant="cta"
                                className="w-full h-12 text-lg"
                            >
                                {isGenerating ? 'Processing...' : isComplete ? 'Generation Complete' : 'Start Generation'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Distribution Channels</CardTitle>
                        <CardDescription>Automatically send or publish generated cards.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Icon icon={Mail} /></div>
                                <div>
                                    <h5 className="font-medium text-gray-900">Email Campaign</h5>
                                    <p className="text-xs text-gray-500">Send via SMTP or integrated provider</p>
                                </div>
                            </div>
                            <Toggle defaultChecked />
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-100 text-green-600 rounded-lg"><Icon icon={Smartphone} /></div>
                                <div>
                                    <h5 className="font-medium text-gray-900">WhatsApp Business</h5>
                                    <p className="text-xs text-gray-500">Send direct messages to recipients</p>
                                </div>
                            </div>
                            <Toggle />
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-pink-100 text-pink-600 rounded-lg"><Icon icon={Instagram} /></div>
                                <div>
                                    <h5 className="font-medium text-gray-900">Instagram Stories</h5>
                                    <p className="text-xs text-gray-500">Auto-post to connected account</p>
                                </div>
                            </div>
                            <Toggle />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Progress & Results */}
            {(isGenerating || isComplete) && (
                <Card className="animate-in fade-in slide-in-from-bottom-8">
                    <CardHeader>
                        <CardTitle>Job Status</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Processing Batch #2024-001</span>
                                <span>{progress}%</span>
                            </div>
                            <ProgressBar value={progress} />
                        </div>

                        {isComplete && (
                            <div className="space-y-4 pt-4">
                                <Alert variant="success" icon={true} title="Job Completed Successfully">
                                    All 5/5 cards have been generated and queued for distribution.
                                </Alert>

                                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <div key={i} className="aspect-[9/16] bg-gray-100 rounded border border-gray-200 relative group overflow-hidden">
                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/50 transition-opacity">
                                                <Button size="icon" variant="secondary" className="rounded-full">
                                                    <Download size={16} />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex justify-end gap-3 pt-2">
                                    <Button variant="outline">
                                        <Share2 className="mr-2 h-4 w-4" /> Share Report
                                    </Button>
                                    <Button variant="default">
                                        <Download className="mr-2 h-4 w-4" /> Download All (.ZIP)
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default OutputDistribution;
