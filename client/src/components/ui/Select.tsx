import { SelectHTMLAttributes, forwardRef } from "react";
import { cn } from "@/components/common/Icon";
import { ChevronDown } from "lucide-react";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    error?: string;
    label?: string;
    options: { label: string; value: string }[];
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ className, error, label, options, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        {label}
                    </label>
                )}
                <div className="relative">
                    <select
                        className={cn(
                            "flex h-10 w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 py-2 pr-8 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 transition-all",
                            error && "border-brand-red focus-visible:ring-brand-red",
                            className
                        )}
                        ref={ref}
                        {...props}
                    >
                        {options.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-3 h-4 w-4 opacity-50 pointer-events-none" />
                </div>

                {error && (
                    <p className="mt-1 text-xs text-brand-red">{error}</p>
                )}
            </div>
        );
    }
);
Select.displayName = "Select";

export { Select };
