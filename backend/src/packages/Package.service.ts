import { Injectable } from '@nestjs/common';
import { PackageRepository } from '../repositories/package.repository';

@Injectable()
export class PackageService {
  constructor(private packageRepository: PackageRepository) {}

  async getPackages() {
    return this.packageRepository.getPackages();
  }

  async getPackagesTotalInfo(ids: number[]) {
    return this.packageRepository.getPackagesTotalData(ids);
  }
}
