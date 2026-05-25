import { Head, Link, router, usePage } from '@/lib/inertiaCompat';
import { useState } from 'react';
import MobileShell from '@/Components/Storefront/MobileShell';
import { useTheme } from '@/Contexts/ThemeContext';
import { useToast } from '@/Contexts/ToastContext';
import { useLanguage } from '@/Contexts/LanguageContext';
import { useCurrency } from '@/Contexts/CurrencyContext';

const menuItems = [
    { label: 'Wishlist', href: '/wishlist', icon: '♥', color: 'text-rose-500' },
    { label: 'Orders', href: '/orders', icon: '📦', color: 'text-blue-500' },
    { label: 'Recently Viewed', href: '/recently-viewed', icon: '👁️', color: 'text-purple-500' },
    { label: 'Compare', href: '/compare', icon: '⚖️', color: 'text-indigo-500' },
];

export default function ProfilePage() {
    const { props } = usePage();
    const user = props.auth?.user;
    const { theme, toggleTheme } = useTheme();
    const { addToast } = useToast();
    const { language, changeLanguage, availableLanguages } = useLanguage();
    const { currency, setCurrency, availableCurrencies, currencySymbols } = useCurrency();

    const [activeTab, setActiveTab] = useState('overview');
    const [profileForm, setProfileForm] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        bio: '',
    });
    const [passwordForm, setPasswordForm] = useState({
        current: '',
        newPassword: '',
        confirm: '',
    });
    const [addresses, setAddresses] = useState([
        { id: 1, label: 'Home', name: 'John Doe', phone: '01XXXXXXXXX', address: '123 Main Street, Dhaka 1216', isDefault: true },
    ]);
    const [showAddAddress, setShowAddAddress] = useState(false);
    const [newAddress, setNewAddress] = useState({ label: '', name: '', phone: '', address: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [notifications, setNotifications] = useState({
        orderUpdates: true,
        promotions: true,
        newArrivals: false,
        priceDrops: true,
    });

    const logout = () => {
        router.post('/logout');
    };

    const updateProfile = (field, value) => setProfileForm((f) => ({ ...f, [field]: value }));
    const updatePassword = (field, value) => setPasswordForm((f) => ({ ...f, [field]: value }));

    const saveProfile = () => {
        addToast('Profile updated!', 'success');
    };

    const changePassword = () => {
        if (!passwordForm.current || !passwordForm.newPassword) {
            addToast('Please fill all fields', 'error');
            return;
        }
        if (passwordForm.newPassword !== passwordForm.confirm) {
            addToast('New passwords do not match', 'error');
            return;
        }
        addToast('Password changed!', 'success');
        setPasswordForm({ current: '', newPassword: '', confirm: '' });
    };

    const addAddress = () => {
        if (!newAddress.name || !newAddress.phone || !newAddress.address) {
            addToast('Please fill all fields', 'error');
            return;
        }
        setAddresses((prev) => [...prev, { ...newAddress, id: Date.now(), isDefault: false }]);
        setNewAddress({ label: '', name: '', phone: '', address: '' });
        setShowAddAddress(false);
        addToast('Address added!', 'success');
    };

    const removeAddress = (id) => {
        setAddresses((prev) => prev.filter((a) => a.id !== id));
        addToast('Address removed', 'info');
    };

    const setDefaultAddress = (id) => {
        setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
        addToast('Default address set', 'success');
    };

    const tabs = [
        { id: 'overview', label: 'Overview', icon: '🏠' },
        { id: 'edit', label: 'Profile', icon: '✏️' },
        { id: 'addresses', label: 'Addresses', icon: '📍' },
        { id: 'password', label: 'Password', icon: '🔒' },
        { id: 'notifications', label: 'Notifications', icon: '🔔' },
    ];

    const inputClass = "h-12 w-full rounded-2xl border-slate-200 px-4 text-sm font-semibold focus:border-orange-500 focus:ring-orange-500";

    return (
        <MobileShell title="Profile" showSearch={false}>
            <Head title="Profile" />
            <section className="space-y-4 px-4 py-4">
                {/* Profile Header */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500 via-rose-500 to-fuchsia-600 p-5 text-white shadow-xl shadow-orange-200">
                    <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
                    <div className="absolute -right-4 bottom-0 h-24 w-24 rounded-full bg-white/10" />
                    <div className="relative">
                        <div className="flex items-center gap-4">
                            <div className="grid h-20 w-20 place-items-center rounded-full bg-white text-3xl font-black text-orange-600 shadow-lg">
                                {((user?.name ?? profileForm.name) || 'G').slice(0, 1).toUpperCase()}
                            </div>
                            <div className="flex-1">
                                <h1 className="text-2xl font-black">{(user?.name ?? profileForm.name) || 'Guest Shopper'}</h1>
                                <p className="mt-1 text-sm font-semibold text-white/90">
                                    {(user?.email ?? profileForm.email) || 'Login to start shopping'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Auth Buttons */}
                {user ? (
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={() => setActiveTab('edit')}
                            className="flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-4 text-sm font-black text-white transition-all duration-200 hover:bg-slate-800 active:scale-95"
                        >
                            <span>⚙️</span>
                            Settings
                        </button>
                        <button
                            type="button"
                            onClick={logout}
                            className="flex items-center justify-center gap-2 rounded-2xl bg-white px-4 py-4 text-sm font-black text-red-600 ring-1 ring-red-100 transition-all duration-200 hover:bg-red-50 active:scale-95"
                        >
                            <span>🚪</span>
                            Logout
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-3">
                        <Link href="/login" className="flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-4 text-sm font-black text-white transition-all duration-200 hover:bg-slate-800 active:scale-95">
                            <span>🔐</span>
                            Login
                        </Link>
                        <Link href="/register" className="flex items-center justify-center gap-2 rounded-2xl bg-white px-4 py-4 text-sm font-black text-orange-600 ring-1 ring-orange-100 transition-all duration-200 hover:bg-orange-50 active:scale-95">
                            <span>📝</span>
                            Register
                        </Link>
                    </div>
                )}

                {/* Tab Navigation */}
                <div className="flex gap-1 overflow-x-auto rounded-2xl bg-slate-100 p-1 scrollbar-hide">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-2.5 text-xs font-black transition-all duration-200 ${
                                activeTab === tab.id
                                    ? 'bg-white text-orange-600 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-700'
                            }`}
                        >
                            <span>{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <>
                        <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
                            <h2 className="mb-3 text-base font-black text-slate-950">Quick Access</h2>
                            <div className="space-y-1">
                                {menuItems.map((item) => (
                                    <Link
                                        key={item.label}
                                        href={item.href}
                                        className="flex items-center justify-between rounded-2xl px-4 py-3 transition-all duration-200 hover:bg-slate-50 active:scale-98"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className={`text-xl ${item.color}`}>{item.icon}</span>
                                            <span className="text-sm font-black text-slate-800">{item.label}</span>
                                        </div>
                                        <span className="text-lg font-black text-slate-300">&rsaquo;</span>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
                            <h2 className="mb-3 text-base font-black text-slate-950">Preferences</h2>
                            <div className="space-y-1">
                                <button
                                    type="button"
                                    onClick={toggleTheme}
                                    className="flex w-full items-center justify-between rounded-2xl px-4 py-3 transition-all duration-200 hover:bg-slate-50"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-xl text-amber-500">
                                            {theme === 'dark' ? '🌙' : '☀️'}
                                        </span>
                                        <span className="text-sm font-black text-slate-800">
                                            {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                                        </span>
                                    </div>
                                    <span className="text-lg font-black text-slate-300">&rsaquo;</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('notifications')}
                                    className="flex w-full items-center justify-between rounded-2xl px-4 py-3 transition-all duration-200 hover:bg-slate-50"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-xl text-blue-500">🔔</span>
                                        <span className="text-sm font-black text-slate-800">Notification Settings</span>
                                    </div>
                                    <span className="text-lg font-black text-slate-300">&rsaquo;</span>
                                </button>
                            </div>
                        </div>

                        {/* Language & Currency Settings */}
                        <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
                            <h2 className="mb-3 text-base font-black text-slate-950">Language & Currency</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="mb-2 block text-xs font-bold text-slate-600">Language</label>
                                    <div className="flex flex-wrap gap-2">
                                        {Object.entries(availableLanguages).map(([code, lang]) => (
                                            <button
                                                key={code}
                                                type="button"
                                                onClick={() => changeLanguage(code)}
                                                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-black transition-all duration-200 active:scale-95 ${
                                                    language === code
                                                        ? 'bg-orange-600 text-white shadow-sm'
                                                        : 'bg-slate-50 text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100'
                                                }`}
                                            >
                                                <span>{lang.flag}</span>
                                                {lang.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="mb-2 block text-xs font-bold text-slate-600">Currency</label>
                                    <div className="flex flex-wrap gap-2">
                                        {availableCurrencies.map((code) => (
                                            <button
                                                key={code}
                                                type="button"
                                                onClick={() => setCurrency(code)}
                                                className={`flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-black transition-all duration-200 active:scale-95 ${
                                                    currency === code
                                                        ? 'bg-orange-600 text-white shadow-sm'
                                                        : 'bg-slate-50 text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100'
                                                }`}
                                            >
                                                <span className="text-xs">{currencySymbols[code]}</span>
                                                {code}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {user?.is_admin && (
                            <div className="rounded-3xl bg-gradient-to-r from-slate-900 to-slate-800 p-4 shadow-sm ring-1 ring-slate-700">
                                <Link href="/admin/products" className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="text-xl">🛠️</span>
                                        <div>
                                            <span className="block text-sm font-black text-white">Admin Panel</span>
                                            <span className="block text-xs font-semibold text-slate-400">Manage products</span>
                                        </div>
                                    </div>
                                    <span className="text-lg font-black text-slate-400">&rsaquo;</span>
                                </Link>
                            </div>
                        )}
                    </>
                )}

                {/* Edit Profile Tab */}
                {activeTab === 'edit' && (
                    <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
                        <h2 className="text-lg font-black text-slate-950">Edit Profile</h2>
                        <div className="mt-4 space-y-4">
                            <div className="flex justify-center">
                                <div className="relative">
                                    <div className="grid h-24 w-24 place-items-center rounded-full bg-gradient-to-br from-orange-100 to-rose-100 text-4xl font-black text-orange-600 ring-4 ring-white shadow-lg">
                                        {(profileForm.name || 'G').slice(0, 1).toUpperCase()}
                                    </div>
                                    <button type="button" className="absolute -bottom-1 -right-1 grid h-8 w-8 place-items-center rounded-full bg-orange-600 text-sm text-white shadow-md">
                                        📷
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="mb-2 block text-xs font-bold text-slate-600">Full Name</label>
                                <input value={profileForm.name} onChange={(e) => updateProfile('name', e.target.value)} className={inputClass} placeholder="Your name" />
                            </div>
                            <div>
                                <label className="mb-2 block text-xs font-bold text-slate-600">Email</label>
                                <input type="email" value={profileForm.email} onChange={(e) => updateProfile('email', e.target.value)} className={inputClass} placeholder="email@example.com" />
                            </div>
                            <div>
                                <label className="mb-2 block text-xs font-bold text-slate-600">Phone</label>
                                <input type="tel" value={profileForm.phone} onChange={(e) => updateProfile('phone', e.target.value)} className={inputClass} placeholder="01XXXXXXXXX" />
                            </div>
                            <div>
                                <label className="mb-2 block text-xs font-bold text-slate-600">Bio</label>
                                <textarea value={profileForm.bio} onChange={(e) => updateProfile('bio', e.target.value)} className="min-h-20 w-full rounded-2xl border-slate-200 px-4 py-3 text-sm font-semibold focus:border-orange-500 focus:ring-orange-500" placeholder="Tell us about yourself..." />
                            </div>
                            <button type="button" onClick={saveProfile} className="h-12 w-full rounded-2xl bg-orange-600 text-sm font-black text-white shadow-lg shadow-orange-200 transition-all duration-200 hover:bg-orange-700 active:scale-95">
                                Save
                            </button>
                        </div>
                    </div>
                )}

                {/* Addresses Tab */}
                {activeTab === 'addresses' && (
                    <div className="space-y-4">
                        <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-black text-slate-950">Saved Addresses</h2>
                                <button type="button" onClick={() => setShowAddAddress(!showAddAddress)} className="rounded-full bg-orange-50 px-3 py-1.5 text-xs font-black text-orange-600 transition-all duration-200 hover:bg-orange-100 active:scale-95">
                                    + New
                                </button>
                            </div>

                            {showAddAddress && (
                                <div className="mt-4 space-y-3 rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-200">
                                    <input value={newAddress.label} onChange={(e) => setNewAddress((a) => ({ ...a, label: e.target.value }))} className={inputClass} placeholder="Label (Home/Office)" />
                                    <input value={newAddress.name} onChange={(e) => setNewAddress((a) => ({ ...a, name: e.target.value }))} className={inputClass} placeholder="Recipient Name" />
                                    <input type="tel" value={newAddress.phone} onChange={(e) => setNewAddress((a) => ({ ...a, phone: e.target.value }))} className={inputClass} placeholder="Phone Number" />
                                    <textarea value={newAddress.address} onChange={(e) => setNewAddress((a) => ({ ...a, address: e.target.value }))} className="min-h-16 w-full rounded-2xl border-slate-200 px-4 py-3 text-sm font-semibold focus:border-orange-500 focus:ring-orange-500" placeholder="Full Address" />
                                    <div className="flex gap-2">
                                        <button type="button" onClick={() => setShowAddAddress(false)} className="h-10 flex-1 rounded-xl bg-slate-200 text-sm font-black text-slate-600">Cancel</button>
                                        <button type="button" onClick={addAddress} className="h-10 flex-1 rounded-xl bg-orange-600 text-sm font-black text-white">Save</button>
                                    </div>
                                </div>
                            )}

                            <div className="mt-4 space-y-3">
                                {addresses.map((addr) => (
                                    <div key={addr.id} className={`rounded-2xl p-3 ring-1 transition-all duration-200 ${addr.isDefault ? 'bg-orange-50 ring-orange-200' : 'bg-white ring-slate-200'}`}>
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-black text-slate-900">{addr.label || 'Address'}</span>
                                                    {addr.isDefault && (
                                                        <span className="rounded-full bg-orange-600 px-2 py-0.5 text-[10px] font-bold text-white">Default</span>
                                                    )}
                                                </div>
                                                <p className="mt-1 text-sm font-semibold text-slate-600">{addr.name}</p>
                                                <p className="text-xs text-slate-500">{addr.phone}</p>
                                                <p className="mt-1 text-xs text-slate-500">{addr.address}</p>
                                            </div>
                                        </div>
                                        <div className="mt-2 flex gap-2">
                                            {!addr.isDefault && (
                                                <button type="button" onClick={() => setDefaultAddress(addr.id)} className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600 transition-all hover:bg-slate-200">
                                                    Make Default
                                                </button>
                                            )}
                                            <button type="button" onClick={() => removeAddress(addr.id)} className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 transition-all hover:bg-red-100">
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Password Tab */}
                {activeTab === 'password' && (
                    <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
                        <h2 className="text-lg font-black text-slate-950">Change Password</h2>
                        <div className="mt-4 space-y-4">
                            <div>
                                <label className="mb-2 block text-xs font-bold text-slate-600">Current Password</label>
                                <input type={showPassword ? 'text' : 'password'} value={passwordForm.current} onChange={(e) => updatePassword('current', e.target.value)} className={inputClass} placeholder="Current password" />
                            </div>
                            <div>
                                <label className="mb-2 block text-xs font-bold text-slate-600">New Password</label>
                                <input type={showPassword ? 'text' : 'password'} value={passwordForm.newPassword} onChange={(e) => updatePassword('newPassword', e.target.value)} className={inputClass} placeholder="New password" />
                            </div>
                            <div>
                                <label className="mb-2 block text-xs font-bold text-slate-600">Confirm New Password</label>
                                <input type={showPassword ? 'text' : 'password'} value={passwordForm.confirm} onChange={(e) => updatePassword('confirm', e.target.value)} className={inputClass} placeholder="Confirm new password" />
                            </div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                                <input type="checkbox" checked={showPassword} onChange={(e) => setShowPassword(e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500" />
                                Show Password
                            </label>
                            <button type="button" onClick={changePassword} className="h-12 w-full rounded-2xl bg-orange-600 text-sm font-black text-white shadow-lg shadow-orange-200 transition-all duration-200 hover:bg-orange-700 active:scale-95">
                                Change Password
                            </button>
                        </div>
                    </div>
                )}

                {/* Notifications Tab */}
                {activeTab === 'notifications' && (
                    <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
                        <h2 className="text-lg font-black text-slate-950">Notification Settings</h2>
                        <div className="mt-4 space-y-3">
                            {[
                                { key: 'orderUpdates', label: 'Order Updates', desc: 'Get notified when your order status changes' },
                                { key: 'promotions', label: 'Promotions & Offers', desc: 'Learn about new discounts and deals' },
                                { key: 'newArrivals', label: 'New Arrivals', desc: 'Get notified about new products' },
                                { key: 'priceDrops', label: 'Price Drops', desc: 'Get notified when wishlist items drop in price' },
                            ].map((item) => (
                                <div key={item.key} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 ring-1 ring-slate-200">
                                    <div>
                                        <p className="text-sm font-black text-slate-800">{item.label}</p>
                                        <p className="text-xs font-semibold text-slate-400">{item.desc}</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setNotifications((n) => ({ ...n, [item.key]: !n[item.key] }))}
                                        className={`relative h-7 w-12 rounded-full transition-all duration-300 ${notifications[item.key] ? 'bg-orange-600' : 'bg-slate-300'}`}
                                    >
                                        <span className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-sm transition-all duration-300 ${notifications[item.key] ? 'left-[22px]' : 'left-0.5'}`} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </section>
        </MobileShell>
    );
}
