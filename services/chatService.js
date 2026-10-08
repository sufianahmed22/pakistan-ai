import api, { unwrap } from './api';

const chatService = {
  // Backend expects { message, conversationId?, category? } (see
  // validators/chatValidator.js) - conversationId must be a string or
  // omitted entirely, never null, so it's only included when set.
  ask: ({ question, conversationId, category }) =>
    unwrap(
      api.post('/chat', {
        message: question,
        ...(conversationId ? { conversationId } : {}),
        ...(category ? { category } : {}),
      })
    ),
};

export default chatService;
