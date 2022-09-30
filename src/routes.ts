import { Express, Request, Response } from 'express';

import validateResouce from './middleware/validateResouce';
import requireUser from './middleware/requireUser';

import {
  productController,
  sessionController,
  userController,
} from './controllers';

import { sessionSchema } from './schemas/session.schema';
import { userSchema } from './schemas/user.schema';
import { productSchema } from './schemas';

function routes(app: Express) {
  app.get('/', (req: Request, res: Response) => {
    res.send(200);
  });

  app.post(
    '/api/users',
    validateResouce(userSchema),
    userController.createUserController
  );

  // sessions
  app.post(
    '/api/sessions',
    validateResouce(sessionSchema),
    sessionController.createUserSession
  );

  app.get('/api/sessions', requireUser, sessionController.getUserSession);

  app.delete('/api/sessions', requireUser, sessionController.deleteSession);

  // products
  app.post('/api/products', [
    requireUser,
    validateResouce(productSchema.createProductSchema),
    productController.createProduct,
  ]);

  app.put(
    '/api/products/:productId',
    [requireUser, validateResouce(productSchema.updateProductSchema)],
    productController.updateProduct
  );

  app.get(
    '/api/products/',
    [requireUser, validateResouce(productSchema.getProductSchema)],
    productController.getProduct
  );

  app.delete(
    '/api/products/:productId',
    [requireUser, validateResouce(productSchema.deleteProductSchema)],
    productController.deleteProduct
  );
}
export default routes;
