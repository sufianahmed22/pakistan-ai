import { useRef, useState } from 'react';
import mediaService from '../../services/mediaService';
import Input from '../kokonut/Input';
import Button from '../kokonut/Button';
import { Upload, X, Loader2 } from 'lucide-react';

// Single-image field that supports either uploading a file (stored in
// Supabase via the backend) or pasting a direct image URL. Shows a small
// thumbnail preview of whatever URL is currently set.
export default function ImageInput({ label, value, onChange, folder = 'general' }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef(null);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setError('');
    setUploading(true);
    try {
      const { url } = await mediaService.upload(file, folder);
      onChange(url);
    } catch (err) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full">
      {label && <label className="mb-1.5 block text-sm font-medium text-charcoal-700">{label}</label>}
      <div className="flex gap-2">
        <Input
          className="flex-1"
          placeholder="Paste an image URL…"
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
        />
        <Button
          type="button"
          variant="secondary"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
        </Button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      {value && (
        <div className="relative mt-2 inline-block">
          <img src={value} alt="Preview" className="h-20 w-20 rounded-md object-cover border border-charcoal-200" />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute -right-2 -top-2 rounded-full bg-white border border-charcoal-200 p-0.5 shadow-sm"
          >
            <X className="h-3.5 w-3.5 text-charcoal-600" />
          </button>
        </div>
      )}
    </div>
  );
}
