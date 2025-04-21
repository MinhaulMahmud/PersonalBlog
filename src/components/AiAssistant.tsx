import React, { useState } from 'react';
import { Wand2, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AiAssistantProps {
  content: string;
  onSeoUpdate?: (seoData: any) => void;
}

export function AiAssistant({ content, onSeoUpdate }: AiAssistantProps) {
  const [summary, setSummary] = useState('');
  const [seoData, setSeoData] = useState<any>(null);
  const [loading, setLoading] = useState<'summary' | 'seo' | null>(null);
  const [error, setError] = useState('');
  const [showSummaryWarning, setShowSummaryWarning] = useState(false);

  const callAiFunction = async (type: 'summarize' | 'seo') => {
    if (type === 'summarize') {
      setShowSummaryWarning(true);
      return;
    }

    setLoading(type);
    setError('');

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-assistant`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ content, type }),
        }
      );

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      if (type === 'summarize') {
        setSummary(data.result);
      } else {
        const parsedSeoData = JSON.parse(data.result);
        setSeoData(parsedSeoData);
        if (onSeoUpdate) {
          onSeoUpdate(parsedSeoData);
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(null);
    }
  };

  const handleGenerateSummary = async () => {
    setShowSummaryWarning(false);
    await callAiFunction('summarize');
  };

  return (
    <div className="space-y-4 mt-6">
      <div className="flex gap-4">
        <button
          onClick={() => callAiFunction('summarize')}
          disabled={loading !== null}
          className="btn btn-primary flex items-center gap-2"
        >
          {loading === 'summary' ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Wand2 className="w-4 h-4" />
          )}
          Generate Summary
        </button>
        <button
          onClick={() => callAiFunction('seo')}
          disabled={loading !== null}
          className="btn btn-primary flex items-center gap-2"
        >
          {loading === 'seo' ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Wand2 className="w-4 h-4" />
          )}
          SEO Suggestions
        </button>
      </div>

      {showSummaryWarning && (
        <div className="bg-amber-50 dark:bg-amber-900/30 p-4 rounded-lg flex items-start gap-3">
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
        <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-lg">
          {error}
        </div>
      )}

      {summary && (
        <div className="bg-sky-50 dark:bg-sky-900/30 p-4 rounded-lg">
          <h3 className="font-semibold text-sky-900 dark:text-sky-100 mb-2">AI Summary</h3>
          <p className="text-sky-800 dark:text-sky-200">{summary}</p>
        </div>
      )}

      {seoData && (
        <div className="bg-sky-50 dark:bg-sky-900/30 p-4 rounded-lg">
          <h3 className="font-semibold text-sky-900 dark:text-sky-100 mb-2">SEO Suggestions</h3>
          <div className="space-y-2">
            <div>
              <span className="font-medium text-sky-800 dark:text-sky-200">Suggested Title:</span>
              <p className="text-sky-700 dark:text-sky-300">{seoData.suggestedTitle}</p>
            </div>
            <div>
              <span className="font-medium text-sky-800 dark:text-sky-200">Meta Description:</span>
              <p className="text-sky-700 dark:text-sky-300">{seoData.metaDescription}</p>
            </div>
            <div>
              <span className="font-medium text-sky-800 dark:text-sky-200">Keywords:</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {seoData.keywords.map((keyword: string, index: number) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-sky-100 dark:bg-sky-800 text-sky-700 dark:text-sky-300 rounded-full text-sm"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}