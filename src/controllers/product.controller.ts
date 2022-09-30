import { Request, Response } from 'express';

import { productSchema } from '../schemas';
import { productService } from '../services';

// createProduct
export async function createProduct(
  req: Request<{}, {}, productSchema.CreateProductInput['body']>,
  res: Response
) {
  const userId = res.locals.user._id;

  const body = req.body;

  const product = await productService.createProduct({ ...body, user: userId });

  return res.send(product);
}
// updateProduct
export async function updateProduct(
  req: Request<productSchema.UpdateProductInput['params']>,
  res: Response
) {
  const userId = res.locals.user._id;

  const productId = req.params.productId;

  const update = req.body;

  const product = await productService.findProduct({ productId });

  if (!product) {
    res.sendStatus(404);
  }

  if (String(product?.user) != userId) {
    return res.sendStatus(403);
  }

  const updatedProduct = await productService.findAndUpdateProduct(
    { productId },
    update,
    { new: true }
  );
  {
    return res.send(updatedProduct);
  }
}

// getProduct
export async function getProduct(
  req: Request<productSchema.GetProductInput['params']>,
  res: Response
) {
  const productId = req.params.productId;

  const product = await productService.findProduct({ productId });

  if (!product) {
    return res.sendStatus(404);
  }

  return res.send(product);
}
// deleteProduct
export async function deleteProduct(
  req: Request<productSchema.DeleteProductInput['params']>,
  res: Response
) {
  const userId = res.locals.user._id;

  const productId = req.params.productId;

  const product = await productService.findProduct({ productId });

  if (!product) {
    res.sendStatus(404);
  }

  if (String(product?.user) != userId) {
    return res.sendStatus(403);
  }

  const updatedProduct = await productService.deleteProduct({ productId });

  {
    return res.sendStatus(200);
  }
}
