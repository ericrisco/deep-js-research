export const removeThinkingTags = (text: string): string => {
  return text.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
};

export const extractFromTags = (text: string, tag: string): string => {
  const regex = new RegExp(`<${tag}>(.*?)<\/${tag}>`, 's');
  const match = text.match(regex);
  return match ? match[1].trim() : '';
}; 