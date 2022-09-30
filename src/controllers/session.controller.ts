import { Request, Response } from 'express';
import config from 'config';

import { validatePassword } from '../services/user.service';
import { signJwt } from '../utils/jwt';

import { sessionService } from '../services';

// createUserSession
export async function createUserSession(req: Request, res: Response) {
  // Validate the user's password

  const user = await validatePassword(req.body);

  if (!user) {
    return res.status(401).send('Invalid email or password');
  }
  // create a session

  const session = await sessionService.createSession(
    user._id,
    req.get('user-agent') || ''
  );

  // create an access token
  const accessToken = signJwt(
    { ...user, session: session._id },
    'accessTokenPrivateKey',
    { expiresIn: config.get('accessTokenTtl') }
  );

  // create a refresh token
  const refreshToken = signJwt(
    { ...user, session: session._id },
    'refreshTokenPrivateKey',
    { expiresIn: config.get('refreshTokenTtl') }
  );
  // retrun access token and refresh token

  return res.send({ accessToken, refreshToken });
}

// getUserSession
export async function getUserSession(req: Request, res: Response) {
  const userId = res.locals.user._id;

  const sessions = await sessionService.findSessions({
    user: userId,
    valid: true,
  });

  return res.send(sessions);
}

export async function deleteSession(req: Request, res: Response) {
  const sessionId = res.locals.user.session;

  await sessionService.updateSession({ _id: sessionId }, { valid: false });

  return res.send({
    accessToken: null,
    refreshToken: null,
  });
}
