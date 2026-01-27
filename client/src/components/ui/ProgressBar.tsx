import { forwardRef } from "react";
import { cn } from "@/components/common/Icon";

interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
    value: number; // 0 to 100
    max?: number;
    showLabel?: boolean;
}

const ProgressBar = forwardRef<HTMLDivElement, ProgressBarProps>(
    ({ className, value, max = 100, showLabel = false, ...props }, ref) => {
        const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

        return (
            <div className="w-full">
                {showLabel && (
                    <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-brand-blue">Progress</span>
                        <span className="text-sm font-medium text-brand-blue">{Math.round(percentage)}%</span>
                    </div>
                )}
                <div
                    ref={ref}
                    className={cn(
                        "w-full bg-gray-200 rounded-full h-2.5",
                        className
                    )}
                    {...props}
                >
                    <div
                        className="bg-brand-blue h-2.5 rounded-full transition-all duration-300 ease-out"
                        style={{ width: `${percentage}%` }}
                    ></div>
                </div>
            </div>
        );
    }
);
ProgressBar.displayName = "ProgressBar";

export { ProgressBar };
