import api, { unwrap } from './api';

// Uploads a single image file to the backend, which stores it in Supabase
// Storage and returns a public URL. `folder` groups uploads by entity type
// (e.g. 'destinations', 'cities') so the bucket stays organized.
const mediaService = {
  upload: (file, folder = 'general') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    return unwrap(
      api.post('/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    );
  },
};

export default mediaService;
