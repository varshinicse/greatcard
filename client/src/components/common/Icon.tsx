import { LucideIcon } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface IconProps {
    icon: LucideIcon;
    className?: string;
    size?: number;
}

export const Icon = ({ icon: IconComponent, className, size = 20 }: IconProps) => {
    return (
        <IconComponent
            size={size}
            className={cn("shrink-0", className)}
        />
    );
};
