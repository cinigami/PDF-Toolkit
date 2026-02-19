import { useState } from 'react';
import axios from 'axios';
import { Loader2, Download, Scissors, FileText } from 'lucide-react';
import FileDropZone from './FileDropZone';

export default function SplitTab({ addToast }) {
  const [file, setFile] = useState(null);
  const [pdfInfo, setPdfInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [infoLoading, setInfoLoading] = useState(false);
  const [mode, setMode] = useState('all');
  const [specificPages, setSpecificPages] = useState('');
  const [rangeStart, setRangeStart] = useState(1);
  const [rangeEnd, setRangeEnd] = useState(1);

  const handleFile = async (files) => {
    const f = files[0];
    if (!f.name.toLowerCase().endsWith('.pdf')) {
      addToast('error', 'Please upload a PDF file');
      return;
    }
    setFile(f);
    setPdfInfo(null);

    // Get PDF info
    setInfoLoading(true);
    const formData = new FormData();
    formData.append('file', f);
    try {
      const res = await axios.post('/api/split/info', formData);
      setPdfInfo(res.data);
      setRangeEnd(res.data.page_count);
    } catch {
      addToast('error', 'Failed to read PDF info');
    } finally {
      setInfoLoading(false);
    }
  };

  const handleSplit = async () => {
    if (!file) return;
    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('mode', mode);
    if (mode === 'specific') formData.append('pages', specificPages);
    if (mode === 'range') {
      formData.append('start', rangeStart);
      formData.append('end', rangeEnd);
    }

    try {
      const res = await axios.post('/api/split', formData, {
        responseType: 'blob',
      });

      const contentType = res.headers['content-type'];
      const isZip = contentType?.includes('zip');
      const filename = isZip ? 'split.zip' : 'split.pdf';

      const url = URL.createObjectURL(res.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);

      addToast('success', 'PDF split successfully!');
    } catch (err) {
      if (err.response?.data instanceof Blob) {
        const text = await err.response.data.text();
        try {
          addToast('error', JSON.parse(text).detail);
        } catch {
          addToast('error', 'Split failed');
        }
      } else {
        addToast('error', err.response?.data?.detail || 'Split failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setPdfInfo(null);
    setMode('all');
    setSpecificPages('');
    setRangeStart(1);
    setRangeEnd(1);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">Split PDF</h2>
      <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
        Upload a PDF and split it into separate pages or extract specific pages.
      </p>

      {!file ? (
        <FileDropZone
          onFiles={handleFile}
          accept=".pdf"
          multiple={false}
          label="Drop a PDF file to split"
        />
      ) : (
        <div>
          {/* File info bar */}
          <div
            className="flex items-center gap-3 px-4 py-3 rounded-lg border mb-6"
            style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-secondary)' }}
          >
            <FileText size={20} className="text-primary-500" />
            <div className="flex-1">
              <p className="text-sm font-medium">{file.name}</p>
              {infoLoading && <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Reading PDF...</p>}
              {pdfInfo && (
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {pdfInfo.page_count} page{pdfInfo.page_count !== 1 ? 's' : ''}
                </p>
              )}
            </div>
            <button onClick={reset} className="text-sm text-primary-500 hover:underline cursor-pointer">
              Change file
            </button>
          </div>

          {/* Split mode selector */}
          {pdfInfo && (
            <>
              <div className="space-y-3 mb-6">
                <label className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer"
                  style={{ borderColor: mode === 'all' ? '#0ea5e9' : 'var(--border)', backgroundColor: 'var(--bg-secondary)' }}>
                  <input type="radio" name="mode" value="all" checked={mode === 'all'}
                    onChange={() => setMode('all')} className="accent-primary-500" />
                  <div>
                    <p className="font-medium text-sm">Split into individual pages</p>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Creates one PDF per page</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer"
                  style={{ borderColor: mode === 'specific' ? '#0ea5e9' : 'var(--border)', backgroundColor: 'var(--bg-secondary)' }}>
                  <input type="radio" name="mode" value="specific" checked={mode === 'specific'}
                    onChange={() => setMode('specific')} className="accent-primary-500" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">Extract specific pages</p>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>e.g., 1, 3, 5</p>
                    {mode === 'specific' && (
                      <input
                        type="text"
                        value={specificPages}
                        onChange={(e) => setSpecificPages(e.target.value)}
                        placeholder="1, 3, 5"
                        className="mt-2 w-full px-3 py-1.5 text-sm rounded border outline-none focus:border-primary-500"
                        style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg)', color: 'var(--text)' }}
                        onClick={(e) => e.stopPropagation()}
                      />
                    )}
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer"
                  style={{ borderColor: mode === 'range' ? '#0ea5e9' : 'var(--border)', backgroundColor: 'var(--bg-secondary)' }}>
                  <input type="radio" name="mode" value="range" checked={mode === 'range'}
                    onChange={() => setMode('range')} className="accent-primary-500" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">Extract page range</p>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>e.g., pages 5–10</p>
                    {mode === 'range' && (
                      <div className="flex items-center gap-2 mt-2" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="number"
                          min={1}
                          max={pdfInfo.page_count}
                          value={rangeStart}
                          onChange={(e) => setRangeStart(Number(e.target.value))}
                          className="w-20 px-3 py-1.5 text-sm rounded border outline-none focus:border-primary-500"
                          style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg)', color: 'var(--text)' }}
                        />
                        <span className="text-sm">to</span>
                        <input
                          type="number"
                          min={1}
                          max={pdfInfo.page_count}
                          value={rangeEnd}
                          onChange={(e) => setRangeEnd(Number(e.target.value))}
                          className="w-20 px-3 py-1.5 text-sm rounded border outline-none focus:border-primary-500"
                          style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg)', color: 'var(--text)' }}
                        />
                      </div>
                    )}
                  </div>
                </label>
              </div>

              <button
                onClick={handleSplit}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary-500 text-white font-medium hover:bg-primary-600 disabled:opacity-60 transition-colors cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Splitting...
                  </>
                ) : (
                  <>
                    <Scissors size={18} />
                    Split PDF
                  </>
                )}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
