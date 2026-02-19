import { Sun, Moon, FileText } from 'lucide-react';

const tabs = [
  { id: 'convert', label: 'Convert' },
  { id: 'split', label: 'Split' },
  { id: 'merge', label: 'Merge' },
];

export default function Header({ activeTab, setActiveTab, darkMode, setDarkMode }) {
  return (
    <header className="border-b" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-secondary)' }}>
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText size={28} className="text-primary-500" />
          <h1 className="text-xl font-bold">PDF Toolkit</h1>
        </div>

        <div className="flex items-center gap-4">
          {/* Tab navigation */}
          <nav className="flex rounded-lg overflow-hidden border" style={{ borderColor: 'var(--border)' }}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-primary-500 text-white'
                    : 'hover:bg-primary-50 dark:hover:bg-primary-900/30'
                }`}
                style={activeTab !== tab.id ? { backgroundColor: 'var(--bg)' } : {}}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Dark mode toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg transition-colors cursor-pointer hover:bg-primary-100 dark:hover:bg-primary-900/30"
            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
}
