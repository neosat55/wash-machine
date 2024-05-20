import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { PackageService } from './Package.service';
import { Public } from '../infrastructure/auth/public.decorator';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Result } from '../types';

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
  @Post('info')
  @ApiBody({ type: Number, isArray: true })
  async getPackagesTotalInfo(@Body() ids: number[]) {
    return Result.Ok(await this.packageService.getPackagesTotalInfo(ids));
  }
}
