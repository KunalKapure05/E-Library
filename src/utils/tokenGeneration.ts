import jwt from 'jsonwebtoken';
import { config } from '../config/config';


export const generateToken = (user: { id: any; name: any; email: any; } ) => {
  const payload = {
    sub: user.id,
    name: user.name,
    email: user.email,
  };
  return jwt.sign(payload, config.jwtKey as string, { expiresIn: '1h' });
};


