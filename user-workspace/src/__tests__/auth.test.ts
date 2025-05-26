import { describe, it, expect } from '@jest/globals';
import bcrypt from 'bcryptjs';

describe('Authentication', () => {
  it('should hash and compare password correctly', async () => {
    const password = 'password123';
    const hash = await bcrypt.hash(password, 10);
    const isMatch = await bcrypt.compare(password, hash);
    expect(isMatch).toBe(true);
  });
});
