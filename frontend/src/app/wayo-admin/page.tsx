"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Save, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { API_BASE_URL } from "@/config";

interface Faq {
    id: number;
    question: string;
    answer: string;
    position: number;
}

export default function WayoAdminPage() {
    const { token } = useAuth();
    const [faqs, setFaqs] = useState<Faq[]>([]);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [newFaq, setNewFaq] = useState({ question: "", answer: "", position: 0 });
    const [editForm, setEditForm] = useState({ question: "", answer: "", position: 0 });
    const [isAddingNew, setIsAddingNew] = useState(false);

    useEffect(() => {
        fetchFaqs();
    }, []);

    const fetchFaqs = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/admin/faqs`, {
                headers: {
                    'Authorization': token ? `Bearer ${token}` : ''
                }
            });
            if (res.ok) {
                const data = await res.json();
                setFaqs(data);
            }
        } catch (error) {
            console.error("Failed to fetch FAQs:", error);
        }
    };

    const handleCreate = async () => {
        if (!newFaq.question.trim() || !newFaq.answer.trim()) return;

        try {
            const res = await fetch(`${API_BASE_URL}/admin/faqs`, {
                method: 'POST',
                headers: {
                    'Authorization': token ? `Bearer ${token}` : '',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ faq: { ...newFaq, position: faqs.length + 1 } })
            });

            if (res.ok) {
                await fetchFaqs();
                setNewFaq({ question: "", answer: "", position: 0 });
                setIsAddingNew(false);
            }
        } catch (error) {
            console.error("Failed to create FAQ:", error);
        }
    };

    const handleUpdate = async (id: number) => {
        try {
            const res = await fetch(`${API_BASE_URL}/admin/faqs/${id}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': token ? `Bearer ${token}` : '',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ faq: editForm })
            });

            if (res.ok) {
                await fetchFaqs();
                setEditingId(null);
            }
        } catch (error) {
            console.error("Failed to update FAQ:", error);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("정말 삭제하시겠습니까?")) return;

        try {
            const res = await fetch(`${API_BASE_URL}/admin/faqs/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': token ? `Bearer ${token}` : ''
                }
            });

            if (res.ok) {
                await fetchFaqs();
            }
        } catch (error) {
            console.error("Failed to delete FAQ:", error);
        }
    };

    const startEdit = (faq: Faq) => {
        setEditingId(faq.id);
        setEditForm({ question: faq.question, answer: faq.answer, position: faq.position });
    };

    return (
        <div className="min-h-screen bg-black text-white p-10 font-sans">
            <header className="mb-10 flex items-center justify-between border-b border-gray-800 pb-5">
                <h1 className="text-3xl font-bold tracking-tighter">WAYO <span className="text-blue-500">Platform Admin</span></h1>
                <div className="text-sm text-gray-500">Super Admin Mode</div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
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

            {/* FAQ Management */}
            <div className="mt-10">
                <div className="flex items-center justify-between mb-5">
                    <h3 className="text-lg font-bold text-gray-400 uppercase tracking-wider">FAQ Management</h3>
                    <button
                        onClick={() => setIsAddingNew(!isAddingNew)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                    >
                        {isAddingNew ? <X size={16} /> : <Plus size={16} />}
                        {isAddingNew ? "Cancel" : "Add New FAQ"}
                    </button>
                </div>

                {isAddingNew && (
                    <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6 mb-4">
                        <input
                            type="text"
                            placeholder="Question"
                            value={newFaq.question}
                            onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 mb-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                        />
                        <textarea
                            placeholder="Answer"
                            value={newFaq.answer}
                            onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })}
                            rows={4}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 mb-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                        />
                        <button
                            onClick={handleCreate}
                            className="flex items-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                        >
                            <Save size={16} />
                            Save FAQ
                        </button>
                    </div>
                )}

                <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-800/50 text-gray-400 text-xs uppercase">
                            <tr>
                                <th className="p-4 w-16">#</th>
                                <th className="p-4">Question</th>
                                <th className="p-4">Answer</th>
                                <th className="p-4 w-32">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {faqs.map((faq) => (
                                <tr key={faq.id}>
                                    <td className="p-4 text-gray-500">{faq.position}</td>
                                    <td className="p-4">
                                        {editingId === faq.id ? (
                                            <input
                                                type="text"
                                                value={editForm.question}
                                                onChange={(e) => setEditForm({ ...editForm, question: e.target.value })}
                                                className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
                                            />
                                        ) : (
                                            <span className="font-medium">{faq.question}</span>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        {editingId === faq.id ? (
                                            <textarea
                                                value={editForm.answer}
                                                onChange={(e) => setEditForm({ ...editForm, answer: e.target.value })}
                                                rows={3}
                                                className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
                                            />
                                        ) : (
                                            <span className="text-gray-400 text-sm">{faq.answer}</span>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex gap-2">
                                            {editingId === faq.id ? (
                                                <>
                                                    <button
                                                        onClick={() => handleUpdate(faq.id)}
                                                        className="text-green-400 hover:text-green-300"
                                                    >
                                                        <Save size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => setEditingId(null)}
                                                        className="text-gray-400 hover:text-gray-300"
                                                    >
                                                        <X size={18} />
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={() => startEdit(faq)}
                                                        className="text-blue-400 hover:text-blue-300"
                                                    >
                                                        <Edit2 size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(faq.id)}
                                                        className="text-red-400 hover:text-red-300"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
