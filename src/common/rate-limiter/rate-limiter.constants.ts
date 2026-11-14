
import { readFileSync } from 'fs';
import { join } from 'path';

export const SLIDING_WINDOW_SCRIPT = readFileSync(
  join(__dirname, 'scripts', 'sliding-window.lua'),
  'utf8',
);
