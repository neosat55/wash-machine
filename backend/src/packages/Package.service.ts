import { Injectable } from '@nestjs/common';
import { PackageRepository } from '../repositories/package.repository';
import { CreatePackageDto, UpdatePackageDto } from './entities/packages.dto';

@Injectable()
export class PackageService {
  constructor(private packageRepository: PackageRepository) {}

  async getPackages() {
    return this.packageRepository.getPackages();
  }

  getCreatePackages() {
    return this.packageRepository.getCreatePackages();
  }

  async getPackagesTotalInfo(ids: number[]) {
    return this.packageRepository.getPackagesTotalData(ids);
  }

  deletePackage(id: number) {
    return this.packageRepository.deletePackage(id);
  }

  addNewPackage(body: CreatePackageDto) {
    return this.packageRepository.addNewPackage(body);
  }

  updatePackage(id: number, updatee: UpdatePackageDto) {
    return this.packageRepository.updatePackage(id, updatee);
  }
}
