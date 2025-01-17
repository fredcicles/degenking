/**
 * @fileoverview Tests the new ranking system of Dec 2021
 */
const testLib = require('../lib/tester.lib');

const heroRankingEnt = require('../../src/heroes-helpers/hero-ranking.ent');

const hero1 = {
  id: 71052,
  mainClass: 'pirate',
  subClass: 'warrior',
  rarity: 0,
  statBoost2: 'WIS',
};

const hero2 = {
  id: 68846,
  mainClass: 'warrior',
  subClass: 'paladin',
  rarity: 0,
  statBoost2: 'END',
};

const hero3 = {
  id: 65154,
  mainClass: 'warrior',
  subClass: 'warrior',
  rarity: 4,
  statBoost2: 'STR',
};

describe('Ranking Heroes', () => {
  testLib.init();
  describe('Happy Path', () => {
    test('Should return expected ranking for hero 1', () => {
      const rank = heroRankingEnt.getRanking(hero1);
      expect(rank.mining).toEqual(55);
      expect(rank.gardening).toEqual(13);
      expect(rank.foraging).toEqual(26);
      expect(rank.fishing).toEqual(38);
    });
    test('Should return expected ranking for hero 2', () => {
      const rank = heroRankingEnt.getRanking(hero2);
      expect(rank.mining).toEqual(79);
      expect(rank.gardening).toEqual(27);
      expect(rank.foraging).toEqual(21);
      expect(rank.fishing).toEqual(16);
    });
    test('Should return expected ranking for hero 3', () => {
      const rank = heroRankingEnt.getRanking(hero3);
      expect(rank.mining).toEqual(86);
      expect(rank.gardening).toEqual(24);
      expect(rank.foraging).toEqual(39);
      expect(rank.fishing).toEqual(31);
    });
  });
});
