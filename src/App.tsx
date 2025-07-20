import React, { useState, useEffect, useRef } from 'react';
import { Moon, Sun, Send, CheckCircle, AlertCircle, Building2 } from 'lucide-react';

interface FormData {
  OrderNumber: string;
  Status: 'Tracked' | 'Untracked' | '';
  Link: string;
  Store: 'slidezz' | 'TT' | 'a2k' | '';
  Action: string;
}

function App() {
  const [isDark, setIsDark] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState<FormData>({
    OrderNumber: '',
    Status: '',
    Link: '',
    Store: '',
    Action: ''
  });

  const orderNumberRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus on first field when component mounts
    if (orderNumberRef.current) {
      orderNumberRef.current.focus();
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.OrderNumber || !formData.Status || !formData.Store) {
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus('idle'), 3000);
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('https://n8n.a2kai.co.uk/webhook/order-submission', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Parse the webhook response
        const result = await response.json();
        
        if (result.message === 'Success') {
          setSubmitStatus('success');
          // Reset form after successful submission
          setFormData({
            OrderNumber: '',
            Status: '',
            Link: '',
            Store: '',
            Action: ''
          });
          // Focus back to first field for next entry
          setTimeout(() => {
            if (orderNumberRef.current) {
              orderNumberRef.current.focus();
            }
          }, 1000);
        } else {
          // Webhook returned Error or any other message
          setSubmitStatus('error');
        }
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus('idle'), 3000);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Submit form on Ctrl+Enter
    if (e.ctrlKey && e.key === 'Enter') {
      handleSubmit(e as any);
    }
  };

  const handleRadioKeyDown = (e: React.KeyboardEvent, value: string, type: 'status' | 'store') => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (type === 'status') {
        setFormData(prev => ({ ...prev, Status: value as 'Tracked' | 'Untracked' }));
      } else {
        setFormData(prev => ({ ...prev, Store: value as 'slidezz' | 'TT' | 'a2k' }));
      }
    }
  };

  return (
    <div className={`min-h-screen transition-all duration-300 ${isDark ? 'dark bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <div>
                <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  A2K Operations
                </h1>
                <p className={`text-sm font-medium ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                  Returns Management Center
                </p>
              </div>
            </div>
            <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Press Ctrl+Enter to submit quickly
            </p>
          </div>
          
          <button
            onClick={() => setIsDark(!isDark)}
            className={`p-3 rounded-full transition-all duration-300 hover:scale-110 ${
              isDark 
                ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' 
                : 'bg-white text-gray-700 hover:bg-gray-50 shadow-lg'
            }`}
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        {/* Form */}
        <div className="max-w-2xl mx-auto">
          <form 
            onSubmit={handleSubmit} 
            onKeyDown={handleKeyDown}
            className={`backdrop-blur-lg rounded-2xl p-8 shadow-2xl border transition-all duration-300 ${
              isDark 
                ? 'bg-gray-800/80 border-gray-700' 
                : 'bg-white/80 border-white/50'
            }`}
          >
            {/* Order Number */}
            <div className="mb-6">
              <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                Order Number
              </label>
              <input
                ref={orderNumberRef}
                type="text"
                value={formData.OrderNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, OrderNumber: e.target.value }))}
                className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
                placeholder="Enter order number..."
                autoComplete="off"
                tabIndex={1}
              />
            </div>

            {/* Tracking Status */}
            <div className="mb-6">
              <label className={`block text-sm font-semibold mb-3 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                Tracking Status
              </label>
              <div className="grid grid-cols-2 gap-4">
                {['Tracked', 'Untracked'].map((status, index) => (
                  <label
                    key={status}
                    className={`flex items-center justify-center cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 hover:scale-105 focus-within:ring-4 focus-within:ring-blue-500/20 ${
                      formData.Status === status
                        ? (isDark ? 'bg-blue-900/50 border-blue-500 text-blue-300' : 'bg-blue-50 border-blue-500 text-blue-700')
                        : (isDark ? 'border-gray-600 text-gray-300 hover:border-gray-500' : 'border-gray-300 text-gray-700 hover:border-gray-400')
                    }`}
                    tabIndex={2 + index}
                    onKeyDown={(e) => handleRadioKeyDown(e, status, 'status')}
                  >
                    <input
                      type="radio"
                      name="status"
                      value={status}
                      checked={formData.Status === status}
                      onChange={(e) => setFormData(prev => ({ ...prev, Status: e.target.value as 'Tracked' | 'Untracked' }))}
                      className="sr-only"
                      tabIndex={-1}
                    />
                    <span className="font-medium">{status}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Link */}
            <div className="mb-6">
              <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                Link
              </label>
              <input
                type="url"
                value={formData.Link}
                onChange={(e) => setFormData(prev => ({ ...prev, Link: e.target.value }))}
                className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
                placeholder="https://example.com"
                tabIndex={4}
              />
            </div>

            {/* Store Selection */}
            <div className="mb-6">
              <label className={`block text-sm font-semibold mb-3 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                Store
              </label>
              <div className="grid grid-cols-3 gap-3">
                {['slidezz', 'TT', 'a2k'].map((store, index) => (
                  <label
                    key={store}
                    className={`flex items-center justify-center cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 hover:scale-105 focus-within:ring-4 focus-within:ring-emerald-500/20 ${
                      formData.Store === store
                        ? (isDark ? 'bg-emerald-900/50 border-emerald-500 text-emerald-300' : 'bg-emerald-50 border-emerald-500 text-emerald-700')
                        : (isDark ? 'border-gray-600 text-gray-300 hover:border-gray-500' : 'border-gray-300 text-gray-700 hover:border-gray-400')
                    }`}
                    tabIndex={5 + index}
                    onKeyDown={(e) => handleRadioKeyDown(e, store, 'store')}
                  >
                    <input
                      type="radio"
                      name="store"
                      value={store}
                      checked={formData.Store === store}
                      onChange={(e) => setFormData(prev => ({ ...prev, Store: e.target.value as 'slidezz' | 'TT' | 'a2k' }))}
                      className="sr-only"
                      tabIndex={-1}
                    />
                    <span className="font-medium text-center">{store}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Action */}
            <div className="mb-8">
              <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                Action
              </label>
              <textarea
                value={formData.Action}
                onChange={(e) => setFormData(prev => ({ ...prev, Action: e.target.value }))}
                rows={3}
                className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 resize-none ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
                placeholder="Describe the action to be taken..."
                tabIndex={8}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              tabIndex={9}
              className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all duration-300 transform hover:scale-105 focus:ring-4 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                submitStatus === 'success'
                  ? 'bg-emerald-500 hover:bg-emerald-600'
                  : submitStatus === 'error'
                  ? 'bg-red-500 hover:bg-red-600'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Submitting...</span>
                  </>
                ) : submitStatus === 'success' ? (
                  <>
                    <CheckCircle size={20} />
                    <span>Success!</span>
                  </>
                ) : submitStatus === 'error' ? (
                  <>
                    <AlertCircle size={20} />
                    <span>Error - Try Again</span>
                  </>
                ) : (
                  <>
                    <span>Submit Return</span>
                  </>
                )}
              </div>
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className={`text-center mt-8 text-sm ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
          <p>A2K Operations Dashboard • Built for Speed & Efficiency</p>
        </div>
      </div>
    </div>
  );
}

export default App;