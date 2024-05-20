import { Module } from '@nestjs/common';
import { PackageController } from './Package.controller';
import { PackageService } from './Package.service';
import { PackageRepository } from '../repositories/package.repository';

@Module({
  controllers: [PackageController],
  providers: [PackageService, PackageRepository],
  exports: [PackageService],
})
export class PackageModule {}
