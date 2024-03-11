import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Product } from '@prisma/client';
import { ProductComplete, RecipeComplete } from 'src/types/product.types';
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

  async getAll() {
    // The findMany method is used to retrieve all records from the database
    try {
      const products = await this.prisma.product.findMany();
      const productsComplete: ProductComplete[] = [];
      for (const product of products) {
        const type = this.getType(product.type_id);
        const productComplete: ProductComplete = {
          data: product,
          type: await type,
        };
        productsComplete.push(productComplete);
      }
      return productsComplete;
    } catch (error) {
      this.logger.error(`Error in getAll: ${error.message}`);
      throw error;
    }
  }

  async getOne(index: object) {
    // The findFirst method is used to retrieve a single record from the database
    try {
      const product = await this.prisma.product.findFirst({ where: index });
      if (!product) {
        throw new NotFoundException('Product not found');
      } else {
        const type = this.getType(product.type_id);
        const productComplete: ProductComplete = {
          data: product,
          type: await type,
        };
        return productComplete;
      }
    } catch (error) {
      this.logger.error(`Error in getOne: ${error.message}`);
      throw error;
    }
  }

  async getCompleteRecipes(productId: string) {
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
      return recipes;
    } catch (error) {
      this.logger.error(`Error in getCompleteRecipes: ${error.message}`);
      throw error;
    }
  }

  async getRecipesDetails(recipeId: string) {
    try {
      const recipe = await this.prisma.materialRecipe.findFirst({
        where: { id: recipeId },
      });
      const product = await this.getOne({ id: recipe.product_id });
      const recipeComplete: RecipeComplete = {
        data: recipe,
        product: product.data,
      };
      return recipeComplete;
    } catch (error) {
      this.logger.error(`Error in getRecipesDetails: ${error.message}`);
      throw error;
    }
  }

  async getType(typeId: string) {
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

  async update(data: Product) {
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

  async delete(id: string) {
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
