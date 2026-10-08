import { useRef, useState } from 'react';
import mediaService from '../../services/mediaService';
import Button from '../kokonut/Button';
import { Upload, X, Loader2, Plus } from 'lucide-react';

// Multi-image field (e.g. Destination/City/Region.gallery, capped via `max`). Each
// image can be added either by uploading a file or by pasting a URL; images
// are shown as a row of removable thumbnails.
export default function ImageListInput({ label, value, onChange, folder = 'general', max }) {
  const images = Array.isArray(value) ? value : [];
  const atCap = typeof max === 'number' && images.length >= max;
  const [urlDraft, setUrlDraft] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef(null);

  const addImage = (url) => {
    if (!url) return;
    if (typeof max === 'number' && images.length >= max) return;
    onChange([...images, url]);
  };

  const removeImage = (idx) => onChange(images.filter((_, i) => i !== idx));

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setError('');
    setUploading(true);
    try {
      const { url } = await mediaService.upload(file, folder);
      addImage(url);
    } catch (err) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleAddUrl = () => {
    const trimmed = urlDraft.trim();
    if (trimmed) {
      addImage(trimmed);
      setUrlDraft('');
    }
  };

  return (
    <div className="w-full">
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-charcoal-700">
          {label}
          {typeof max === 'number' && <span className="ml-1.5 font-normal text-charcoal-400">({images.length} / {max})</span>}
        </label>
      )}
      {!atCap && (
        <div className="flex gap-2">
          <input
            className="input-field flex-1"
            placeholder="Paste an image URL and press Add…"
            value={urlDraft}
            onChange={(e) => setUrlDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddUrl();
              }
            }}
          />
          <Button type="button" variant="secondary" onClick={handleAddUrl}>
            <Plus className="h-4 w-4" />
          </Button>
          <Button type="button" variant="secondary" onClick={() => fileRef.current?.click()} disabled={uploading}>
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          </Button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </div>
      )}
      {atCap && <p className="text-xs text-charcoal-400">Maximum of {max} images reached - remove one to add another.</p>}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      {images.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {images.map((url, idx) => (
            <div key={`${url}-${idx}`} className="relative">
              <img src={url} alt={`Image ${idx + 1}`} className="h-16 w-16 rounded-md object-cover border border-charcoal-200" />
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="absolute -right-1.5 -top-1.5 rounded-full bg-white border border-charcoal-200 p-0.5 shadow-sm"
              >
                <X className="h-3 w-3 text-charcoal-600" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
