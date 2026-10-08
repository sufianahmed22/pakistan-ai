import api, { unwrap } from './api';

const moderationService = {
  listReviewReports: (params) => unwrap(api.get('/admin/moderation/review-reports', { params })),
  resolveReviewReport: (id, action) => unwrap(api.patch(`/admin/moderation/review-reports/${id}`, { action })),
};

export default moderationService;
