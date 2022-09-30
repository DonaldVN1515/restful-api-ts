import { Request, Response } from 'express';
import { omit } from 'lodash';

import { CreateUserInput } from '../schemas/user.schema';

import { userService } from '../services';
import logger from '../utils/logger';

export async function createUserController(
  req: Request<{}, {}, CreateUserInput['body']>,
  res: Response
) {
  try {
    const user = await userService.createUser(req.body);
    return res.send(omit(user));
  } catch (error: any) {
    logger.error(error);
    return res.status(409).send(error.message);
  }
}

