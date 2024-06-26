import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosError } from 'axios';
import * as fs from 'fs';
import { catchError, firstValueFrom } from 'rxjs';
import { IBase, IBaseResponse } from 'src/pddikti/interface/pddikti.interface';
import { TypeGetData } from './enum/data.enum';
import { FileNameShared } from 'shared/file/enum.file';

@Injectable()
export class DataService {
  constructor(private readonly httpService: HttpService) {}

  async getData(type: TypeGetData): Promise<IBase> {
    switch (type) {
      case TypeGetData.PROFILE:
        return this.getProfile();
      case TypeGetData.LIST_PRODI:
        return this.getListProdi();
      case TypeGetData.SUMMARY_DOSEN:
        return this.getSummaryDosen();
      case TypeGetData.DOSEN_TI:
        return this.getListDosenTi();
      case TypeGetData.DOSEN_SI:
        return this.getListDosenSi();
      default:
        throw new Error('Type tidak valid');
    }
  }

  async getProfile(): Promise<IBaseResponse> {
    const apiUrl =
      'https://api-frontend.kemdikbud.go.id/v2/detail_pt/MkY2OURCQzYtNzA2QS00OEFGLUJFMUMtNDM1QTVBRUVFMDBB';
    const response = await firstValueFrom(
      this.httpService.get(apiUrl).pipe(
        catchError((error: AxiosError) => {
          throw 'Happened unknown error!';
        }),
      ),
    );
    this.saveData(TypeGetData.PROFILE, response.data);
    return {
      data: response?.data,
      status: response?.status,
      message: response?.statusText,
    };
  }

  async getListProdi(): Promise<IBaseResponse> {
    const apiUrl =
      'https://api-frontend.kemdikbud.go.id/v2/detail_pt_prodi/MkY2OURCQzYtNzA2QS00OEFGLUJFMUMtNDM1QTVBRUVFMDBB';
    const response = await firstValueFrom(
      this.httpService.get(apiUrl).pipe(
        catchError((error: AxiosError) => {
          throw 'Happened unknown error!';
        }),
      ),
    );
    this.saveData(TypeGetData.LIST_PRODI, response.data);
    return {
      data: response?.data,
      status: response?.status,
      message: response?.statusText,
    };
  }

  async getSummaryDosen(): Promise<IBaseResponse> {
    const apiUrl =
      'https://api-frontend.kemdikbud.go.id/v2/detail_pt_dosen/MkY2OURCQzYtNzA2QS00OEFGLUJFMUMtNDM1QTVBRUVFMDBB';
    const response = await firstValueFrom(
      this.httpService.get(apiUrl).pipe(
        catchError((error: AxiosError) => {
          throw 'Happened unknown error!';
        }),
      ),
    );
    this.saveData(TypeGetData.SUMMARY_DOSEN, response.data);
    return {
      data: response?.data,
      status: response?.status,
      message: response?.statusText,
    };
  }

  async getListDosenTi(): Promise<IBaseResponse> {
    const apiUrl =
      'https://api-frontend.kemdikbud.go.id/detail_prodi/M0IwNkM4NkQtM0I0Ny00RTdCLUFDNEMtOUU3ODcxRkJCNkIx/20231';
    const response = await firstValueFrom(
      this.httpService.get(apiUrl).pipe(
        catchError((error: AxiosError) => {
          throw 'Happened unknown error!';
        }),
      ),
    );
    this.saveData(TypeGetData.DOSEN_TI, response.data);
    return {
      data: response?.data,
      status: response?.status,
      message: response?.statusText,
    };
  }

  async getListDosenSi(): Promise<IBaseResponse> {
    const apiUrl =
      'https://api-frontend.kemdikbud.go.id/detail_prodi/Qjc5Rjc3QUMtREU3My00QTY1LUI3NkEtRjU3NjY3QjQyNUQ5/20231';
    const response = await firstValueFrom(
      this.httpService.get(apiUrl).pipe(
        catchError((error: AxiosError) => {
          throw 'Happened unknown error!';
        }),
      ),
    );
    this.saveData(TypeGetData.DOSEN_SI, response.data);
    return {
      data: response?.data,
      status: response?.status,
      message: response?.statusText,
    };
  }

  async saveData(type: TypeGetData, body: string) {
    let nameFile: string = '';
    switch (type) {
      case TypeGetData.PROFILE:
        nameFile = FileNameShared.PROFILE_NAME;
        break;
      case TypeGetData.LIST_PRODI:
        nameFile = FileNameShared.LIST_PRODI_NAME;
        break;
      case TypeGetData.SUMMARY_DOSEN:
        nameFile = FileNameShared.SUMMARY_DOSEN_NAME;
        break;
      case TypeGetData.DOSEN_TI:
        nameFile = FileNameShared.DOSEN_TI_NAME;
        break;
      case TypeGetData.DOSEN_SI:
        nameFile = FileNameShared.DOSEN_SI_NAME;
        break;
    }
    try {
      const data = JSON.stringify(body);
      fs.writeFileSync(`shared/json/${nameFile}`, data);
      return { message: 'Data berhasil disimpan' };
    } catch (error) {
      throw new Error('Gagal menyimpan data');
    }
  }
}
