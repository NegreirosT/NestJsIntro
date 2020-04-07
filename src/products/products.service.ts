import { Injectable, NotFoundException } from "@nestjs/common";

import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { Product } from './product.model'

@Injectable()

export class ProductsService
{
    //List of products
    private products: Product[] = [];

    constructor(@InjectModel('Product')  private readonly productModel: Model<Product>,
    ) {}

    //Aqui faz a chamada do meu insert de produtos através da url @POST('/products')
    async insertProduct(title: string, desc: string, price: number)
    {
        const newProduct = new this.productModel({
            title, 
            description: desc, 
            price
        });
        const result = await newProduct.save();
        return result.id as string;
    }

    //Metodo *find()* do proprio Mongoose
    async getProducts(){
        const products = await this.productModel.find().exec();
        return products.map((prod) => (
            {
                id: prod.id,
                title: prod.title,
                description: prod.description,
                price: prod.price 
            }));
    }

    async getSingleProduct(productId: string)
    {
        const product = await this.findProduct(productId);
        return {
            id: product.id,
            tilte: product.title,
            description: product.description,
            price: product.price
        };
    }

    async updateProduct(productId: string, title: string, desc: string, price: number)
    {
        const updatedProduct = await this.findProduct(productId);

        if(title)
        {
            updatedProduct.title = title;
        }
        if(desc)
        {
            updatedProduct.description = desc;
        }
        if(price)
        {
            updatedProduct.price = price;
        }
        // npm install --save mongoose @nestjs/mongoose
        updatedProduct.save();
    }

    async deleteProduct(prodId: string)
    {
        await this.productModel.deleteOne({_id: prodId}).exec();
    }

    private async findProduct(id: string): Promise<Product>
    {
        let product;
        try
        {
             product = await this.productModel.findById(id);
        }
        catch(err)
        {
            throw new NotFoundException('Could not find product');
        }

        return product;
    }
}