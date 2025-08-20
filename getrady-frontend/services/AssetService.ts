import { api } from './api'
import type { Asset } from '../types/asset'

export class AssetService {
  static async list(): Promise<Asset[]> {
    const { data } = await api.get<Asset[]>('/market/assets')
    return data
  }

  static async add(symbol: string, cfg: { maFast:number; maSlow:number; rsiLo:number; rsiHi:number; bbPeriod:number; bbStdDev:number }): Promise<Asset> {
    const { data } = await api.post<Asset>('/assets', { symbol, ...cfg });
    return data;
  }

  static async updateCfg(id:number, cfg:{ maFast:number; maSlow:number; rsiLo:number; rsiHi:number; bbPeriod:number; bbStdDev:number}){
    await api.patch(`/assets/${id}/cfg`, cfg);
  }

  static async delete(id: number): Promise<void> {
    await api.delete('/assets/' + id);
  }
}