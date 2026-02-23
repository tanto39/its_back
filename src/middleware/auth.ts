import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions } from 'passport-jwt';
import { AppDataSource } from '../data-source';
import { User } from '../entities/User';

const opts: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || 'secret'
};

passport.use(
  new JwtStrategy(opts, async (payload, done) => {
    try {
      const userRepo = AppDataSource.getRepository(User);
      const user = await userRepo.findOne({
        where: { login: payload.login },
        relations: ['role']
      });
      if (user) {
        return done(null, user);
      }
      return done(null, false);
    } catch (error) {
      return done(error, false);
    }
  })
);

export const authenticate = passport.authenticate('jwt', { session: false });

export const checkAdmin = (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user;
  if (user && user.role_name === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Forbidden: Admins only' });
  }
};