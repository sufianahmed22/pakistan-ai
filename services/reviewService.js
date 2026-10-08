import api, { unwrap } from './api';

const reviewService = {
  listForDestination: (destinationId, params) =>
    unwrap(api.get(`/destinations/${destinationId}/reviews`, { params })),
  listForCity: (cityId, params) =>
    unwrap(api.get(`/cities/${cityId}/reviews`, { params })),
  listReplies: (reviewId) => unwrap(api.get(`/reviews/${reviewId}/replies`)),
  create: (destinationId, payload) => unwrap(api.post(`/destinations/${destinationId}/reviews`, payload)),
  createForCity: (cityId, payload) => unwrap(api.post(`/cities/${cityId}/reviews`, payload)),
  update: (id, payload) => unwrap(api.patch(`/reviews/${id}`, payload)),
  remove: (id) => unwrap(api.delete(`/reviews/${id}`)),
  report: (id, payload) => unwrap(api.post(`/reviews/${id}/report`, payload)),
};

export default reviewService;
