// import { AuthenticationError } from 'apollo-server-express';
import jwt from 'jsonwebtoken';
import fs from 'fs';

const generateToken = async (userId: string, exp: string): Promise<string> => {
  /* eslint-disable global-require */

  const privateKeyPath = require('path').resolve(__dirname, './../files/private.key');

  const privateKey = fs.readFileSync(privateKeyPath);

  return jwt.sign({ userId }, privateKey, { algorithm: 'HS512', expiresIn: exp });
};

export const jsonWebTokenUtil = {
  generateToken,
};
