import { useState } from 'react';
import api from '../lib/api';
import { Loader2, Download } from 'lucide-react';
import FileDropZone from './FileDropZone';
import FileList from './FileList';

const ACCEPTED = '.docx,.doc,.xlsx,.xls,.csv,.pptx,.ppt,.png,.jpg,.jpeg,.bmp,.tiff,.txt,.md,.html';

export default function ConvertTab({ addToast }) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFiles = (newFiles) => {
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleConvert = async () => {
    if (!files.length) return;
    setLoading(true);

    const formData = new FormData();
    files.forEach((f) => formData.append('files', f));

    try {
      const res = await api.post('/api/convert', formData, {
        responseType: 'blob',
      });

      // Determine filename from Content-Disposition or fallback
      const disposition = res.headers['content-disposition'];
      let filename = files.length === 1
        ? files[0].name.replace(/\.[^.]+$/, '.pdf')
        : 'converted.zip';
      if (disposition) {
        const match = disposition.match(/filename="?(.+?)"?$/);
        if (match) filename = match[1];
      }

      // Trigger download
      const url = URL.createObjectURL(res.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);

      addToast('success', `Converted ${files.length} file(s) successfully!`);
      setFiles([]);
    } catch (err) {
      const message = err.response?.data?.detail || 'Conversion failed';
      // If the error response is a blob, read it
      if (err.response?.data instanceof Blob) {
        const text = await err.response.data.text();
        try {
          const json = JSON.parse(text);
          addToast('error', json.detail || 'Conversion failed');
        } catch {
          addToast('error', 'Conversion failed');
        }
      } else {
        addToast('error', message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">Convert to PDF</h2>
      <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
        Upload documents, images, or spreadsheets to convert them to PDF.
      </p>

      <FileDropZone
        onFiles={handleFiles}
        accept={ACCEPTED}
        label="Drop files to convert"
      />

      <FileList files={files} onRemove={removeFile} />

      {files.length > 0 && (
        <button
          onClick={handleConvert}
          disabled={loading}
          className="mt-6 w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary-500 text-white font-medium hover:bg-primary-600 disabled:opacity-60 transition-colors cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Converting...
            </>
          ) : (
            <>
              <Download size={18} />
              Convert {files.length} file{files.length > 1 ? 's' : ''} to PDF
            </>
          )}
        </button>
      )}
    </div>
  );
}
