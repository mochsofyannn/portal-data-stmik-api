import { Controller, Get, Param } from '@nestjs/common';
import { PddiktiService } from './pddikti.service';
import { Observable } from 'rxjs';
import { AxiosResponse } from 'axios';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { IBaseResponse } from './interface/pddikti.interface';

@ApiTags('pddikti')
@Controller('pddikti')
export class PddiktiController {
    constructor(private readonly pddiktiService: PddiktiService) {}

    @Get('/profile')
    getProfile(): Promise<IBaseResponse> {
        return this.pddiktiService.getProfile();
    }

    @Get('/prodi')
    getListProdi(): Promise<IBaseResponse> {
        return this.pddiktiService.getListProdi();
    }

    @Get('/prodi/:id')
    @ApiParam({ name: 'id', type: String, description: 'Id Prodi - Get from list prodi' })
    getDetailProdi(@Param('id') id: string): Promise<IBaseResponse> {
        return this.pddiktiService.getDetailProdi(id);
    }

    @Get('/dosen/:id')
    @ApiParam({ name: 'id_reg', type: String, description: 'Id Reg Dosen - Get from detail prodi' })
    getDetailDosen(@Param('id_reg') id_reg: string): Promise<IBaseResponse> {
        return this.pddiktiService.getDetailDosen(id_reg);
    }

}