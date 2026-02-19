import { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import ConvertTab from './components/ConvertTab';
import SplitTab from './components/SplitTab';
import MergeTab from './components/MergeTab';
import Toast from './components/Toast';

export default function App() {
  const [activeTab, setActiveTab] = useState('convert');
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pdf-toolkit-dark');
      if (saved !== null) return saved === 'true';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  const [toasts, setToasts] = useState([]);

  // Apply dark class to <html>
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('pdf-toolkit-dark', darkMode);
  }, [darkMode]);

  const addToast = useCallback((type, message) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, type, message }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg)' }}>
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      <main className="max-w-3xl mx-auto px-4 py-8">
        {activeTab === 'convert' && <ConvertTab addToast={addToast} />}
        {activeTab === 'split' && <SplitTab addToast={addToast} />}
        {activeTab === 'merge' && <MergeTab addToast={addToast} />}
      </main>

      <Toast toasts={toasts} removeToast={removeToast} />
    </div>
  );
}
