/**
 * The longest draft Yessay will analyze in one pass. Longer essays lose
 * review quality (the model spreads attention too thin) and should be split
 * into sections checked separately. ~5,000 words also lines up with the
 * draft-repair input cap, so anything analyzable can also be repaired.
 */
export const MAX_DRAFT_WORDS = 5000;

export function countWords(text: string): number {
  const trimmed = text.trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
}

export const OVER_LIMIT_MESSAGE = `This draft is over the ${MAX_DRAFT_WORDS.toLocaleString()}-word limit for a single analysis. Split it into sections and check each one separately for the most useful feedback.`;
