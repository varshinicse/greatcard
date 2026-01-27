import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Users, FileImage, Layers, ArrowUpRight, ArrowDownRight, MoreHorizontal } from "lucide-react";
import { Icon } from "@/components/common/Icon";

const Dashboard = () => {
    return (
        <div className="space-y-6">
            {/* Metrics Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Generated</CardTitle>
                        <Icon icon={FileImage} className="text-brand-blue" size={20} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">12,543</div>
                        <p className="text-xs text-gray-500 mt-1 flex items-center">
                            <span className="text-brand-green flex items-center text-xs font-semibold mr-1">
                                <ArrowUpRight size={14} /> +20.1%
                            </span>
                            from last month
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Templates</CardTitle>
                        <Icon icon={Layers} className="text-brand-yellow" size={20} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">45</div>
                        <p className="text-xs text-gray-500 mt-1 flex items-center">
                            <span className="text-brand-green flex items-center text-xs font-semibold mr-1">
                                <ArrowUpRight size={14} /> +2
                            </span>
                            new this week
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Bulk Jobs</CardTitle>
                        <Icon icon={Users} className="text-purple-500" size={20} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">8</div>
                        <p className="text-xs text-gray-500 mt-1 flex items-center">
                            <span className="text-brand-red flex items-center text-xs font-semibold mr-1">
                                <ArrowDownRight size={14} /> -1
                            </span>
                            processing now
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activity Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Generation Jobs</CardTitle>
                    <CardDescription>A list of your recent bulk and single generation tasks.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Job ID</TableHead>
                                <TableHead>Template</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {[1, 2, 3, 4, 5].map((item) => (
                                <TableRow key={item}>
                                    <TableCell className="font-medium">#JOB-202{item}</TableCell>
                                    <TableCell>Holiday Greetings 2024</TableCell>
                                    <TableCell>
                                        <span className="text-gray-600 border border-gray-200 px-2 py-0.5 rounded text-xs">Bulk CSV</span>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={item === 1 ? 'warning' : item === 3 ? 'destructive' : 'success'}>
                                            {item === 1 ? 'Processing' : item === 3 ? 'Failed' : 'Completed'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-gray-500">Jan {20 + item}, 2024</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon">
                                            <MoreHorizontal size={16} />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default Dashboard;
