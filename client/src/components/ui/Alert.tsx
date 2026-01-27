import { cva, type VariantProps } from "class-variance-authority";
import { AlertCircle, CheckCircle2, Info, XCircle } from "lucide-react";
import { cn } from "@/components/common/Icon";

const alertVariants = cva(
    "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
    {
        variants: {
            variant: {
                default: "bg-white text-gray-950 border-gray-200",
                destructive:
                    "border-red-500/50 text-red-600 dark:border-red-500 [&>svg]:text-red-600 bg-red-50",
                success:
                    "border-green-500/50 text-green-600 dark:border-green-500 [&>svg]:text-green-600 bg-green-50",
                warning:
                    "border-yellow-500/50 text-yellow-600 dark:border-yellow-500 [&>svg]:text-yellow-600 bg-yellow-50",
                info:
                    "border-blue-500/50 text-blue-600 dark:border-blue-500 [&>svg]:text-blue-600 bg-blue-50",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
);

interface AlertProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof alertVariants> {
    title?: string;
    icon?: boolean;
}

const Alert = ({ className, variant, title, icon = true, children, ...props }: AlertProps) => {
    const getIcon = () => {
        if (!icon) return null;
        switch (variant) {
            case 'destructive': return <XCircle className="h-4 w-4" />;
            case 'success': return <CheckCircle2 className="h-4 w-4" />;
            case 'warning': return <AlertCircle className="h-4 w-4" />;
            case 'info': return <Info className="h-4 w-4" />;
            default: return <Info className="h-4 w-4" />;
        }
    };

    return (
        <div role="alert" className={cn(alertVariants({ variant }), className)} {...props}>
            {getIcon()}
            {title && <h5 className="mb-1 font-medium leading-none tracking-tight">{title}</h5>}
            <div className="text-sm [&_p]:leading-relaxed">{children}</div>
        </div>
    );
};

export { Alert };
