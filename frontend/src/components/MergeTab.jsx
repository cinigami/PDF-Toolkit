import { useState, useCallback } from 'react';
import axios from 'axios';
import { Loader2, Download, GripVertical, X, FileText } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import FileDropZone from './FileDropZone';

export default function MergeTab({ addToast }) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFiles = (newFiles) => {
    const pdfs = newFiles.filter((f) => f.name.toLowerCase().endsWith('.pdf'));
    const rejected = newFiles.length - pdfs.length;
    if (rejected > 0) addToast('error', `${rejected} non-PDF file(s) skipped`);
    setFiles((prev) => [...prev, ...pdfs]);
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const onDragEnd = useCallback((result) => {
    if (!result.destination) return;
    const items = Array.from(files);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);
    setFiles(items);
  }, [files]);

  const handleMerge = async () => {
    if (files.length < 2) return;
    setLoading(true);

    const formData = new FormData();
    files.forEach((f) => formData.append('files', f));
    // Order is already set by the files array order
    formData.append('order', files.map((_, i) => i).join(','));

    try {
      const res = await axios.post('/api/merge', formData, {
        responseType: 'blob',
      });

      const url = URL.createObjectURL(res.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'merged.pdf';
      a.click();
      URL.revokeObjectURL(url);

      addToast('success', 'PDFs merged successfully!');
      setFiles([]);
    } catch (err) {
      if (err.response?.data instanceof Blob) {
        const text = await err.response.data.text();
        try {
          addToast('error', JSON.parse(text).detail);
        } catch {
          addToast('error', 'Merge failed');
        }
      } else {
        addToast('error', err.response?.data?.detail || 'Merge failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">Merge PDFs</h2>
      <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
        Upload multiple PDFs and drag to reorder. They'll be merged into a single file.
      </p>

      <FileDropZone
        onFiles={handleFiles}
        accept=".pdf"
        label="Drop PDF files to merge"
      />

      {files.length > 0 && (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="merge-list">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="mt-4 space-y-2"
              >
                {files.map((file, index) => (
                  <Draggable key={`${file.name}-${index}`} draggableId={`${file.name}-${index}`} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg border transition-shadow ${
                          snapshot.isDragging ? 'shadow-lg' : ''
                        }`}
                        style={{
                          borderColor: 'var(--border)',
                          backgroundColor: 'var(--bg-secondary)',
                          ...provided.draggableProps.style,
                        }}
                      >
                        <span className="text-xs font-mono w-6 text-center" style={{ color: 'var(--text-secondary)' }}>
                          {index + 1}
                        </span>
                        <GripVertical size={16} className="opacity-40 cursor-grab" />
                        <FileText size={18} className="text-primary-500 shrink-0" />
                        <span className="flex-1 text-sm truncate">{file.name}</span>
                        <span className="text-xs shrink-0" style={{ color: 'var(--text-secondary)' }}>
                          {formatSize(file.size)}
                        </span>
                        <button
                          onClick={() => removeFile(index)}
                          className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 cursor-pointer"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}

      {files.length >= 2 && (
        <button
          onClick={handleMerge}
          disabled={loading}
          className="mt-6 w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary-500 text-white font-medium hover:bg-primary-600 disabled:opacity-60 transition-colors cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Merging...
            </>
          ) : (
            <>
              <Download size={18} />
              Merge {files.length} PDFs
            </>
          )}
        </button>
      )}

      {files.length === 1 && (
        <p className="mt-4 text-sm text-center" style={{ color: 'var(--text-secondary)' }}>
          Add at least one more PDF to merge.
        </p>
      )}
    </div>
  );
}
