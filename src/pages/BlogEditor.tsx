import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { useDropzone } from 'react-dropzone';
import { v4 as uuidv4 } from 'uuid';
import { 
  Bold, Italic, List, ListOrdered, Quote, Undo, Redo, 
  Image as ImageIcon, Link as LinkIcon, Heading1, Heading2,
  ImagePlus, X, Upload
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { AiAssistant } from '../components/AiAssistant';

interface EditorMenuBarProps {
  editor: any;
}

interface ImageModalProps {
  onClose: () => void;
  onInsert: (url: string) => void;
}

const ImageModal = ({ onClose, onInsert }: ImageModalProps) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    setUploading(true);
    setError(null);

    try {
      const file = acceptedFiles[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload file to Supabase Storage
      const { error: uploadError, data } = await supabase.storage
        .from('blog-assets')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('blog-assets')
        .getPublicUrl(filePath);

      onInsert(publicUrl);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to upload image');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  }, [onInsert, onClose]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    },
    maxFiles: 1,
    multiple: false
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-sky-900 dark:text-sky-100">Upload Image</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
            ${isDragActive 
              ? 'border-sky-500 bg-sky-50 dark:bg-sky-900/20' 
              : 'border-slate-300 dark:border-slate-600 hover:border-sky-400 dark:hover:border-sky-500'
            }`}
        >
          <input {...getInputProps()} />
          <Upload className="w-12 h-12 mx-auto mb-4 text-sky-500" />
          {uploading ? (
            <p className="text-slate-600 dark:text-slate-300">Uploading...</p>
          ) : (
            <div>
              <p className="text-slate-600 dark:text-slate-300">
                Drag & drop an image here, or click to select
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                Supports: PNG, JPG, GIF, WEBP
              </p>
            </div>
          )}
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg">
            {error}
          </div>
        )}

        <div className="flex justify-end mt-4">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const EditorMenuBar = ({ editor }: EditorMenuBarProps) => {
  const [showImageModal, setShowImageModal] = useState(false);

  if (!editor) {
    return null;
  }

  const addImage = (url: string) => {
    editor.chain().focus().setImage({ src: url }).run();
  };

  const setLink = (e: React.MouseEvent) => {
    e.preventDefault();
    const url = window.prompt('Enter URL');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const handleButtonClick = (e: React.MouseEvent, callback: () => void) => {
    e.preventDefault();
    callback();
  };

  return (
    <>
      <div className="flex flex-wrap gap-2 p-2 bg-cream-50 dark:bg-slate-800 border border-sky-100 dark:border-sky-700 rounded-lg mb-4">
        <button
          onMouseDown={(e) => handleButtonClick(e, () => editor.chain().focus().toggleBold().run())}
          className={`p-2 rounded ${editor.isActive('bold') ? 'bg-sky-100 text-sky-600' : 'text-sky-600 hover:bg-sky-50'}`}
          type="button"
        >
          <Bold className="w-5 h-5" />
        </button>
        <button
          onMouseDown={(e) => handleButtonClick(e, () => editor.chain().focus().toggleItalic().run())}
          className={`p-2 rounded ${editor.isActive('italic') ? 'bg-sky-100 text-sky-600' : 'text-sky-600 hover:bg-sky-50'}`}
          type="button"
        >
          <Italic className="w-5 h-5" />
        </button>
        <button
          onMouseDown={(e) => handleButtonClick(e, () => editor.chain().focus().toggleHeading({ level: 1 }).run())}
          className={`p-2 rounded ${editor.isActive('heading', { level: 1 }) ? 'bg-sky-100 text-sky-600' : 'text-sky-600 hover:bg-sky-50'}`}
          type="button"
        >
          <Heading1 className="w-5 h-5" />
        </button>
        <button
          onMouseDown={(e) => handleButtonClick(e, () => editor.chain().focus().toggleHeading({ level: 2 }).run())}
          className={`p-2 rounded ${editor.isActive('heading', { level: 2 }) ? 'bg-sky-100 text-sky-600' : 'text-sky-600 hover:bg-sky-50'}`}
          type="button"
        >
          <Heading2 className="w-5 h-5" />
        </button>
        <button
          onMouseDown={(e) => handleButtonClick(e, () => editor.chain().focus().toggleBulletList().run())}
          className={`p-2 rounded ${editor.isActive('bulletList') ? 'bg-sky-100 text-sky-600' : 'text-sky-600 hover:bg-sky-50'}`}
          type="button"
        >
          <List className="w-5 h-5" />
        </button>
        <button
          onMouseDown={(e) => handleButtonClick(e, () => editor.chain().focus().toggleOrderedList().run())}
          className={`p-2 rounded ${editor.isActive('orderedList') ? 'bg-sky-100 text-sky-600' : 'text-sky-600 hover:bg-sky-50'}`}
          type="button"
        >
          <ListOrdered className="w-5 h-5" />
        </button>
        <button
          onMouseDown={(e) => handleButtonClick(e, () => editor.chain().focus().toggleBlockquote().run())}
          className={`p-2 rounded ${editor.isActive('blockquote') ? 'bg-sky-100 text-sky-600' : 'text-sky-600 hover:bg-sky-50'}`}
          type="button"
        >
          <Quote className="w-5 h-5" />
        </button>
        <button
          onClick={() => setShowImageModal(true)}
          className="p-2 rounded text-sky-600 hover:bg-sky-50"
          type="button"
        >
          <ImagePlus className="w-5 h-5" />
        </button>
        <button
          onMouseDown={setLink}
          className={`p-2 rounded ${editor.isActive('link') ? 'bg-sky-100 text-sky-600' : 'text-sky-600 hover:bg-sky-50'}`}
          type="button"
        >
          <LinkIcon className="w-5 h-5" />
        </button>
        <button
          onMouseDown={(e) => handleButtonClick(e, () => editor.chain().focus().undo().run())}
          className="p-2 rounded text-sky-600 hover:bg-sky-50"
          type="button"
        >
          <Undo className="w-5 h-5" />
        </button>
        <button
          onMouseDown={(e) => handleButtonClick(e, () => editor.chain().focus().redo().run())}
          className="p-2 rounded text-sky-600 hover:bg-sky-50"
          type="button"
        >
          <Redo className="w-5 h-5" />
        </button>
      </div>
      {showImageModal && (
        <ImageModal
          onClose={() => setShowImageModal(false)}
          onInsert={addImage}
        />
      )}
    </>
  );
};

export function BlogEditor() {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [readTime, setReadTime] = useState(5);
  const [loading, setLoading] = useState(false);
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [seoKeywords, setSeoKeywords] = useState<string[]>([]);
  const navigate = useNavigate();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2],
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-lg max-w-full h-auto my-4',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300',
        },
      }),
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert max-w-none min-h-[300px] focus:outline-none p-4',
      },
    },
  });

  useEffect(() => {
    if (id) {
      fetchPost();
    }
  }, [id]);

  const fetchPost = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .single();

    if (data) {
      setTitle(data.title);
      setCategory(data.category);
      setImageUrl(data.image_url);
      setReadTime(data.read_time);
      editor?.commands.setContent(data.content);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('User not authenticated');

      const postData = {
        title,
        content: editor?.getHTML() || '',
        category,
        image_url: imageUrl,
        read_time: readTime,
        user_id: user.id,
      };

      let error;
      if (id) {
        ({ error } = await supabase.from('posts').update(postData).eq('id', id));
      } else {
        ({ error } = await supabase.from('posts').insert(postData));
      }

      if (error) throw error;

      navigate('/admin');
    } catch (error) {
      console.error('Error saving post:', error);
      alert('Failed to save post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSeoUpdate = (seoData: any) => {
    setSeoTitle(seoData.suggestedTitle);
    setSeoDescription(seoData.metaDescription);
    setSeoKeywords(seoData.keywords);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card p-6 space-y-6 bg-cream-50 dark:bg-slate-800">
          <div>
            <label htmlFor="title" className="label">Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input"
              required
            />
          </div>

          <div>
            <label htmlFor="category" className="label">Category</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="select"
              required
            >
              <option value="">Select a category</option>
              <option value="Machine Learning">Machine Learning</option>
              <option value="Robotics">Robotics</option>
              <option value="Artificial Intelligence">Artificial Intelligence</option>
            </select>
          </div>

          <div>
            <label htmlFor="imageUrl" className="label">Cover Image URL</label>
            <input
              type="url"
              id="imageUrl"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="input"
              placeholder="https://example.com/image.jpg"
              required
            />
          </div>

          <div>
            <label htmlFor="readTime" className="label">Read Time (minutes)</label>
            <input
              type="number"
              id="readTime"
              value={readTime}
              onChange={(e) => setReadTime(parseInt(e.target.value))}
              className="input"
              min="1"
              required
            />
          </div>
        </div>

        <div className="card p-6 bg-cream-50 dark:bg-slate-800">
          <div className="mb-4">
            <label className="label">Content</label>
          </div>
          <EditorMenuBar editor={editor} />
          <div className="border border-sky-100 dark:border-sky-800 rounded-lg bg-white dark:bg-slate-900">
            <EditorContent editor={editor} />
          </div>
          
          {editor && (
            <AiAssistant 
              content={editor.getHTML()} 
              onSeoUpdate={handleSeoUpdate}
            />
          )}
        </div>

        {seoTitle && (
          <div className="card p-6 bg-cream-50 dark:bg-slate-800">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
              SEO Optimized Fields
            </h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="seoTitle" className="label">SEO Title</label>
                <input
                  type="text"
                  id="seoTitle"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  className="input"
                />
              </div>
              <div>
                <label htmlFor="seoDescription" className="label">Meta Description</label>
                <textarea
                  id="seoDescription"
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  className="input h-24"
                />
              </div>
              <div>
                <label className="label">Keywords</label>
                <div className="flex flex-wrap gap-2">
                  {seoKeywords.map((keyword, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-sky-100 dark:bg-sky-800 text-sky-700 dark:text-sky-300 rounded-full text-sm"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
          >
            {loading ? 'Saving...' : (id ? 'Update Post' : 'Publish Post')}
          </button>
        </div>
      </form>
    </div>
  );
}