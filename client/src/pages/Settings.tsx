import { useState } from 'react';
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/Button";
import { Bell, Lock, Globe, Moon } from "lucide-react";

const Settings = () => {
    // Local State for Preferences
    const [notifications, setNotifications] = useState(true);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [language, setLanguage] = useState('en');

    const handleToggleNotifs = () => {
        setNotifications(!notifications);
        // Persist to backend...
        console.log("Notifications set to:", !notifications);
    };

    const handleThemeChange = () => {
        setIsDarkMode(!isDarkMode);
        console.log("Theme toggled");
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-500 pb-20">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                <p className="text-gray-500">Manage your preferences and application settings.</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 divide-y divide-gray-100">
                {/* Notification Settings */}
                <div className="p-6 flex items-start justify-between">
                    <div className="flex gap-4">
                        <div className="p-2 bg-blue-50 text-brand-blue rounded-lg">
                            <Icon icon={Bell} size={20} />
                        </div>
                        <div>
                            <h3 className="text-base font-semibold text-gray-900">Notifications</h3>
                            <p className="text-sm text-gray-500">Manage how you receive alerts and updates.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-500">{notifications ? 'On' : 'Off'}</span>
                        <button
                            className={`w-11 h-6 flex items-center bg-gray-300 rounded-full p-1 duration-300 ${notifications ? 'bg-brand-blue' : ''}`}
                            onClick={handleToggleNotifs}
                        >
                            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ${notifications ? 'translate-x-5' : ''}`}></div>
                        </button>
                    </div>
                </div>

                {/* Security */}
                <div className="p-6 flex items-start justify-between">
                    <div className="flex gap-4">
                        <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                            <Icon icon={Lock} size={20} />
                        </div>
                        <div>
                            <h3 className="text-base font-semibold text-gray-900">Security</h3>
                            <p className="text-sm text-gray-500">Password, 2FA, and login sessions.</p>
                        </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => alert("Security settings dashboard coming soon.")}>Manage</Button>
                </div>

                {/* Appearance */}
                <div className="p-6 flex items-start justify-between">
                    <div className="flex gap-4">
                        <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                            <Icon icon={Moon} size={20} />
                        </div>
                        <div>
                            <h3 className="text-base font-semibold text-gray-900">Appearance</h3>
                            <p className="text-sm text-gray-500">Customize the look and feel.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-500">{isDarkMode ? 'Dark' : 'Light'}</span>
                        <button
                            className={`w-11 h-6 flex items-center bg-gray-300 rounded-full p-1 duration-300 ${isDarkMode ? 'bg-purple-600' : ''}`}
                            onClick={handleThemeChange}
                        >
                            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ${isDarkMode ? 'translate-x-5' : ''}`}></div>
                        </button>
                    </div>
                </div>

                {/* Language */}
                <div className="p-6 flex items-start justify-between">
                    <div className="flex gap-4">
                        <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                            <Icon icon={Globe} size={20} />
                        </div>
                        <div>
                            <h3 className="text-base font-semibold text-gray-900">Language</h3>
                            <p className="text-sm text-gray-500">Select your preferred language.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="text-sm font-medium text-gray-700 bg-transparent border-none focus:ring-0 cursor-pointer"
                        >
                            <option value="en">English</option>
                            <option value="es">Spanish</option>
                            <option value="fr">French</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
