"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DndContext, DragOverlay, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useEditorStore, BlockType } from '@/store/useEditorStore';
import { ArrowLeft, Plus, Save, Monitor, Smartphone, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Component Imports (To be implemented or defined inline for now)
import SidebarItem from "@/components/editor/SidebarItem";
import CanvasBlock from "@/components/editor/CanvasBlock";
import PropertyPanel from "@/components/editor/PropertyPanel";

export default function EditorPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const { blocks, viewMode, activeBlockId, initialize, addBlock, reorderBlocks, setActiveBlock, setViewMode } = useEditorStore();
    const [isSaving, setIsSaving] = useState(false);
    const { id } = params;

    // Initial Load
    useEffect(() => {
        const fetchInvitation = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3401"}/invitations/${id}`, {
                    headers: { "Authorization": localStorage.getItem("authToken") || "" }
                });
                if (res.ok) {
                    const data = await res.json();
                    initialize(data);
                } else {
                    alert("Failed to load invitation");
                    router.push('/invitations/manage');
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchInvitation();
    }, [id, initialize, router]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            // Transform blocks to JSON and save
            // Also sync important meta if needed, but primarily saving content_blocks
            const { meta } = useEditorStore.getState();

            const payload = {
                invitation: {
                    content_blocks: blocks,
                    // Optional: sync title/desc back to columns for SEO/Search if changed in editor
                    title: meta.title,
                    description: meta.description,
                    // location, event_date etc.
                }
            };

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3401"}/invitations/${id}`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": localStorage.getItem("authToken") || ""
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                alert("Invitation saved successfully!");
            } else {
                alert("Failed to save changes.");
            }
        } catch (error) {
            console.error("Save error:", error);
            alert("Error saving invitation.");
        } finally {
            setIsSaving(false);
        }
    };

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        })
    );

    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        if (active.id !== over?.id) {
            reorderBlocks(active.id, over.id);
        }
    };

    return (
        <div className="flex h-screen bg-[#F3F4F6] overflow-hidden font-sans">
            {/* 1. Left Sidebar: Components */}
            <aside className="w-80 bg-white border-r border-gray-200 flex flex-col z-20 shadow-xl">
                <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                    <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="font-bold text-gray-800">Editor</h1>
                    <button
                        onClick={handleSave}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors flex items-center gap-2"
                        disabled={isSaving}
                    >
                        <Save size={14} /> {isSaving ? 'Saving...' : 'Save'}
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-5 space-y-8">
                    <div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Basic Blocks</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <SidebarItem type="hero" icon="🖼️" label="Hero Cover" onClick={() => addBlock('hero')} />
                            <SidebarItem type="text" icon="T" label="Text" onClick={() => addBlock('text')} />
                            <SidebarItem type="image" icon="📷" label="Image" onClick={() => addBlock('image')} />
                            <SidebarItem type="divider" icon="➖" label="Divider" onClick={() => addBlock('divider')} />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Functional</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <SidebarItem type="map" icon="📍" label="Map" onClick={() => addBlock('map')} />
                            <SidebarItem type="schedule" icon="📅" label="Schedule" onClick={() => addBlock('schedule')} />
                            <SidebarItem type="gallery" icon="🎞️" label="Gallery" onClick={() => addBlock('gallery')} />
                            <SidebarItem type="rsvp" icon="✅" label="RSVP" onClick={() => addBlock('rsvp')} />
                        </div>
                    </div>
                </div>
            </aside>

            {/* 2. Center: Canvas (Live Preview) */}
            <main className="flex-1 relative flex flex-col min-w-0">
                {/* Toolbar */}
                <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-center gap-4 px-4 sticky top-0 z-10">
                    <div className="bg-gray-100 p-1 rounded-lg flex items-center">
                        <button
                            onClick={() => setViewMode('mobile')}
                            className={`p-2 rounded-md transition-all ${viewMode === 'mobile' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            <Smartphone size={18} />
                        </button>
                        <button
                            onClick={() => setViewMode('pc')}
                            className={`p-2 rounded-md transition-all ${viewMode === 'pc' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            <Monitor size={18} />
                        </button>
                        <button
                            onClick={() => setViewMode('leaflet')}
                            className={`p-2 rounded-md transition-all ${viewMode === 'leaflet' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            <BookOpen size={18} />
                        </button>
                    </div>
                    <span className="text-xs text-gray-400 font-medium">
                        {viewMode === 'mobile' ? 'Mobile Scroll View' : 'PC Wide Layout'}
                    </span>
                </div>

                {/* Canvas Area */}
                <div
                    className="flex-1 overflow-y-auto p-10 flex justify-center bg-gray-50/50"
                    onClick={() => setActiveBlock(null)} // Click outside to deselect
                >
                    <div
                        className={`transition-all duration-500 ease-in-out bg-white shadow-2xl overflow-hidden relative
                            ${viewMode === 'mobile' ? 'w-[375px] min-h-[800px] rounded-[3rem] border-[10px] border-gray-800' : ''}
                            ${viewMode === 'pc' ? 'w-[1024px] min-h-[600px] rounded-xl border border-gray-200' : ''}
                            ${viewMode === 'leaflet' ? 'w-[1200px] min-h-[500px] rounded-xl border border-gray-200 flex gap-4 bg-transparent shadow-none' : ''}
                        `}
                    >
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={blocks.map(b => b.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                <div className={`flex flex-col min-h-full ${viewMode === 'pc' ? 'pc-layout-grid' : ''}`}>
                                    {blocks.map((block) => (
                                        <CanvasBlock key={block.id} block={block} isActive={activeBlockId === block.id} />
                                    ))}

                                    {blocks.length === 0 && (
                                        <div className="flex-1 flex flex-col items-center justify-center text-gray-300 p-10 border-2 border-dashed border-gray-100 m-4 rounded-xl">
                                            <p>Drag blocks here or click to add</p>
                                        </div>
                                    )}
                                </div>
                            </SortableContext>
                        </DndContext>
                    </div>
                </div>
            </main>

            {/* 3. Right Sidebar: Property Panel */}
            <aside className="w-80 bg-white border-l border-gray-200 flex flex-col z-20 shadow-xl">
                {activeBlockId ? (
                    <PropertyPanel />
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-300 p-10 text-center">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                            <Monitor size={32} className="opacity-20" />
                        </div>
                        <p className="text-sm font-medium">Select a block on the canvas to edit its properties.</p>
                    </div>
                )}
            </aside>
        </div>
    );
}
