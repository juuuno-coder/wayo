
export default function SidebarItem({ type, icon, label, onClick }: { type: string, icon: string, label: string, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className="flex flex-col items-center justify-center gap-2 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 hover:shadow-md transition-all group active:scale-95"
        >
            <span className="text-2xl filter group-hover:scale-110 transition-transform">{icon}</span>
            <span className="text-xs font-bold text-gray-600 group-hover:text-blue-600">{label}</span>
        </button>
    );
}
