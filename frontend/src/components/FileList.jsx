import { X, GripVertical, FileText } from 'lucide-react';

export default function FileList({ files, onRemove, draggable = false }) {
  if (!files.length) return null;

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="mt-4 space-y-2">
      {files.map((file, index) => (
        <div
          key={`${file.name}-${index}`}
          className="flex items-center gap-3 px-4 py-3 rounded-lg border"
          style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-secondary)' }}
        >
          {draggable && (
            <GripVertical size={16} className="opacity-40 cursor-grab" />
          )}
          <FileText size={18} className="text-primary-500 shrink-0" />
          <span className="flex-1 text-sm truncate">{file.name}</span>
          <span className="text-xs shrink-0" style={{ color: 'var(--text-secondary)' }}>
            {formatSize(file.size)}
          </span>
          {onRemove && (
            <button
              onClick={() => onRemove(index)}
              className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 cursor-pointer"
            >
              <X size={16} />
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
