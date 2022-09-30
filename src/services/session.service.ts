import { get } from 'lodash';
import { FilterQuery, UpdateQuery } from 'mongoose';

import SessionModel, { SchemaDocument } from '../models/session.model';
import { signJwt, verifyJwt } from '../utils/jwt';
import { findUser } from './user.service';
import config from 'config';

// createSession
export async function createSession(userId: string, userAgent: string) {
  const session = await SessionModel.create({ user: userId, userAgent });

  return session.toJSON();
}

// findSessions
export async function findSessions(query: FilterQuery<SchemaDocument>) {
  return SessionModel.find(query).lean();
}

export async function updateSession(
  query: FilterQuery<SchemaDocument>,
  update: UpdateQuery<SchemaDocument>
) {
  return SessionModel.updateOne(query, update);
}

export async function reIssueAccessToken({
  refreshToken,
}: {
  refreshToken: string;
}) {
  const { decoded } = verifyJwt(refreshToken, 'refreshTokenPublicKey');

  if (!decoded || !get(decoded, 'session')) {
    return false;
  }

  const session = await SessionModel.findById(get(decoded, 'session'));

  if (!session || !session.valid) {
    return false;
  }

  const user = await findUser({ _id: session.user });
  if (!user) {
    return false;
  }

  const accessToken = signJwt(
    { ...user, session: session._id },
    'accessTokenPrivateKey',
    { expiresIn: config.get('accessTokenTtl') }
  );

  return accessToken;
}
