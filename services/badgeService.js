import api, { unwrap } from './api';

const badgeService = {
  getMine: () => unwrap(api.get('/users/me/badges')),
};

export default badgeService;
