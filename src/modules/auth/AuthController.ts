import { Request, Response } from 'express';

export class AuthController {
  login(req: Request, res: Response) {
    return res.json({ message: 'Login endpoint' });
  }
}
