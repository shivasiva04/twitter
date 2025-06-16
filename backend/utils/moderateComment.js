// utils/moderateComment.js
import { allBadWords } from './badWordsList.js';

export const isCommentInappropriate = (text) => {
  if (!text || typeof text !== 'string') return false;

  const normalizedText = text.toLowerCase().replace(/[^a-z0-9\s]/g, "");
  const words = normalizedText.split(/\s+/);

  return words.some(word => allBadWords.includes(word));
};
