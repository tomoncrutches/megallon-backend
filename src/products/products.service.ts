import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { OptionalProduct, RecipeComplete } from 'src/types/product.types';
import { Product, ProductType } from '@prisma/client';

import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}
  private readonly logger = new Logger('Product Service');
  async create(data: Product) {
    // The create method is used to create a new record in the database
    try {
      return await this.prisma.product.create({ data });
    } catch (error) {
      this.logger.error(`Error in create: ${error.message}`);
      throw error;
    }
  }

  async getAll(): Promise<Product[]> {
    // The findMany method is used to retrieve all records from the database
    try {
      return await this.prisma.product.findMany({ include: { type: true } });
    } catch (error) {
      this.logger.error(`Error in getAll: ${error.message}`);
      throw error;
    }
  }

  async getOne(product: OptionalProduct): Promise<Product> {
    // The findFirst method is used to retrieve a single record from the database
    try {
      const dbProduct = await this.prisma.product.findFirst({
        where: product,
        include: { type: true },
      });
      if (!dbProduct)
        throw new NotFoundException('El producto no fue encontrado.');
      return dbProduct;
    } catch (error) {
      this.logger.error(`Error in getOne: ${error.message}`);
      throw error;
    }
  }

  async getCompleteRecipes(productId: string): Promise<RecipeComplete[]> {
    try {
      const recipes = await this.prisma.materialRecipe.findMany({
        where: { product_id: productId },
      });
      const recipesComplete: RecipeComplete[] = [];
      for (const recipe of recipes) {
        const recipeComplete: RecipeComplete = await this.getRecipesDetails(
          recipe.id,
        );
        recipesComplete.push(recipeComplete);
      }
      return recipesComplete;
    } catch (error) {
      this.logger.error(`Error in getCompleteRecipes: ${error.message}`);
      throw error;
    }
  }

  async getRecipesDetails(recipeId: string): Promise<RecipeComplete> {
    try {
      const recipe = await this.prisma.materialRecipe.findFirst({
        where: { id: recipeId },
      });
      const product = await this.getOne({ id: recipe.product_id });
      const recipeComplete: RecipeComplete = {
        data: recipe,
        product: product,
      };
      return recipeComplete;
    } catch (error) {
      this.logger.error(`Error in getRecipesDetails: ${error.message}`);
      throw error;
    }
  }

  async getType(typeId: string): Promise<ProductType> {
    try {
      const type = await this.prisma.productType.findFirst({
        where: { id: typeId },
      });
      return type;
    } catch (error) {
      this.logger.error(`Error in getType: ${error.message}`);
      throw error;
    }
  }

  async update(data: Product): Promise<Product> {
    try {
      return await this.prisma.product.update({
        where: {
          id: data.id,
        },
        data,
      });
    } catch (error) {
      this.logger.error(`Error in update: ${error.message}`);
      throw error;
    }
  }

  async delete(id: string): Promise<Product> {
    try {
      return await this.prisma.product.delete({ where: { id } });
    } catch (error) {
      this.logger.error(`Error in delete: ${error.message}`);
      throw error;
    }
  }

  async addProduction(list: Product[]) {
    try {
      list.forEach((element) => {
        this.update(element);
      });
    } catch (error) {
      this.logger.error(`Error in addProduction: ${error.message}`);
      throw error;
    }
  }
}
