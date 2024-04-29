import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import {
  OptionalProduct,
  ProductForCreate,
  RecipeComplete,
} from 'src/types/product.types';
import { Product, ProductType } from '@prisma/client';

import { PrismaService } from 'src/prisma/prisma.service';
import { ProductBasic } from 'src/types/sale.types';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}
  private readonly logger = new Logger('Product Service');

  async create(data: ProductForCreate): Promise<Product> {
    // The create method is used to create a new record in the database
    try {
      const payload = { ...data, materialRecipe: undefined };
      const newProduct = await this.prisma.product.create({ data: payload });
      for (const recipe of data.materialRecipe) {
        await this.prisma.materialRecipe.create({
          data: {
            product_id: newProduct.id,
            material_id: recipe.material_id,
            quantity: recipe.quantity,
          },
        });
      }
      return newProduct;
    } catch (error) {
      this.logger.error(`Error in create: ${error.message}`);
      throw error;
    }
  }

  async getAll(): Promise<Product[]> {
    // The findMany method is used to retrieve all records from the database
    try {
      return await this.prisma.product.findMany({
        include: { type: true, materialRecipe: true },
      });
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
        include: {
          type: true,
          materialRecipe: {
            include: { material: true },
          },
        },
      });
      if (!dbProduct)
        throw new NotFoundException('El producto no fue encontrado.');
      return dbProduct;
    } catch (error) {
      this.logger.error(`Error in getOne: ${error.message}`);
      throw error;
    }
  }

  async decrementForRecipe(product_id, quantity: number) {
    const recipe = await this.prisma.materialRecipe.findMany({
      where: { product_id },
      include: { material: true },
    });
    for (const element of recipe) {
      await this.prisma.material.update({
        where: { id: element.material_id },
        data: { stock: { decrement: element.quantity * quantity } },
      });
    }
    return recipe;
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
      const material = await this.prisma.material.findFirst({
        where: { id: recipe.material_id },
      });
      const recipeComplete: RecipeComplete = {
        data: recipe,
        material: material,
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

  async getAllTypes() {
    try {
      return await this.prisma.productType.findMany();
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async updateType(id: string, value: number): Promise<ProductType> {
    try {
      return await this.prisma.productType.update({
        where: {
          id,
        },
        data: { price: value },
      });
    } catch (error) {
      this.logger.error(error);
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

  async updateStock({ id, stock }: { id: string; stock: number }) {
    return await this.prisma.product.update({
      where: { id },
      data: {
        stock: {
          increment: stock,
        },
      },
    });
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

  // Función para verificar el stock de productos seleccionados mediante ID
  async verifyStocks({ items }: { items: ProductBasic[] }): Promise<boolean> {
    try {
      let stockAvailable: boolean = true;
      for (const i of items) {
        const product = await this.prisma.product.findUnique({
          where: { id: i.id },
        });
        if (product.stock < i.quantity) {
          stockAvailable = false;
          break;
        }
      }
      return stockAvailable;
    } catch (error) {
      throw error;
    }
  }
}
