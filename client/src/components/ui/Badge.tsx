import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/components/common/Icon";

const badgeVariants = cva(
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2",
    {
        variants: {
            variant: {
                default:
                    "border-transparent bg-brand-blue text-white shadow hover:bg-brand-blue/80",
                secondary:
                    "border-transparent bg-gray-100 text-gray-900 hover:bg-gray-100/80",
                destructive:
                    "border-transparent bg-brand-red text-white shadow hover:bg-brand-red/80",
                success:
                    "border-transparent bg-brand-green text-white shadow hover:bg-brand-green/80",
                warning:
                    "border-transparent bg-brand-yellow text-gray-900 shadow hover:bg-brand-yellow/80",
                outline: "text-gray-950 border-gray-200",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
);

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
    return (
        <div className={cn(badgeVariants({ variant }), className)} {...props} />
    );
}

export { Badge, badgeVariants };
