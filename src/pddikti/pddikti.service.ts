import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Axios, AxiosError, AxiosResponse } from 'axios';
import { Observable, catchError, firstValueFrom } from 'rxjs';
import {
  IBaseResponse,
  IDashboardDosenResponse,
  IDashboardMahasiswaResponse,
  IDetailProdi,
} from './interface/pddikti.interface';
import * as fs from 'fs';
import { FileNameShared } from 'shared/file/enum.file';

const jsonLocation: string = 'shared/json/';

@Injectable()
export class PddiktiService {
  constructor(private readonly httpService: HttpService) {}

  async getProfile(): Promise<IBaseResponse> {
    try {
      const rawData = fs.readFileSync(
        jsonLocation + FileNameShared.PROFILE_NAME,
        'utf-8',
      );
      const profile = JSON.parse(rawData);
      return {
        data: profile,
        status: 200,
        message: 'OK',
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async getListProdi(): Promise<IBaseResponse> {
    try {
      const rawData = fs.readFileSync(
        jsonLocation + FileNameShared.LIST_PRODI_NAME,
        'utf-8',
      );
      const profile = JSON.parse(rawData);
      return {
        data: profile,
        status: 200,
        message: 'OK',
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async getDetailProdi(id: string): Promise<IDetailProdi> {
    const apiUrl = `https://api-frontend.kemdikbud.go.id/detail_prodi/${id}/20231`;
    const response = await firstValueFrom(
      this.httpService.get(apiUrl).pipe(
        catchError((error: AxiosError) => {
          throw 'Happened unknown error!';
        }),
      ),
    );
    return {
      data: response?.data,
      status: response?.status,
      message: response?.statusText,
    };
  }

  async getDataGroupingDosen(): Promise<IBaseResponse> {
    const apiUrl =
      'https://api-frontend.kemdikbud.go.id/v2/detail_pt_dosen/MkY2OURCQzYtNzA2QS00OEFGLUJFMUMtNDM1QTVBRUVFMDBB';
    const response = await firstValueFrom(
      this.httpService.get(apiUrl).pipe(
        catchError((error: AxiosError) => {
          throw 'Happened unknown error!';
        }),
      ),
    );
    return {
      data: response?.data,
      status: response?.status,
      message: response?.statusText,
    };
  }

  async getDetailDosen(id: string): Promise<IBaseResponse> {
    const apiUrl = `https://api-frontend.kemdikbud.go.id/detail_dosen/${id}`;
    const response = await firstValueFrom(
      this.httpService.get(apiUrl).pipe(
        catchError((error: AxiosError) => {
          throw 'Happened unknown error!';
        }),
      ),
    );
    return {
      data: response?.data,
      status: response?.status,
      message: response?.statusText,
    };
  }

  async getListDosenTI(): Promise<any> {
    try {
      const rawData = fs.readFileSync(
        jsonLocation + FileNameShared.DOSEN_TI_NAME,
        'utf-8',
      );
      const profile = JSON.parse(rawData);
      return {
        data: profile,
        status: 200,
        message: 'OK',
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async getListDosenSI(): Promise<any> {
    try {
      const rawData = fs.readFileSync(
        jsonLocation + FileNameShared.DOSEN_SI_NAME,
        'utf-8',
      );
      const profile = JSON.parse(rawData);
      return {
        data: profile,
        status: 200,
        message: 'OK',
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async getDashboardDosen(): Promise<IDashboardDosenResponse> {
    try {
      const rawData = fs.readFileSync(
        jsonLocation + FileNameShared.SUMMARY_DOSEN_NAME,
        'utf-8',
      );
      const response = JSON.parse(rawData);
      const totalDosen =
        response.tetap.jumlah_dosen_jabatan.series.reduce(
          (total, { data }) => total + data[0],
          0,
        ) +
        response.tidak_tetap.jumlah_dosen_jabatan.series.reduce(
          (total, { data }) => total + data[0],
          0,
        );
      const byJenisKelamin = {
        lakiLaki:
          response.tetap.jumlah_dosen_jenis_kelamin.L +
          response.tidak_tetap.jumlah_dosen_jenis_kelamin.L,
        perempuan:
          response.tetap.jumlah_dosen_jenis_kelamin.P +
          response.tidak_tetap.jumlah_dosen_jenis_kelamin.P,
      };

      const jenjangDosen = this.getResultJenjangDosen(response);
      const jabatanDosen = this.getResultJabatanDosen(response);

      const result = {
        totalDosen,
        byJenisKelamin,
        jenjangDosen,
        jabatanDosen,
      };

      return {
        data: result,
        status: response?.status,
        message: response?.statusText,
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async getDashboardMahasiswa(): Promise<IDashboardMahasiswaResponse> {
    const dataMahasiswa = await this.getListProdi();

    const totalByProdi = {
      SI: dataMahasiswa.data[0].rasio_list[0].mahasiswa as number,
      TI: dataMahasiswa.data[1].rasio_list[0].mahasiswa as number,
    };

    const result = {
      totalMahasiswa: (dataMahasiswa.data[0].rasio_list[0].mahasiswa +
        dataMahasiswa.data[1].rasio_list[0].mahasiswa) as number,
      totalByProdi,
    };

    return { data: result, status: 200, message: 'OK' };
  }

  getResultJenjangDosen(data: any) {
    const jenjangDosen = {};
    for (const seriesItem of data.tetap.jumlah_dosen_jenjang.series) {
      const jenjang = seriesItem.name;
      const jumlah = seriesItem.data[0];

      if (!jenjangDosen[jenjang]) {
        jenjangDosen[jenjang] = jumlah;
      } else {
        jenjangDosen[jenjang] += jumlah;
      }
    }
    for (const seriesItem of data.tidak_tetap.jumlah_dosen_jenjang.series) {
      const jenjang = seriesItem.name;
      const jumlah = seriesItem.data[0];

      if (!jenjangDosen[jenjang]) {
        jenjangDosen[jenjang] = jumlah;
      } else {
        jenjangDosen[jenjang] += jumlah;
      }
    }

    return jenjangDosen;
  }

  getResultJabatanDosen(data: any) {
    const jabatanDosen = {};
    for (const seriesItem of data.tetap.jumlah_dosen_jabatan.series) {
      const jenjang = seriesItem.name;
      const jumlah = seriesItem.data[0];

      if (!jabatanDosen[jenjang]) {
        jabatanDosen[jenjang] = jumlah;
      } else {
        jabatanDosen[jenjang] += jumlah;
      }
    }
    for (const seriesItem of data.tidak_tetap.jumlah_dosen_jabatan.series) {
      const jenjang = seriesItem.name;
      const jumlah = seriesItem.data[0];

      if (!jabatanDosen[jenjang]) {
        jabatanDosen[jenjang] = jumlah;
      } else {
        jabatanDosen[jenjang] += jumlah;
      }
    }

    return jabatanDosen;
  }
}
