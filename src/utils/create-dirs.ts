import { existsSync, mkdirSync } from 'fs';

const dirs = ['uploads/data', 'uploads/invitations', 'uploads/invites'];

const createDir = (dir: string) => {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
};

export const createAllDirectories = () => {
  dirs.forEach((dir) => {
    createDir(dir);
  });
};
