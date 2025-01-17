/* eslint-disable no-console */
/**
 * @fileoverview Normalizes how Heroes are rendered as a string.
 */

const {
  getStatEmoji,
  getProfessionEmoji,
  getClassPairRanks,
  getProfessionSkills,
  shortenRecessiveGenesClass,
  shortenRecessiveGenesProfession,
} = require('./heroes-helpers.ent');

const { ZERO_ADDRESS } = require('../constants/constants.const');
const { QUESTS_REV } = require('../constants/addresses.const');

/**
 * Renders the hero to its string representation.
 *
 * @param {Object} hero Hero data object.
 * @param {Object=} params Parameters on how to render the hero.
 * @param {boolean} params.cli Set to true to get a CLI rendering.
 * @param {boolean} params.showActivePassive Show active passive genes.
 * @param {boolean} params.showStats Show hero stats.
 * @param {boolean} params.showParents Show hero's parents.
 * @param {boolean} params.showSale Show hero sales information.
 * @param {boolean} params.showQuest Show hero quest information.
 * @param {boolean} params.short Short version.
 * @param {boolean} params.tiny Tiny version.
 * @return {string}
 */
exports.heroToString = (hero, params = {}) => {
  let heroParts = [];
  if (params.tiny) {
    heroParts = exports._getHeroPartsTiny(hero);
  } else {
    heroParts = exports._getHeroParts(hero, params);
  }

  const heroString = exports._renderHeroParts(heroParts, params);
  return heroString;
};

/**
 * Will print heroes in a table with current stats of current rank and current
 * stamina.
 *
 * @param {Array<Object>} heroes Heroes to print.
 */
exports.heroesTableCurrentStats = (heroes) => {
  const rows = exports.heroesCurrentStats(heroes);
  console.table(rows);
};

/**
 * Will return heroes with current stats of current rank and current stamina.
 *
 * @param {Array<Object>} heroes Heroes to print.
 * @return {Array<Object>}
 */
exports.heroesCurrentStats = (heroes) => {
  return heroes.map((hero) => {
    let currentQuest = '-';
    if (hero.currentQuest !== ZERO_ADDRESS) {
      currentQuest = 'yes';
    }

    return {
      id: hero.id,
      Q: currentQuest,
      Sales: hero.onSale,
      P: hero.profession,
      CL: `${hero.mainClass}:${hero.subClass}`,
      G: hero.generation,
      R: hero.rarity,
      L: hero.level,
      XP: hero.xp,
      CR: hero.currentRank,
      Jp100T: hero.estJewelPer100Ticks,
      S: `${hero.stamina}/${hero.currentStamina}`,
    };
  });
};

/**
 * Produce tiny parts of hero.
 *
 * @param {Object} hero Hero data object.
 * @return {Array} An array of hero parts to be rendered.
 * @private
 */
exports._getHeroPartsTiny = (hero) => {
  const profEmoji = getProfessionEmoji(hero.profession);
  const shiny = hero.shiny ? ' Shiny' : '';

  const heroParts = [];
  heroParts.push(['id', hero.id]);
  heroParts.push(`G${hero.generation}${shiny}`);
  heroParts.push(`${profEmoji} ${hero.profession}`);
  heroParts.push(`${hero.mainClass}:${hero.subClass}`);
  heroParts.push(`${hero.rarityStr}`);
  heroParts.push(`${hero.summons}/${hero.maxSummons}`);
  heroParts.push(`L${hero.level}`);

  return heroParts;
};

/**
 * Will produce the needed data parts of a hero to render.
 *
 * @param {Object} hero Hero data object.
 * @param {Object=} params Parameters on how to render the hero.
 * @return {Array} An array of hero parts to be rendered.
 * @private
 */
exports._getHeroParts = (hero, params) => {
  const profEmoji = getProfessionEmoji(hero.profession);
  const ranks = getClassPairRanks(hero);
  const professionSkills = getProfessionSkills(hero);
  const shiny = hero.shiny ? ' Shiny' : '';

  const heroParts = [
    ['Owner', hero.ownerName],
    hero.id,
    `G${hero.generation}${shiny}`,
    `${profEmoji} ${hero.profession}`,
    `${hero.mainClass}:${hero.subClass}`,
  ];

  if (!params.short) {
    heroParts.push(`${hero.rarityStr}(${hero.rarity})`);
    heroParts.push(`${ranks}`);
    heroParts.push(['CR', hero.currentRank]);
    heroParts.push(['JM', hero.estJewelPer100Ticks]);
    heroParts.push([
      'B1',
      `${hero.statBoost1} ${getStatEmoji(hero.statBoost1)}`,
    ]);
    heroParts.push([
      'B2',
      `${hero.statBoost2} ${getStatEmoji(hero.statBoost2)}`,
    ]);
  }

  if (hero.mainClassGenes) {
    heroParts.push(['RGMC', shortenRecessiveGenesClass(hero.mainClassGenes)]);
  }
  if (hero.subClassGenes) {
    heroParts.push(['RGSC', shortenRecessiveGenesClass(hero.subClassGenes)]);
  }
  if (hero.professionGenes) {
    heroParts.push([
      'RGP',
      shortenRecessiveGenesProfession(hero.professionGenes),
    ]);
  }

  heroParts.push(['XP', hero.xp]);
  heroParts.push(['L', hero.level]);
  if (professionSkills) {
    heroParts.push(['PS', professionSkills]);
  } else {
    heroParts.push('No Skills');
  }
  heroParts.push(['MS', hero.maxSummons]);
  heroParts.push(['S', hero.summons]);

  if (params.showActivePassive) {
    heroParts.push(['A1', `${hero?.active1[0]}${hero.active1?.slice(-1)}`]);
    heroParts.push(['A2', `${hero?.active2[0]}${hero.active2?.slice(-1)}`]);
    heroParts.push([`P1`, `${hero?.passive1[0]}${hero.passive1?.slice(-1)}`]);
    heroParts.push([`P2`, `${hero?.passive2[0]}${hero.passive2?.slice(-1)}`]);
  }

  if (params.showStats) {
    heroParts.push([`STR`, hero.strength]);
    heroParts.push([`AGI`, hero.agility]);
    heroParts.push([`INT`, hero.intelligence]);
    heroParts.push([`WIS`, hero.wisdom]);
    heroParts.push([`LCK`, hero.luck]);
    heroParts.push([`VIT`, hero.vitality]);
    heroParts.push([`END`, hero.endurance]);
    heroParts.push([`DEX`, hero.dexterity]);
  }

  if (params.showParents) {
    heroParts.push(['S/A', `${hero.summonerId} / ${hero.assistantId}`]);
  }

  heroParts.push(['STA', `${hero.stamina}/${hero.currentStamina}`]);
  heroParts.push(['HP', hero.hp]);
  heroParts.push(['MP', hero.mp]);

  if (params.showSale) {
    if (hero.onSale) {
      heroParts.push('ON SALE');
      heroParts.push(['AI', hero.auctionId]);
      heroParts.push(['SP', `${hero.startingPriceFormatted}J`]);
      heroParts.push(['EP', `${hero.endingPriceFormatted}J`]);
      heroParts.push(['D', hero.duration]);
    } else {
      heroParts.push('NOT FOR SALE');
    }
  }

  if (params.showQuest) {
    if (hero.currentQuest === ZERO_ADDRESS) {
      heroParts.push('Not Questing');
    } else {
      const questName = QUESTS_REV[hero.currentQuest.toLowerCase()];
      heroParts.push([`Quest`, questName]);
    }
  }

  return heroParts;
};

/**
 * Will render to string the hero parts.
 *
 * @param {Array} heroParts The hero parts to render.
 * @param {Object} params Parameters for rendering.
 * @return {string} Text representation of hero.
 * @private
 */
exports._renderHeroParts = (heroParts, params) => {
  const heroPartsString = heroParts.map((currentPart) => {
    if (Array.isArray(currentPart)) {
      const [label, value] = currentPart;
      return `${exports._applyDiscordBold(label, params.cli)}:${value}`;
    }

    return exports._applyDiscordBold(currentPart, params.cli);
  });

  const heroStr = heroPartsString.join(' - ');
  return heroStr;
};

/**
 * Make a value be bold in discord or just return the value if on CLI mode.
 *
 * @param {string} value The value to bold.
 * @param {boolean} isCli If the value is intended for CLI, do not apply bold.
 * @return {string} The value with bold.
 * @private
 */
exports._applyDiscordBold = (value, isCli) => {
  if (isCli) {
    return value;
  }

  return `**${value}**`;
};
