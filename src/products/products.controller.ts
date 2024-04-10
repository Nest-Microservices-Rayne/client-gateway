import {
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Body,
  Inject,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { PaginationDto } from 'src/common';
import { CreateProductDto } from 'src/products/dto/create-product.dto';
import { UpdateProductDto } from 'src/products/dto/update-product.dto';
import { NATS_SERVICE } from 'src/config';

@Controller('products')
export class ProductsController {
  constructor(@Inject(NATS_SERVICE) private readonly natsClient: ClientProxy) {}

  @Post()
  createProduct(@Body() createProductDto: CreateProductDto) {
    return this.natsClient.send({ cmd: 'create_product' }, createProductDto);
  }

  @Get()
  findAllProducts() {
    return this.natsClient.send({ cmd: 'find_all_paged_products' }, {});
  }

  @Get('paged')
  findAllProductsPaged(@Query() paginationDto: PaginationDto) {
    return this.natsClient.send(
      { cmd: 'find_all_paged_products' },
      paginationDto,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    //With Filter
    /*try {
      const product = await firstValueFrom(
        this.natsClient.send({ cmd: 'find_one_product' }, { id }),
      );
      return product;
    } catch (error) {
      throw new RpcException(error);
    }*/
    return this.natsClient.send({ cmd: 'find_one_product' }, { id }).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @Patch(':id')
  async updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.natsClient
      .send({ cmd: 'update_product' }, { id, ...updateProductDto })
      .pipe(
        catchError((err) => {
          throw new RpcException(err);
        }),
      );
  }

  @Delete(':id')
  deleteProduct(@Param('id', ParseIntPipe) id: number) {
    return this.natsClient.send({ cmd: 'delete_product' }, { id }).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }
}
