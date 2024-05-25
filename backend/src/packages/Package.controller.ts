import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { PackageService } from './Package.service';
import { Public } from '../infrastructure/auth/public.decorator';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Result, RolesEnum } from '../types';
import { Roles } from '../infrastructure/auth/roles.decorator';
import { CreatePackageDto, UpdatePackageDto } from './entities/packages.dto';

@ApiTags('Packages')
@Controller('packages')
export class PackageController {
  constructor(private packageService: PackageService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Get('')
  async getPackages() {
    return Result.Ok(await this.packageService.getPackages());
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Get('for-order')
  async getCreatePackages() {
    return Result.Ok(await this.packageService.getCreatePackages());
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('info')
  @ApiBody({ type: Number, isArray: true })
  async getPackagesTotalInfo(@Body() ids: number[]) {
    return Result.Ok(await this.packageService.getPackagesTotalInfo(ids));
  }

  @Delete('/:id')
  @Roles([RolesEnum.ADMIN])
  async deletePackage(@Param('id', new ParseIntPipe()) id: number) {
    return this.packageService.deletePackage(id);
  }

  @Post('create')
  @Roles([RolesEnum.ADMIN])
  async addPackage(@Body() body: CreatePackageDto) {
    return this.packageService.addNewPackage(body);
  }

  @Put('/:id')
  @Roles([RolesEnum.ADMIN])
  async updatePackage(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() body: UpdatePackageDto,
  ) {
    return this.packageService.updatePackage(id, body);
  }
}
