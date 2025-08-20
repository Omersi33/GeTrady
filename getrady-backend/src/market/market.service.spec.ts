import { Test, TestingModule } from '@nestjs/testing';
import { MarketService } from './market.service';
import { TwelveDataService } from '../integrations/twelvedata/twelvedata.service';
import { StrategyService } from '../integrations/strategy/strategy.service';
import { AssetsService } from '../assets/assets.service';
import { UsersService } from '../users/users.service';
import { NotificationsService } from '../notifications/notifications.service';
import { BadRequestException } from '@nestjs/common';

describe('MarketService', () => {
  let service: MarketService;

  const td = { fetchLivePrice: jest.fn(), getCloses: jest.fn() };
  const strat = { getAdvice: jest.fn() };
  const assets = { getAssetSignal: jest.fn(), upsert: jest.fn(), findAll: jest.fn() };
  const users = { getAllPushTokens: jest.fn() };
  const notif = { sendPush: jest.fn() };

  beforeEach(async () => {
    jest.resetAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MarketService,
        { provide: TwelveDataService, useValue: td },
        { provide: StrategyService, useValue: strat },
        { provide: AssetsService, useValue: assets },
        { provide: UsersService, useValue: users },
        { provide: NotificationsService, useValue: notif },
      ],
    }).compile();

    service = module.get(MarketService);
  });

  it('advise BUY calcule TP/SL, upsert et notifie si changement', async () => {
    strat.getAdvice.mockResolvedValue('BUY');
    td.fetchLivePrice.mockResolvedValue('123');
    assets.getAssetSignal.mockResolvedValue({ advice: 'WAIT', maFast: 10, maSlow: 30, rsiLo: 20, rsiHi: 80, bbPeriod: 18, bbStdDev: 2 });
    users.getAllPushTokens.mockResolvedValue(['tok1', 'tok2']);
    notif.sendPush.mockResolvedValue(undefined);
    assets.upsert.mockResolvedValue(undefined);

    const res = await service.advise('btc/usd');

    expect(res.advice).toBe('BUY');
    expect(res.currentValue).toBe(123);
    expect(res.TP1).toBe(123.37);
    expect(res.TP2).toBe(124.11);
    expect(res.TP3).toBe(125.46);
    expect(res.SL).toBe(122.75);
    expect(res.date instanceof Date).toBe(true);

    expect(assets.upsert).toHaveBeenCalled();
    expect(users.getAllPushTokens).toHaveBeenCalled();
    expect(notif.sendPush).toHaveBeenCalledWith(
      ['tok1', 'tok2'],
      'BTC/USD : BUY',
      expect.stringContaining('BUY'),
      expect.objectContaining({ symbol: 'BTC/USD', advice: 'BUY', price: 123 })
    );
  });

  it('advise SELL utilise la fermeture si le live est invalide et ne notifie pas si pas de changement', async () => {
    strat.getAdvice.mockResolvedValue('SELL');
    td.fetchLivePrice.mockRejectedValue(new Error('live ko'));
    td.getCloses.mockResolvedValue(['nan', '121', '119']);
    assets.getAssetSignal.mockResolvedValue({ advice: 'SELL' });
    assets.upsert.mockResolvedValue(undefined);

    const res = await service.advise('eth/usd');

    expect(res.advice).toBe('SELL');
    expect(res.currentValue).toBe(121);
    expect(res.TP1).toBe(120.64);
    expect(res.TP2).toBe(119.91);
    expect(res.TP3).toBe(118.58);
    expect(res.SL).toBe(121.24);

    expect(assets.upsert).toHaveBeenCalled();
    expect(users.getAllPushTokens).not.toHaveBeenCalled();
    expect(notif.sendPush).not.toHaveBeenCalled();
  });

  it('getAssetSignal renvoie le mapping attendu', async () => {
    const row = {
      lastUpdate: new Date('2025-01-01T00:00:00Z'),
      currentValue: 42,
      advice: 'WAIT',
      TP1: 1, TP2: 2, TP3: 3, SL: 0.5,
      maFast: 8, maSlow: 21, rsiLo: 15, rsiHi: 85, bbPeriod: 20, bbStdDev: 2,
    };
    assets.getAssetSignal.mockResolvedValue(row);

    const res = await service.getAssetSignal('xau/usd');

    expect(res).toEqual({
      date: row.lastUpdate,
      currentValue: 42,
      advice: 'WAIT',
      TP1: 1, TP2: 2, TP3: 3, SL: 0.5,
      maFast: 8, maSlow: 21, rsiLo: 15, rsiHi: 85, bbPeriod: 20, bbStdDev: 2,
    });
  });

  it('getAssetSignal lève si inconnu', async () => {
    assets.getAssetSignal.mockResolvedValue(null);
    await expect(service.getAssetSignal('unknown')).rejects.toThrow(BadRequestException);
  });

  it('listAllAssets mappe les champs', async () => {
    const rows = [
      { id: 1, symbol: 'BTC/USD', lastUpdate: new Date(), currentValue: 10, advice: 'BUY', TP1: 1, TP2: 2, TP3: 3, SL: 4, maFast: 5, maSlow: 6, rsiLo: 7, rsiHi: 8, bbPeriod: 9, bbStdDev: 10 },
      { id: 2, symbol: 'ETH/USD', lastUpdate: new Date(), currentValue: 20, advice: 'SELL', TP1: 1, TP2: 2, TP3: 3, SL: 4, maFast: 5, maSlow: 6, rsiLo: 7, rsiHi: 8, bbPeriod: 9, bbStdDev: 10 },
    ];
    assets.findAll.mockResolvedValue(rows);

    const res = await service.listAllAssets();

    expect(res).toHaveLength(2);
    expect(res[0]).toMatchObject({ id: 1, symbol: 'BTC/USD', advice: 'BUY' });
    expect(res[1]).toMatchObject({ id: 2, symbol: 'ETH/USD', advice: 'SELL' });
  });
});