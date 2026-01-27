import { Bell, User, Search } from 'lucide-react';
import { Icon } from '@/components/common/Icon';

interface HeaderProps {
    title?: string;
}

const Header = ({ title = "Dashboard" }: HeaderProps) => {
    return (
        <header className="h-16 bg-white border-b border-gray-200 sticky top-0 z-20 flex items-center px-6 justify-between shadow-sm">
            <div className="flex items-center gap-4">
                <h2 className="text-xl font-semibold text-gray-800 tracking-tight">{title}</h2>
            </div>

            <div className="flex items-center gap-4">
                {/* Search Bar - Visual Only */}
                <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-3 py-2 w-64 border border-transparent focus-within:border-brand-blue focus-within:bg-white transition-all">
                    <Icon icon={Search} className="text-gray-400 mr-2" size={18} />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="bg-transparent border-none outline-none text-sm w-full text-gray-700 placeholder-gray-400"
                    />
                </div>

                <div className="h-8 w-[1px] bg-gray-200 mx-2 hidden md:block"></div>

                {/* Actions */}
                <button className="p-2 text-gray-500 hover:text-brand-blue hover:bg-blue-50 rounded-full transition-colors relative">
                    <Icon icon={Bell} size={20} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-brand-red rounded-full border border-white"></span>
                </button>

                <div className="flex items-center gap-3 pl-2 cursor-pointer hover:opacity-80 transition-opacity">
                    <div className="w-9 h-9 bg-brand-blue/10 rounded-full flex items-center justify-center text-brand-blue border border-brand-blue/20">
                        <Icon icon={User} size={18} />
                    </div>
                    <div className="hidden md:block">
                        <p className="text-sm font-medium text-gray-700">Admin User</p>
                        <p className="text-xs text-gray-400">Administrator</p>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
