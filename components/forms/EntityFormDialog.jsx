import { useEffect, useState } from 'react';
import Dialog from '../kokonut/Dialog';
import Input from '../kokonut/Input';
import Textarea from '../kokonut/Textarea';
import Button from '../kokonut/Button';
import ImageInput from './ImageInput';
import ImageListInput from './ImageListInput';

// Small helpers so fields can use a dotted name (e.g. 'coordinates.lat') to
// read/write a nested value (e.g. Destination.coordinates.lat) while still
// being stored as a single flat key in the dialog's own `values` state.
function getPath(obj, path) {
  return path.split('.').reduce((acc, key) => (acc == null ? acc : acc[key]), obj);
}
function setPath(obj, path, value) {
  const keys = path.split('.');
  const result = { ...obj };
  let cursor = result;
  keys.forEach((key, i) => {
    if (i === keys.length - 1) {
      cursor[key] = value;
    } else {
      cursor[key] = { ...(cursor[key] || {}) };
      cursor = cursor[key];
    }
  });
  return result;
}

// Generic create/edit dialog driven by a `fields` schema:
// [{ name, label, type: 'text'|'textarea'|'number'|'select'|'checkbox'|'image', options?, required?, array?, folder? }]
// `array: true` fields (e.g. Destination.highlights) are edited as a comma-separated string
// and converted to/from a real array of trimmed, non-empty values on load/submit, EXCEPT
// `type: 'image', array: true` fields (e.g. gallery), which use ImageListInput and keep a
// real array in state directly (upload-or-paste-URL per image, no comma splitting).
export default function EntityFormDialog({ open, onClose, title, fields, initialValues, onSubmit, submitting }) {
  const [values, setValues] = useState({});

  const editId = initialValues?._id || initialValues?.id || null;

  useEffect(() => {
    if (open) {
      const base = {};
      fields.forEach((f) => {
        const raw = (f.name.includes('.') ? getPath(initialValues, f.name) : initialValues?.[f.name]) ?? '';
        // A reference field (e.g. City.region) comes back from the API populated as an
        // object ({ _id, name, slug, ... }) rather than the raw id string the backend
        // expects on write, so collapse any populated object/array-of-objects down to
        // id(s) before it ever reaches the form's text input.
        const toId = (v) => (v && typeof v === 'object' ? v._id || v.id || '' : v);
        if (f.type === 'image' && f.array) base[f.name] = Array.isArray(raw) ? raw : [];
        else if (f.array && Array.isArray(raw)) base[f.name] = raw.map(toId).join(', ');
        else if (f.type === 'checkbox') base[f.name] = !!raw;
        else if (f.type !== 'select') base[f.name] = toId(raw);
        else base[f.name] = raw;
      });
      setValues(base);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, editId]);

  const handleChange = (name, val) => setValues((v) => ({ ...v, [name]: val }));

  const handleSubmit = (e) => {
    e.preventDefault();
    let payload = {};
    fields.forEach((f) => {
      let val = values[f.name];
      if (f.type === 'image' && f.array) {
        val = Array.isArray(val) ? val : [];
        if (typeof f.max === 'number') val = val.slice(0, f.max);
      } else if (f.array) {
        val = String(val ?? '')
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);
      } else if (f.type === 'number') {
        val = val === '' || val == null ? null : Number(val);
      }
      payload = f.name.includes('.') ? setPath(payload, f.name, val) : { ...payload, [f.name]: val };
    });
    onSubmit(payload);
  };

  return (
    <Dialog open={open} onClose={onClose} title={title} className="max-w-xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        {fields.map((f) => {
          if (f.type === 'image' && f.array) {
            return (
              <ImageListInput
                key={f.name}
                label={f.label}
                folder={f.folder}
                max={f.max}
                value={values[f.name] ?? []}
                onChange={(val) => handleChange(f.name, val)}
              />
            );
          }
          if (f.type === 'image') {
            return (
              <ImageInput
                key={f.name}
                label={f.label}
                folder={f.folder}
                value={values[f.name] ?? ''}
                onChange={(val) => handleChange(f.name, val)}
              />
            );
          }
          if (f.type === 'textarea') {
            return (
              <Textarea
                key={f.name}
                label={f.label}
                rows={4}
                required={f.required}
                value={values[f.name] ?? ''}
                onChange={(e) => handleChange(f.name, e.target.value)}
              />
            );
          }
          if (f.type === 'checkbox') {
            return (
              <label key={f.name} className="flex items-center gap-2 text-sm font-medium text-charcoal-700">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-charcoal-300 focus:outline-none focus:ring-2 focus:ring-emerald-600/40 focus:ring-offset-0"
                  checked={!!values[f.name]}
                  onChange={(e) => handleChange(f.name, e.target.checked)}
                />
                {f.label}
              </label>
            );
          }
          if (f.type === 'select') {
            return (
              <div key={f.name}>
                <label className="mb-1.5 block text-sm font-medium text-charcoal-700">{f.label}</label>
                <select
                  className="input-field"
                  required={f.required}
                  value={values[f.name] ?? ''}
                  onChange={(e) => handleChange(f.name, e.target.value)}
                >
                  <option value="" disabled>Select…</option>
                  {f.options.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            );
          }
          return (
            <Input
              key={f.name}
              label={f.label}
              type={f.type || 'text'}
              required={f.required}
              value={values[f.name] ?? ''}
              onChange={(e) => handleChange(f.name, e.target.value)}
            />
          );
        })}
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={submitting}>Save</Button>
        </div>
      </form>
    </Dialog>
  );
}
