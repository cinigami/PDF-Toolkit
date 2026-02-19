import { useRef, useState, useCallback } from 'react';
import { Upload } from 'lucide-react';

export default function FileDropZone({ onFiles, accept, multiple = true, label }) {
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length) onFiles(multiple ? files : [files[0]]);
  }, [onFiles, multiple]);

  const handleChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length) onFiles(files);
    e.target.value = '';
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all ${
        dragOver ? 'drop-active' : ''
      }`}
      style={{ borderColor: dragOver ? undefined : 'var(--border)', backgroundColor: 'var(--bg-secondary)' }}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleChange}
        className="hidden"
      />
      <Upload size={40} className="mx-auto mb-3 text-primary-400" />
      <p className="text-lg font-medium">{label || 'Drop files here or click to browse'}</p>
      <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
        {accept ? `Accepted: ${accept}` : 'All supported file types'}
      </p>
      <p className="text-xs mt-2" style={{ color: 'var(--text-secondary)' }}>
        Max 50MB per file
      </p>
    </div>
  );
}
