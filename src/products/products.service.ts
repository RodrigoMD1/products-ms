import { Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/common';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {

  private readonly logger = new Logger('ProductService')

  onModuleInit() {
    this.$connect();
    this.logger.log('Database connected');

  }


  create(createProductDto: CreateProductDto) {

    return this.product.create({
      data: createProductDto
    });

  }

  // esto de abajo permite buscar todo de la base de datos con la pagination incluido 
  async findAll(paginationDto: PaginationDto) {

    const { page, limit } = paginationDto

    const totalPages = await this.product.count({ where: { available: true } });

    const lastPage = Math.ceil(totalPages / limit);

    return {
      data: await this.product.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: {
          available: true
        }
      }),
      meta: {
        total: totalPages,
        page: page,
        lastPage: lastPage,
      }
    }

  }

  // esto de abajo permite buscar por id 
  async findOne(id: number) {
    const product = await this.product.findFirst({
      where: { id, available: true }
    })

    if (!product) {
      throw new NotFoundException(`Product with id #${id} not found`);
    }
    return product;
  }





  async update(id: number, updateProductDto: UpdateProductDto) {

    await this.findOne(id);


    return this.product.update({
      where: { id },
      data: updateProductDto,
    });

  }




  async remove(id: number) {

    await this.findOne(id);

    // return this.product.delete({
    //   where: { id } });

    // esto de abajo es soft delete envia lo que quiero borrar a que no este available  el otro de arriba solo lo elimina de la base de datos
    const product = await this.product.update({
      where: { id },
      data: {
        available: false
      }
    })

    return product;

  }
}
