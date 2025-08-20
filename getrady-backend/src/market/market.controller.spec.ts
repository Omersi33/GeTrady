import { Test, TestingModule } from '@nestjs/testing';
import { MarketController } from './market.controller';
import { MarketService } from './market.service';
import { BadRequestException } from '@nestjs/common';

describe('MarketController', () => {
  let controller: MarketController;
  const market = {
    getAssetSignal: jest.fn(),
    advise: jest.fn(),
    listAllAssets: jest.fn(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MarketController],
      providers: [{ provide: MarketService, useValue: market }],
    }).compile();

    controller = module.get(MarketController);
  });

  it('getAssetSignal lève si symbol manquant', async () => {
    await expect(controller.getAssetSignal(undefined as any)).rejects.toThrow(BadRequestException);
  });

  it('getAssetSignal appelle le service avec le symbol', async () => {
    market.getAssetSignal.mockResolvedValue({ advice: 'WAIT' });
    const res = await controller.getAssetSignal('btc/usd');
    expect(market.getAssetSignal).toHaveBeenCalledWith('btc/usd');
    expect(res).toEqual({ advice: 'WAIT' });
  });

  it('advise relaie au service', async () => {
    market.advise.mockResolvedValue({ advice: 'BUY' });
    const res = await controller.quote('eth/usd');
    expect(market.advise).toHaveBeenCalledWith('eth/usd');
    expect(res).toEqual({ advice: 'BUY' });
  });

  it('assets renvoie la liste', async () => {
    market.listAllAssets.mockResolvedValue([{ id: 1 }]);
    const res = await controller.findAssets();
    expect(res).toEqual([{ id: 1 }]);
  });
});