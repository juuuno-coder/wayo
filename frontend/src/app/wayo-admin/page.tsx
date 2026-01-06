export default function WayoAdminPage() {
    return (
        <div className="min-h-screen bg-black text-white p-10 font-sans">
            <header className="mb-10 flex items-center justify-between border-b border-gray-800 pb-5">
                <h1 className="text-3xl font-bold tracking-tighter">WAYO <span className="text-blue-500">Platform Admin</span></h1>
                <div className="text-sm text-gray-500">Super Admin Mode</div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
                    <h2 className="text-xl font-bold mb-4">Users</h2>
                    <div className="text-4xl font-bold mb-2">1,240</div>
                    <p className="text-gray-500 text-sm">Total Registered Users</p>
                </div>

                <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
                    <h2 className="text-xl font-bold mb-4">Invitations</h2>
                    <div className="text-4xl font-bold mb-2">582</div>
                    <p className="text-gray-500 text-sm">Created this month</p>
                </div>

                <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
                    <h2 className="text-xl font-bold mb-4">Revenue</h2>
                    <div className="text-4xl font-bold mb-2 text-green-400">₩1.2M</div>
                    <p className="text-gray-500 text-sm">Monthly Recurring Revenue</p>
                </div>
            </div>

            <div className="mt-10">
                <h3 className="text-lg font-bold mb-5 text-gray-400 uppercase tracking-wider">Platform Settings</h3>
                <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-800/50 text-gray-400 text-xs uppercase">
                            <tr>
                                <th className="p-4">Setting</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            <tr>
                                <td className="p-4 font-medium">Public Registration</td>
                                <td className="p-4 text-green-400">Active</td>
                                <td className="p-4"><button className="text-blue-400 hover:underline">Configure</button></td>
                            </tr>
                            <tr>
                                <td className="p-4 font-medium">Beta Features (Editor)</td>
                                <td className="p-4 text-yellow-400">Testing</td>
                                <td className="p-4"><button className="text-blue-400 hover:underline">Manage Access</button></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
