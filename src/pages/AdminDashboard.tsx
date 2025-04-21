import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { BlogEditor } from './BlogEditor';
import { supabase } from '../lib/supabase';
import { PenSquare, LayoutDashboard, Trash2, Edit, Eye, BookOpen } from 'lucide-react';

interface Post {
  id: string;
  title: string;
  category: string;
  created_at: string;
  view_count: number;
  read_count: number;
}

function DashboardHome() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalViews, setTotalViews] = useState(0);
  const [totalReads, setTotalReads] = useState(0);

  useEffect(() => {
    fetchPosts();

    // Set up real-time subscription
    const channel = supabase
      .channel('dashboard_updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'posts',
        },
        () => {
          fetchPosts(); // Refresh posts when any post is updated
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select('id, title, category, created_at, view_count, read_count')
      .order('created_at', { ascending: false });

    if (data) {
      setPosts(data);
      setTotalViews(data.reduce((sum, post) => sum + (post.view_count || 0), 0));
      setTotalReads(data.reduce((sum, post) => sum + (post.read_count || 0), 0));
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this post?');
    if (!confirmed) return;

    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id);

    if (!error) {
      setPosts(posts.filter(post => post.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Quick Stats
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{posts.length}</p>
              <p className="text-slate-600 dark:text-slate-400">Total Posts</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">{totalViews}</p>
              <p className="text-slate-600 dark:text-slate-400">Total Views</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{totalReads}</p>
              <p className="text-slate-600 dark:text-slate-400">Total Reads</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Recent Posts
          </h3>
          {loading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <div key={post.id} className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800">
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-slate-100">{post.title}</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {new Date(post.created_at).toLocaleDateString()} • {post.category}
                    </p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-slate-500 dark:text-slate-400">
                      <span className="flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        {post.view_count || 0}
                      </span>
                      <span className="flex items-center">
                        <BookOpen className="w-4 h-4 mr-1" />
                        {post.read_count || 0}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Link
                      to={`/admin/edit/${post.id}`}
                      className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-700 rounded transition-colors"
                    >
                      <Edit className="w-5 h-5" />
                    </Link>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-slate-700 rounded transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function AdminDashboard() {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            Admin Dashboard
          </h1>
          <Link
            to="/admin/new-post"
            className="btn btn-primary flex items-center space-x-2"
          >
            <PenSquare className="w-5 h-5" />
            <span>New Post</span>
          </Link>
        </div>

        <div className="flex space-x-4 mb-8">
          <Link
            to="/admin"
            className="flex items-center px-4 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <LayoutDashboard className="w-5 h-5 mr-2" />
            Overview
          </Link>
          <Link
            to="/admin/posts"
            className="flex items-center px-4 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <PenSquare className="w-5 h-5 mr-2" />
            All Posts
          </Link>
        </div>

        <Routes>
          <Route path="/" element={<DashboardHome />} />
          <Route path="/new-post" element={<BlogEditor />} />
          <Route path="/edit/:id" element={<BlogEditor />} />
        </Routes>
      </div>
    </Layout>
  );
}