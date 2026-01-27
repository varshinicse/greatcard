import { forwardRef } from "react";
import { cn } from "@/components/common/Icon";

interface ToggleProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
    ({ className, label, checked, ...props }, ref) => {
        return (
            <label className="inline-flex items-center cursor-pointer">
                <input
                    type="checkbox"
                    className="sr-only peer"
                    ref={ref}
                    checked={checked}
                    {...props}
                />
                <div className={cn(
                    "relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-brand-blue rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-blue",
                    className
                )}></div>
                {label && <span className="ms-3 text-sm font-medium text-gray-700">{label}</span>}
            </label>
        );
    }
);
Toggle.displayName = "Toggle";

export { Toggle };
