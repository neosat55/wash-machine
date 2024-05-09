import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller('reports')
@ApiTags('reports')
export class ReportsController {}