"use client"
import React, { useRef, useEffect, useState } from 'react'
import { Bold, Italic, Underline, Strikethrough, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, Code, Eye, Heading1, Heading2, Heading3, Pilcrow as ParagraphIcon, RotateCcw, RotateCw, RemoveFormatting } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  minHeight?: string
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Write content here...',
  minHeight = '320px'
}) => {
  const editorRef = useRef<HTMLDivElement>(null)
  const [showCode, setShowCode] = useState(false)
  const [rawHtml, setRawHtml] = useState(value || '')

  // Sync internal state with initial or external value changes
  useEffect(() => {
    if (editorRef.current && !showCode) {
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value || ''
      }
    }
    setRawHtml(value || '')
  }, [value, showCode])

  const executeCommand = (command: string, val: string | undefined = undefined) => {
    if (showCode) return
    document.execCommand(command, false, val)
    if (editorRef.current) {
      const updated = editorRef.current.innerHTML
      setRawHtml(updated)
      onChange(updated)
    }
  }

  const formatHeading = (tag: 'h1' | 'h2' | 'h3' | 'p') => {
    if (showCode) return
    // Browser execCommand expects tag name without brackets e.g. 'h1' or 'p' or '<H1>'
    try {
      document.execCommand('formatBlock', false, `<${tag.toUpperCase()}>`)
    } catch {
      document.execCommand('formatBlock', false, tag)
    }
    if (editorRef.current) {
      const updated = editorRef.current.innerHTML
      setRawHtml(updated)
      onChange(updated)
    }
  }

  const handleInput = () => {
    if (editorRef.current) {
      const updated = editorRef.current.innerHTML
      setRawHtml(updated)
      onChange(updated)
    }
  }

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const updated = e.target.value
    setRawHtml(updated)
    onChange(updated)
  }

  const toggleCodeView = () => {
    if (!showCode && editorRef.current) {
      setRawHtml(editorRef.current.innerHTML)
    }
    setShowCode((prev) => !prev)
  }

  return (
    <div className="border border-slate-200 rounded-xl bg-white shadow-sm overflow-hidden flex flex-col transition-all focus-within:border-button-color focus-within:ring-2 focus-within:ring-button-color/10">

      {/* Formatting Toolbar */}
      <div className="bg-slate-50/90 border-b border-slate-200 p-2 flex flex-wrap items-center gap-1 select-none">

        {/* Basic Text Formatting */}
        <div className="flex items-center gap-0.5 pr-2 border-r border-slate-200">
          <button
            type="button"
            onClick={() => executeCommand('bold')}
            disabled={showCode}
            className="p-1.5 rounded text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 disabled:opacity-40 transition-colors cursor-pointer"
            title="Bold (Ctrl+B)"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand('italic')}
            disabled={showCode}
            className="p-1.5 rounded text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 disabled:opacity-40 transition-colors cursor-pointer"
            title="Italic (Ctrl+I)"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand('underline')}
            disabled={showCode}
            className="p-1.5 rounded text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 disabled:opacity-40 transition-colors cursor-pointer"
            title="Underline (Ctrl+U)"
          >
            <Underline className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand('strikeThrough')}
            disabled={showCode}
            className="p-1.5 rounded text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 disabled:opacity-40 transition-colors cursor-pointer"
            title="Strikethrough"
          >
            <Strikethrough className="w-4 h-4" />
          </button>
        </div>

        {/* Headings Buttons */}
        <div className="flex items-center gap-1 px-2 border-r border-slate-200">
          <button
            type="button"
            onClick={() => formatHeading('p')}
            disabled={showCode}
            className="p-1.5 rounded text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 disabled:opacity-40 transition-colors cursor-pointer flex items-center gap-1 text-xs font-semibold"
            title="Paragraph"
          >
            <ParagraphIcon className="w-4 h-4" />
            <span className="text-[11px]">P</span>
          </button>
          <button
            type="button"
            onClick={() => formatHeading('h1')}
            disabled={showCode}
            className="p-1.5 rounded text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 disabled:opacity-40 transition-colors cursor-pointer flex items-center gap-0.5 text-xs font-extrabold"
            title="Heading 1 (H1)"
          >
            <Heading1 className="w-4 h-4" />
            <span className="text-[11px]">H1</span>
          </button>
          <button
            type="button"
            onClick={() => formatHeading('h2')}
            disabled={showCode}
            className="p-1.5 rounded text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 disabled:opacity-40 transition-colors cursor-pointer flex items-center gap-0.5 text-xs font-bold"
            title="Heading 2 (H2)"
          >
            <Heading2 className="w-4 h-4" />
            <span className="text-[11px]">H2</span>
          </button>
          <button
            type="button"
            onClick={() => formatHeading('h3')}
            disabled={showCode}
            className="p-1.5 rounded text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 disabled:opacity-40 transition-colors cursor-pointer flex items-center gap-0.5 text-xs font-bold"
            title="Heading 3 (H3)"
          >
            <Heading3 className="w-4 h-4" />
            <span className="text-[11px]">H3</span>
          </button>
        </div>

        {/* Lists */}
        <div className="flex items-center gap-0.5 px-2 border-r border-slate-200">
          <button
            type="button"
            onClick={() => executeCommand('insertUnorderedList')}
            disabled={showCode}
            className="p-1.5 rounded text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 disabled:opacity-40 transition-colors cursor-pointer"
            title="Bullet List"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand('insertOrderedList')}
            disabled={showCode}
            className="p-1.5 rounded text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 disabled:opacity-40 transition-colors cursor-pointer"
            title="Numbered List"
          >
            <ListOrdered className="w-4 h-4" />
          </button>
        </div>

        {/* Alignment */}
        <div className="flex items-center gap-0.5 px-2 border-r border-slate-200">
          <button
            type="button"
            onClick={() => executeCommand('justifyLeft')}
            disabled={showCode}
            className="p-1.5 rounded text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 disabled:opacity-40 transition-colors cursor-pointer"
            title="Align Left"
          >
            <AlignLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand('justifyCenter')}
            disabled={showCode}
            className="p-1.5 rounded text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 disabled:opacity-40 transition-colors cursor-pointer"
            title="Align Center"
          >
            <AlignCenter className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand('justifyRight')}
            disabled={showCode}
            className="p-1.5 rounded text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 disabled:opacity-40 transition-colors cursor-pointer"
            title="Align Right"
          >
            <AlignRight className="w-4 h-4" />
          </button>
        </div>

        {/* Undo / Redo / Clear Formatting */}
        <div className="flex items-center gap-0.5 px-2 border-r border-slate-200">
          <button
            type="button"
            onClick={() => executeCommand('undo')}
            disabled={showCode}
            className="p-1.5 rounded text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 disabled:opacity-40 transition-colors cursor-pointer"
            title="Undo"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand('redo')}
            disabled={showCode}
            className="p-1.5 rounded text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 disabled:opacity-40 transition-colors cursor-pointer"
            title="Redo"
          >
            <RotateCw className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand('removeFormat')}
            disabled={showCode}
            className="p-1.5 rounded text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 disabled:opacity-40 transition-colors cursor-pointer"
            title="Clear Formatting"
          >
            <RemoveFormatting className="w-4 h-4" />
          </button>
        </div>

        {/* Toggle Code / Visual View */}
        <div className="ml-auto flex items-center">
          <button
            type="button"
            onClick={toggleCodeView}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold transition-colors cursor-pointer",
              showCode
                ? "bg-slate-800 text-white"
                : "bg-slate-200/70 text-slate-700 hover:bg-slate-300/70"
            )}
            title={showCode ? "Switch to Visual Editor" : "View Source HTML Code"}
          >
            {showCode ? <Eye className="w-3.5 h-3.5" /> : <Code className="w-3.5 h-3.5" />}
            {showCode ? "Visual Mode" : "HTML Source"}
          </button>
        </div>

      </div>

      {/* Editor Body Area */}
      {showCode ? (
        <textarea
          value={rawHtml}
          onChange={handleCodeChange}
          style={{ minHeight }}
          className="w-full p-4 font-mono text-xs text-slate-800 bg-slate-900/5 focus:outline-none resize-y leading-relaxed"
          placeholder="Paste or write raw HTML content..."
        />
      ) : (
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          onBlur={handleInput}
          style={{ minHeight }}
          className={cn(
            "p-4 text-sm text-slate-800 focus:outline-none overflow-y-auto leading-relaxed max-w-none",
            "[&_h1]:text-2xl [&_h1]:font-extrabold [&_h1]:text-slate-900 [&_h1]:my-3 [&_h1]:block",
            "[&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-slate-900 [&_h2]:my-2.5 [&_h2]:block",
            "[&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-slate-900 [&_h3]:my-2 [&_h3]:block",
            "[&_p]:my-2 [&_p]:leading-relaxed",
            "[&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-2",
            "[&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-2",
            "[&_li]:my-1"
          )}
        />
      )}

    </div>
  )
}

export default RichTextEditor
