'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { useEffect } from 'react';
import { Bold, Italic, List, ListOrdered, Heading2, Heading3, Link as LinkIcon, Undo, Redo, Quote } from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

const btn = 'p-2 rounded hover:bg-accent text-foreground/80 hover:text-foreground transition-colors';
const active = 'bg-accent text-foreground';

const RichTextEditor = ({ value, onChange }: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Link.configure({ openOnClick: false, HTMLAttributes: { class: 'text-primary underline' } }),
    ],
    content: value || '',
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none min-h-[240px] p-4 focus:outline-none',
      },
    },
  });

  // Sync external value changes (e.g. when loading an existing record)
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '', false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, editor]);

  if (!editor) return null;

  const setLink = () => {
    const prev = editor.getAttributes('link').href;
    const url = window.prompt('Link URL', prev || 'https://');
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  return (
    <div className="border rounded-md bg-background">
      <div className="flex flex-wrap items-center gap-1 border-b p-1">
        <button type="button" className={`${btn} ${editor.isActive('bold') ? active : ''}`} onClick={() => editor.chain().focus().toggleBold().run()} title="Bold"><Bold className="h-4 w-4" /></button>
        <button type="button" className={`${btn} ${editor.isActive('italic') ? active : ''}`} onClick={() => editor.chain().focus().toggleItalic().run()} title="Italic"><Italic className="h-4 w-4" /></button>
        <span className="w-px h-5 bg-border mx-1" />
        <button type="button" className={`${btn} ${editor.isActive('heading', { level: 2 }) ? active : ''}`} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} title="Heading 2"><Heading2 className="h-4 w-4" /></button>
        <button type="button" className={`${btn} ${editor.isActive('heading', { level: 3 }) ? active : ''}`} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} title="Heading 3"><Heading3 className="h-4 w-4" /></button>
        <span className="w-px h-5 bg-border mx-1" />
        <button type="button" className={`${btn} ${editor.isActive('bulletList') ? active : ''}`} onClick={() => editor.chain().focus().toggleBulletList().run()} title="Bullet list"><List className="h-4 w-4" /></button>
        <button type="button" className={`${btn} ${editor.isActive('orderedList') ? active : ''}`} onClick={() => editor.chain().focus().toggleOrderedList().run()} title="Numbered list"><ListOrdered className="h-4 w-4" /></button>
        <button type="button" className={`${btn} ${editor.isActive('blockquote') ? active : ''}`} onClick={() => editor.chain().focus().toggleBlockquote().run()} title="Quote"><Quote className="h-4 w-4" /></button>
        <button type="button" className={`${btn} ${editor.isActive('link') ? active : ''}`} onClick={setLink} title="Link"><LinkIcon className="h-4 w-4" /></button>
        <span className="w-px h-5 bg-border mx-1" />
        <button type="button" className={btn} onClick={() => editor.chain().focus().undo().run()} title="Undo"><Undo className="h-4 w-4" /></button>
        <button type="button" className={btn} onClick={() => editor.chain().focus().redo().run()} title="Redo"><Redo className="h-4 w-4" /></button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
};

export default RichTextEditor;
