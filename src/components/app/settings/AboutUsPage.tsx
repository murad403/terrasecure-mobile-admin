"use client"
import React, { useState } from 'react'
import { Pencil, Trash2, Save, Plus } from 'lucide-react'

interface AboutSection {
    id: string
    title: string
    content: string
}

const initialSections: AboutSection[] = [
    {
        id: '1',
        title: 'Our Mission',
        content: 'To become the leading digital land governance platform in Central Africa, ensuring every citizen has clear, verified, and protected land rights.',
    },
    {
        id: '2',
        title: 'Our Vision',
        content: 'To become the leading digital land governance platform in Central Africa, ensuring every citizen has clear, verified, and protected land rights.',
    },
    {
        id: '3',
        title: 'Contact',
        content: 'Ministry of Land Affairs, Yaounde, Cameroon Email: support@landsecure.cm Phone: +237 222 123 456',
    },
]

const AboutUsPage = () => {
    const [sections, setSections] = useState<AboutSection[]>(initialSections)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editContent, setEditContent] = useState<string>('')

    // New section inputs
    const [showNewForm, setShowNewForm] = useState<boolean>(false)
    const [newTitle, setNewTitle] = useState<string>('')
    const [newContent, setNewContent] = useState<string>('')

    const [toastMessage, setToastMessage] = useState<string | null>(null)

    const showToast = (msg: string) => {
        setToastMessage(msg)
        setTimeout(() => {
            setToastMessage(null)
        }, 3000)
    }

    const startEditing = (section: AboutSection) => {
        setEditingId(section.id)
        setEditContent(section.content)
    }

    const handleSave = (id: string) => {
        if (!editContent.trim()) {
            showToast('Content cannot be empty!')
            return
        }
        setSections(prev =>
            prev.map(sec => (sec.id === id ? { ...sec, content: editContent } : sec))
        )
        setEditingId(null)
        setEditContent('')
        showToast('Section updated successfully!')
    }

    const handleCancelEdit = () => {
        setEditingId(null)
        setEditContent('')
    }

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this section?')) {
            setSections(prev => prev.filter(sec => sec.id !== id))
            showToast('Section deleted successfully!')
        }
    }

    const handleAddSection = () => {
        if (!newTitle.trim() || !newContent.trim()) {
            showToast('Please fill out both the title and content!')
            return
        }
        const newSec: AboutSection = {
            id: Date.now().toString(),
            title: newTitle.trim(),
            content: newContent.trim(),
        }
        setSections(prev => [...prev, newSec])
        setNewTitle('')
        setNewContent('')
        setShowNewForm(false)
        showToast('New section added successfully!')
    }

    return (
        <div className="space-y-6 relative">
            {/* Toast Notification */}
            {toastMessage && (
                <div className="fixed top-4 right-4 bg-gray-900 text-white text-xs px-4 py-2.5 rounded-lg shadow-md z-50 animate-bounce">
                    {toastMessage}
                </div>
            )}

            {/* Header Row */}
            <div className="flex items-center justify-between pb-1">
                <h2 className="text-sm font-bold text-gray-900">About Us</h2>
                <button
                    onClick={() => setShowNewForm(true)}
                    className="bg-button-color hover:bg-[#3574dd] text-white text-xs font-semibold px-3.5 py-2 rounded-lg flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                >
                    <Plus size={14} />
                    Add Section
                </button>
            </div>

            {/* List of Sections */}
            <div className="space-y-5">
                {sections.map(section => (
                    <div key={section.id}>
                        {editingId === section.id ? (
                            // Edit Mode Card
                            <div className="bg-white rounded-xl border border-gray-150 p-5 shadow-sm space-y-4">
                                <h3 className="text-xs md:text-sm font-bold text-slate-800">
                                    {section.title}
                                </h3>
                                <textarea
                                    value={editContent}
                                    onChange={e => setEditContent(e.target.value)}
                                    className="w-full min-h-[100px] bg-slate-50/20 border border-slate-200 rounded-lg px-4 py-3 text-xs md:text-sm text-slate-750 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/10 transition-colors leading-relaxed font-normal resize-y"
                                    placeholder="Edit section content..."
                                />
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => handleSave(section.id)}
                                        className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                                    >
                                        <Save size={13} className="shrink-0" />
                                        Save
                                    </button>
                                    <button
                                        onClick={handleCancelEdit}
                                        className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            // Display Mode Card
                            <div className="bg-white rounded-xl border border-gray-150 p-5 shadow-sm hover:border-gray-200 transition-colors relative">
                                <div className="flex items-start justify-between">
                                    <h3 className="text-xs md:text-sm font-bold text-slate-800">
                                        {section.title}
                                    </h3>
                                    <div className="flex items-center space-x-1">
                                        <button
                                            onClick={() => startEditing(section)}
                                            className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 p-1.5 rounded-lg transition-colors cursor-pointer"
                                            title="Edit Section"
                                        >
                                            <Pencil size={14} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(section.id)}
                                            className="text-red-500 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition-colors cursor-pointer"
                                            title="Delete Section"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                                <p className="text-xs md:text-sm text-slate-500 font-normal leading-relaxed mt-3.5 whitespace-pre-line">
                                    {section.content}
                                </p>
                            </div>
                        )}
                    </div>
                ))}

                {/* New Section Card */}
                {showNewForm && (
                    <div className="bg-white rounded-xl border border-emerald-500/30 p-5 shadow-sm space-y-4">
                        <h3 className="text-xs md:text-sm font-bold text-slate-800">
                            New Section
                        </h3>
                        <div className="space-y-3">
                            <input
                                type="text"
                                placeholder="Section title"
                                value={newTitle}
                                onChange={e => setNewTitle(e.target.value)}
                                className="w-full bg-slate-50/20 border border-slate-200 rounded-lg px-4 py-2.5 text-xs md:text-sm text-slate-750 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/10 transition-colors placeholder:text-slate-400 font-semibold"
                            />
                            <textarea
                                placeholder="Section content..."
                                value={newContent}
                                onChange={e => setNewContent(e.target.value)}
                                className="w-full min-h-[100px] bg-slate-50/20 border border-slate-200 rounded-lg px-4 py-3 text-xs md:text-sm text-slate-750 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/10 transition-colors placeholder:text-slate-400 font-normal resize-y"
                            />
                        </div>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={handleAddSection}
                                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                            >
                                <Plus size={14} className="shrink-0" />
                                Add
                            </button>
                            <button
                                onClick={() => {
                                    setShowNewForm(false)
                                    setNewTitle('')
                                    setNewContent('')
                                }}
                                className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AboutUsPage