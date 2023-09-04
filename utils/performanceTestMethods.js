import crypto from 'crypto';

export const getCryptoed = (iterations) =>
    crypto.pbkdf2Sync('a', 'b', iterations, 512, 'sha512');
