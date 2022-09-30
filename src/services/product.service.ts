import {
  DocumentDefinition,
  FilterQuery,
  QueryOptions,
  UpdateQuery,
} from 'mongoose';
import ProductModel, { ProductDocument } from '../models/product.model';

// createProduct
export async function createProduct(
  input: DocumentDefinition<Omit<ProductDocument, 'createdAt' | 'updatedAt'>>
) {
  return ProductModel.create(input);
}

// findProduct
export async function findProduct(
  query: FilterQuery<ProductDocument>,
  options: QueryOptions = { lean: true }
) {
  return ProductModel.findOne(query, {}, options);
}

// findAndUpdateProduct
export async function findAndUpdateProduct(
  query: FilterQuery<ProductDocument>,
  update: UpdateQuery<ProductDocument>,
  options: QueryOptions
) {
  return ProductModel.findOneAndUpdate(query, update, options);
}

// deleteProduct
export async function deleteProduct(query: FilterQuery<ProductDocument>) {
  return ProductModel.deleteOne(query);
}
