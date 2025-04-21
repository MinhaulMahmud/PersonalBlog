import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { Clock, Calendar, Share2, Eye, BookOpen, Wand2, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  category: string;
  created_at: string;
  read_time: number;
  image_url: string;
  view_count: number;
  read_count: number;
}

export function BlogPost() {
  const { id } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasRecordedView, setHasRecordedView] = useState(false);
  const [hasRecordedRead, setHasRecordedRead] = useState(false);
  const [showSummaryWarning, setShowSummaryWarning] = useState(false);
  const [summary, setSummary] = useState('');
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPost();
    
    const channel = supabase
      .channel('post_updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'posts',
          filter: `id=eq.${id}`,
        },
        (payload) => {
          setPost((currentPost) => {
            if (!currentPost) return null;
            return {
              ...currentPost,
              view_count: payload.new.view_count,
              read_count: payload.new.read_count,
            };
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);

  useEffect(() => {
    if (post?.id && !hasRecordedView) {
      recordView();
      setHasRecordedView(true);
    }
  }, [post?.id, hasRecordedView]);

  useEffect(() => {
    const handleScroll = () => {
      if (hasRecordedRead) return;

      const bottom = Math.ceil(window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight;
      if (bottom && post?.id) {
        recordRead();
        setHasRecordedRead(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [post?.id, hasRecordedRead]);

  const fetchPost = async () => {
    if (!id) return;

    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .single();

    if (data) {
      setPost(data);
    }
    setLoading(false);
  };

  const recordView = async () => {
    if (!id) return;
    await supabase.rpc('increment_view_count', { post_id: id });
  };

  const recordRead = async () => {
    if (!id) return;
    await supabase.rpc('increment_read_count', { post_id: id });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post?.title,
          url: window.location.href,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleGenerateSummary = async () => {
    if (!post) return;
    
    if (!showSummaryWarning) {
      setShowSummaryWarning(true);
      return;
    }

    setSummaryLoading(true);
    setError('');
    setShowSummaryWarning(false);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-assistant`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            content: post.content,
            type: 'summarize'
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to generate summary');
      }

      const data = await response.json();
      if (data.error) throw new Error(data.error);
      
      setSummary(data.result);
    } catch (err: any) {
      setError(err.message || 'Failed to generate summary');
    } finally {
      setSummaryLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
        </div>
      </Layout>
    );
  }

  if (!post) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-slate-900">Post not found</h1>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <article className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <span className="inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-medium mb-4">
            {post.category}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-blue-700 mb-6">
            {post.title}
          </h1>
          <div className="flex items-center justify-between border-y border-slate-200 py-4">
            <div className="flex items-center space-x-4 text-slate-600">
              <span className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                {new Date(post.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
              <span className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                {post.read_time} min read
              </span>
              <span className="flex items-center">
                <Eye className="w-4 h-4 mr-2" />
                {post.view_count} views
              </span>
              <span className="flex items-center">
                <BookOpen className="w-4 h-4 mr-2" />
                {post.read_count} reads
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleGenerateSummary}
                disabled={summaryLoading}
                className="flex items-center space-x-2 text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {summaryLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Wand2 className="w-5 h-5" />
                )}
                <span>{summaryLoading ? 'Generating...' : 'AI Summary'}</span>
              </button>
              <button
                onClick={handleShare}
                className="p-2 text-slate-600 hover:text-blue-600 transition-colors"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {showSummaryWarning && (
          <div className="bg-amber-50 dark:bg-amber-900/30 p-4 rounded-lg mb-8 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-1" />
            <div className="space-y-2">
              <p className="text-amber-800 dark:text-amber-200">
                ⚠️ Please note that AI-generated summaries should not replace reading the full article. They are meant to provide a quick overview but may miss important nuances and context.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleGenerateSummary}
                  className="text-sm font-medium text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300"
                >
                  I understand, generate summary
                </button>
                <button
                  onClick={() => setShowSummaryWarning(false)}
                  className="text-sm font-medium text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-lg mb-8">
            {error}
          </div>
        )}

        {summaryLoading && (
          <div className="bg-sky-50 dark:bg-sky-900/30 p-4 rounded-lg mb-8 flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-sky-600 dark:text-sky-400" />
            <span className="ml-2 text-sky-800 dark:text-sky-200">Generating summary...</span>
          </div>
        )}

        {summary && !summaryLoading && (
          <div className="bg-sky-50 dark:bg-sky-900/30 p-4 rounded-lg mb-8">
            <h3 className="font-semibold text-sky-900 dark:text-sky-100 mb-2">AI Summary</h3>
            <p className="text-sky-800 dark:text-sky-200">{summary}</p>
          </div>
        )}

        <div 
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>
    </Layout>
  );
}