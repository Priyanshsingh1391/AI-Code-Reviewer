import React, { useState } from 'react';
import { Sparkles, Code2, Upload, Send, Copy, CheckCircle2, AlertCircle, Zap, Brain, Shield, Settings } from 'lucide-react';

export default function PSCodeReviewer() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
 

  const [error, setError] = useState('');


  const apiKey = import.meta.env.VITE_GEMINI_API 
  const handleReview = async () => {
    if (!code.trim()) {
      setError('Please enter some code to review');
      return;
    }

  
    
    setLoading(true);
    setReview(null);
    setError('');
    
    try {
      const prompt = `You are an expert code reviewer. Analyze the following ${language} code and provide a detailed review in JSON format.

Code to review:
\`\`\`${language}
${code}
\`\`\`

Provide your response in this exact JSON format:
{
  "summary": "A brief 1-2 sentence summary of the overall code quality",
  "score": 7.5,
  "issues": [
    {
      "severity": "high|medium|low",
      "message": "Description of the issue",
      "line": 0
    }
  ],
  "suggestions": [
    "Specific actionable suggestion 1",
    "Specific actionable suggestion 2"
  ]
}

Focus on:
- Security vulnerabilities
- Performance issues
- Code smells and anti-patterns
- Best practices
- Potential bugs
- Code readability and maintainability

Respond ONLY with valid JSON, no markdown formatting or explanations.`;

     const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: prompt
        }]
      }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
        responseMimeType: "application/json"
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to get review from Gemini API');
      }

      const data = await response.json();
      const reviewText = data.candidates[0].content.parts[0].text;
      
      // Clean the response - remove markdown code blocks if present
      let cleanedText = reviewText.trim();
      if (cleanedText.startsWith('```json')) {
        cleanedText = cleanedText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      } else if (cleanedText.startsWith('```')) {
        cleanedText = cleanedText.replace(/```\n?/g, '');
      }
      
      const reviewData = JSON.parse(cleanedText);
      setReview(reviewData);
      setLoading(false);
    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'Failed to review code. Please check your API key and try again.');
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>

     
      {/* Header */}
      <header className="relative border-b border-purple-500/20 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg blur-lg opacity-50"></div>
                <div className="relative bg-gradient-to-r from-purple-600 to-blue-600 p-2 rounded-lg">
                  <Code2 className="w-8 h-8" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                  PS-Code
                </h1>
                <p className="text-sm text-purple-300/70">AI-Powered Code Review</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              
              <div className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-full">
                <Brain className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-purple-300">Gemini AI</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto px-6 py-12">
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
            <p className="text-red-300">{error}</p>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Code Input Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-purple-400" />
                Your Code
              </h2>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-lg text-purple-300 focus:outline-none focus:border-purple-500/50 transition-colors"
              >
                <option value="javascript">JavaScript</option>
                <option value="typescript">TypeScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
                <option value="rust">Rust</option>
                <option value="go">Go</option>
              </select>
            </div>

            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl opacity-20 group-hover:opacity-30 transition-opacity blur"></div>
              <div className="relative bg-slate-900/80 backdrop-blur-xl border border-purple-500/20 rounded-2xl overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-purple-500/20">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                  </div>
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-2 px-3 py-1 text-sm text-purple-300 hover:text-purple-200 transition-colors"
                  >
                    {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="// Paste your code here for AI review...
// PS-Code will analyze for bugs, security issues, and best practices

function example() {
  // Your code here
}"
                  className="w-full h-96 p-4 bg-transparent text-purple-100 placeholder-purple-500/30 font-mono text-sm focus:outline-none resize-none"
                  spellCheck="false"
                />
              </div>
            </div>

            <button
              onClick={handleReview}
              disabled={loading || !code.trim()}
              className="w-full group relative overflow-hidden px-6 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-semibold text-lg transition-all hover:shadow-lg hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-400 opacity-0 group-hover:opacity-20 transition-opacity"></div>
              <div className="relative flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <Zap className="w-5 h-5 animate-pulse" />
                    Analyzing Code...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Review Code with AI
                  </>
                )}
              </div>
            </button>
          </div>

          {/* Review Results Section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Shield className="w-6 h-6 text-blue-400" />
              AI Review
            </h2>

            {!review && !loading && (
              <div className="h-96 flex items-center justify-center bg-slate-900/40 backdrop-blur-xl border border-purple-500/20 rounded-2xl">
                <div className="text-center space-y-4 px-6">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full flex items-center justify-center">
                    <Brain className="w-8 h-8 text-purple-400" />
                  </div>
                  <p className="text-purple-300/70">Paste your code and click review to get AI-powered insights</p>
                </div>
              </div>
            )}

            {loading && (
              <div className="h-96 flex items-center justify-center bg-slate-900/40 backdrop-blur-xl border border-purple-500/20 rounded-2xl">
                <div className="text-center space-y-4">
                  <div className="relative w-16 h-16 mx-auto">
                    <div className="absolute inset-0 border-4 border-purple-500/30 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-transparent border-t-purple-500 rounded-full animate-spin"></div>
                  </div>
                  <p className="text-purple-300">Analyzing your code...</p>
                </div>
              </div>
            )}

            {review && (
              <div className="space-y-4">
                {/* Score Card */}
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl opacity-20 blur"></div>
                  <div className="relative bg-slate-900/80 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-purple-300/70 mb-1">Code Quality Score</p>
                        <p className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                          {review.score}/10
                        </p>
                      </div>
                      <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                        <Sparkles className="w-10 h-10 text-purple-400" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Summary */}
                <div className="bg-slate-900/40 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-purple-300 mb-3">Summary</h3>
                  <p className="text-purple-100/80">{review.summary}</p>
                </div>

                {/* Issues */}
                {review.issues && review.issues.length > 0 && (
                  <div className="bg-slate-900/40 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-purple-300 mb-3">Issues Found</h3>
                    <div className="space-y-3">
                      {review.issues.map((issue, idx) => (
                        <div
                          key={idx}
                          className={`flex items-start gap-3 p-3 rounded-lg ${
                            issue.severity === 'high'
                              ? 'bg-red-500/10 border border-red-500/30'
                              : issue.severity === 'medium'
                              ? 'bg-yellow-500/10 border border-yellow-500/30'
                              : 'bg-blue-500/10 border border-blue-500/30'
                          }`}
                        >
                          <AlertCircle
                            className={`w-5 h-5 mt-0.5 ${
                              issue.severity === 'high'
                                ? 'text-red-400'
                                : issue.severity === 'medium'
                                ? 'text-yellow-400'
                                : 'text-blue-400'
                            }`}
                          />
                          <div className="flex-1">
                            <p className="text-sm text-purple-100">{issue.message}</p>
                            {issue.line > 0 && (
                              <p className="text-xs text-purple-300/50 mt-1">Line {issue.line}</p>
                            )}
                          </div>
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              issue.severity === 'high'
                                ? 'bg-red-500/20 text-red-300'
                                : issue.severity === 'medium'
                                ? 'bg-yellow-500/20 text-yellow-300'
                                : 'bg-blue-500/20 text-blue-300'
                            }`}
                          >
                            {issue.severity}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Suggestions */}
                {review.suggestions && review.suggestions.length > 0 && (
                  <div className="bg-slate-900/40 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-purple-300 mb-3">Suggestions</h3>
                    <ul className="space-y-2">
                      {review.suggestions.map((suggestion, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-purple-100/80">
                          <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                          <span>{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative border-t border-purple-500/20 backdrop-blur-xl mt-20">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center text-purple-300/50 text-sm">
            <p>Powered by Gemini AI • PS-Code © 2025</p>
          </div>
        </div>
      </footer>
    </div>
  );
}