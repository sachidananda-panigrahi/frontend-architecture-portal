import { twMerge } from 'tailwind-merge';

export function cx(...inputs: (string | undefined | null | false)[]) {
  return twMerge(...inputs.filter(Boolean) as string[]);
}
