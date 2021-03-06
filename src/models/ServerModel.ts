import {CardModel} from './CardModel';
import {ColonyModel} from './ColonyModel';
import {Color} from '../Color';
import {Game, GameOptions} from '../Game';
import {GameHomeModel} from './GameHomeModel';
import {ICard} from '../cards/ICard';
import {IProjectCard} from '../cards/IProjectCard';
import {Board} from '../boards/Board';
import {ISpace} from '../boards/ISpace';
import {Player} from '../Player';
import {PlayerInput} from '../PlayerInput';
import {PlayerInputModel} from './PlayerInputModel';
import {PlayerInputTypes} from '../PlayerInputTypes';
import {PlayerModel} from './PlayerModel';
import {SelectAmount} from '../inputs/SelectAmount';
import {SelectCard} from '../inputs/SelectCard';
import {SelectHowToPay} from '../inputs/SelectHowToPay';
import {SelectHowToPayForProjectCard} from '../inputs/SelectHowToPayForProjectCard';
import {SelectPlayer} from '../inputs/SelectPlayer';
import {SelectSpace} from '../inputs/SelectSpace';
import {SpaceHighlight, SpaceModel} from './SpaceModel';
import {TileType} from '../TileType';
import {Resources} from '../Resources';
import {CardType} from '../cards/CardType';
import {
  ClaimedMilestoneModel,
  IMilestoneScore,
} from './ClaimedMilestoneModel';
import {FundedAwardModel, IAwardScore} from './FundedAwardModel';
import {
  getTurmoil,
} from './TurmoilModel';
import {SelectDelegate} from '../inputs/SelectDelegate';
import {SelectColony} from '../inputs/SelectColony';
import {SelectProductionToLose} from '../inputs/SelectProductionToLose';
import {ShiftAresGlobalParameters} from '../inputs/ShiftAresGlobalParameters';
import {Colony} from '../colonies/Colony';
import {GameLoader} from '../database/GameLoader';
import {SpectatorModel} from './SpectatorModel';
import {MoonModel} from './MoonModel';
import {Units} from '../Units';
import {OrOptions} from '../inputs/OrOptions';
import {SelectPartyToSendDelegate} from '../inputs/SelectPartyToSendDelegate';
import {IGlobalEvent} from '../turmoil/globalEvents/IGlobalEvent';

export class Server {
  public static getGameModel(game: Game, userId : string = ''): GameHomeModel {
    const user = GameLoader.getInstance().userIdMap.get(userId);
    return {
      activePlayer: game.activePlayer.color,
      id: game.id,
      phase: game.phase,
      players: game.getAllPlayers().map((player) => {
        return {
          id: player.id,
          name: player.name,
          color: player.exited? Color.GRAY : player.color,
        };
      }),
      createtime: game.createtime?.slice(5, 16),
      updatetime: game.updatetime?.slice(5, 16),
      gameAge: game.gameAge,
      saveId: game.lastSaveId,
      rollback: user && user.canRollback(),
      rollbackNum: user && user.getRollbackNum(),
      delete: user && user.canDelete(),
      gameOptions: getGameOptionsAsModel(game.gameOptions),
      lastSoloGeneration: game.lastSoloGeneration(),
      heatFor: game.heatFor,
      breakthrough: game.breakthrough,
    };
  }

  public static getPlayerModel(player: Player, block: boolean): PlayerModel {
    const game = player.game;
    const turmoil = getTurmoil(game);
    try {
      const user = GameLoader.getInstance().userNameMap.get(player.name);
      const userName = user ? user.name : '';
      return {
        actionsTakenThisRound: player.actionsTakenThisRound,
        actionsThisGeneration: Array.from(player.getActionsThisGeneration()),
        aresData: game.aresData,
        availableBlueCardActionCount: player.getAvailableBlueActionCount(),
        awards: getAwards(game),
        cardCost: player.cardCost,
        cardsInHand: block? []:getCards(player, player.cardsInHand, {showNewCost: true}),
        cardsInHandNbr: player.cardsInHand.length,
        citiesCount: player.getCitiesCount(),
        colonies: getColonies(game.colonies),
        coloniesCount: player.getColoniesCount(),
        color: player.color,
        corporationCard: getCorporationCard(player),
        dealtCorporationCards: block? []:getCards(player, player.dealtCorporationCards),
        dealtPreludeCards: block? []:getCards(player, player.dealtPreludeCards),
        dealtProjectCards: block? []:getCards(player, player.dealtProjectCards),
        deckSize: game.dealer.deck.length,
        draftedCards: block? []:getCards(player, player.draftedCards, {showNewCost: true}),
        energy: player.energy,
        energyProduction: player.getProduction(Resources.ENERGY),
        fleetSize: player.getFleetSize(),
        gameAge: game.gameAge,
        gameOptions: getGameOptionsAsModel(game.gameOptions),
        generation: game.getGeneration(),
        heat: player.heat,
        heatProduction: player.getProduction(Resources.HEAT),
        id: player.id,
        influence: turmoil ? game.turmoil!.getPlayerInfluence(player) : 0,
        isActive: player.id === game.activePlayer.id,
        isSoloModeWin: game.isSoloModeWin(),
        lastSoloGeneration: game.lastSoloGeneration(),
        megaCredits: player.megaCredits,
        megaCreditProduction: player.getProduction(Resources.MEGACREDITS),
        milestones: getMilestones(game),
        moon: MoonModel.serialize(game),
        name: player.name,
        noTagsCount: player.getNoTagsCount(),
        oceans: game.board.getOceansOnBoard(),
        oxygenLevel: game.getOxygenLevel(),
        passedPlayers: game.getPassedPlayers(),
        phase: game.phase,
        pickedCorporationCard: block? []:player.pickedCorporationCard ? getCards(player, [player.pickedCorporationCard]) : [],
        plants: player.plants,
        plantProduction: player.getProduction(Resources.PLANTS),
        plantsAreProtected: player.plantsAreProtected(),
        playedCards: getCards(player, player.playedCards, {showResources: true}),
        players: getPlayers(game.getAllPlayers(), game),
        preludeCardsInHand: block? []:getCards(player, player.preludeCardsInHand),
        selfReplicatingRobotsCards: player.getSelfReplicatingRobotsCards(),
        spaces: getSpaces(game.board),
        spectatorId: game.spectatorId,
        steel: player.steel,
        steelProduction: player.getProduction(Resources.STEEL),
        steelValue: player.getSteelValue(),
        tags: player.getAllTags(),
        temperature: game.getTemperature(),
        terraformRating: player.getTerraformRating(),
        timer: player.timer.serialize(),
        titanium: player.titanium,
        titaniumProduction: player.getProduction(Resources.TITANIUM),
        titaniumValue: player.getTitaniumValue(),
        tradesThisGeneration: player.tradesThisGeneration,
        turmoil: turmoil,
        undoCount: game.undoCount,
        venusScaleLevel: game.getVenusScaleLevel(),
        victoryPointsBreakdown: player.getVictoryPoints(),
        waitingFor: block? undefined: getWaitingFor(player, player.getWaitingFor()),
        undoing: player.undoing,
        gameId: game.id,
        block: block,
        canExit: player.canExitFun(game),
        userName: userName,
        exited: player.exited,
      };
    } catch (err) {
      console.warn('error get player', err);
      return { } as PlayerModel;
    }
  }

  public static getSpectatorModel(game: Game): SpectatorModel {
    return {
      generation: game.generation,
    };
  }
}

function getMilestones(game: Game): Array<ClaimedMilestoneModel> {
  const allMilestones = game.milestones;
  const claimedMilestones = game.claimedMilestones;
  const milestoneModels: Array<ClaimedMilestoneModel> = [];

  for (const milestone of allMilestones) {
    const claimed = claimedMilestones.find(
      (m) => m.milestone.name === milestone.name,
    );
    const scores: Array<IMilestoneScore> = [];
    if (claimed === undefined && claimedMilestones.length < 3) {
      game.getPlayers().forEach((player) => {
        scores.push({
          playerColor: player.color,
          playerScore: milestone.getScore(player),
        });
      });
    }

    milestoneModels.push({
      player_name: claimed === undefined ? '' : claimed.player.name,
      player_color: claimed === undefined ? '' : claimed.player.color,
      milestone,
      scores,
    });
  }

  return milestoneModels;
}

function getAwards(game: Game): Array<FundedAwardModel> {
  const allAwards = game.awards;
  const fundedAwards = game.fundedAwards;
  const awardModels: Array<FundedAwardModel> = [];

  for (const award of allAwards) {
    const funded = fundedAwards.find(
      (a) => a.award.name === award.name,
    );
    const scores: Array<IAwardScore> = [];
    if (fundedAwards.length < 3 || funded !== undefined) {
      game.getPlayers().forEach((player) => {
        scores.push({
          playerColor: player.color,
          playerScore: award.getScore(player),
        });
      });
    }

    awardModels.push({
      player_name: funded === undefined ? '' : funded.player.name,
      player_color: funded === undefined ? '' : funded.player.color,
      award,
      scores: scores,
    });
  }

  return awardModels;
}

function getCorporationCard(player: Player): CardModel | undefined {
  if (player.corporationCard === undefined) return undefined;
  return {
    name: player.corporationCard.name,
    resources: player.getResourcesOnCard(player.corporationCard),
    cardType: CardType.CORPORATION,
    isDisabled: player.corporationCard.isDisabled,
    warning: player.corporationCard.warning,
    discount: player.corporationCard.cardDiscount,
  } as CardModel;
}

function getWaitingFor(
  player: Player,
  waitingFor: PlayerInput | undefined,
): PlayerInputModel | undefined {
  if (waitingFor === undefined) {
    return undefined;
  }
  const playerInputModel: PlayerInputModel = {
    id: undefined,
    title: waitingFor.title,
    buttonLabel: waitingFor.buttonLabel,
    inputType: waitingFor.inputType,
    amount: undefined,
    options: undefined,
    cards: undefined,
    maxCardsToSelect: undefined,
    minCardsToSelect: undefined,
    canUseSteel: undefined,
    canUseTitanium: undefined,
    canUseHeat: undefined,
    players: undefined,
    availableSpaces: undefined,
    min: undefined,
    max: undefined,
    microbes: undefined,
    floaters: undefined,
    coloniesModel: undefined,
    payProduction: undefined,
    aresData: undefined,
    selectBlueCardAction: false,
    availableParties: undefined,
    turmoil: undefined,
    globalEventCards: undefined,
  };
  if (waitingFor instanceof OrOptions) {
    playerInputModel.id = (waitingFor as OrOptions).id;
  }
  switch (waitingFor.inputType) {
  case PlayerInputTypes.AND_OPTIONS:
  case PlayerInputTypes.OR_OPTIONS:
  case PlayerInputTypes.SELECT_INITIAL_CARDS:
    playerInputModel.options = [];
    if (waitingFor.options !== undefined) {
      for (const option of waitingFor.options) {
        const subOption = getWaitingFor(player, option);
        if (subOption !== undefined) {
          playerInputModel.options.push(subOption);
        }
      }
    } else {
      throw new Error('required options not defined');
    }
    break;
  case PlayerInputTypes.SELECT_HOW_TO_PAY_FOR_PROJECT_CARD:
    const shtpfpc: SelectHowToPayForProjectCard = waitingFor as SelectHowToPayForProjectCard;
    playerInputModel.cards = getCards(player, shtpfpc.cards, {showNewCost: true, reserveUnits: shtpfpc.reserveUnits});
    playerInputModel.microbes = shtpfpc.microbes;
    playerInputModel.floaters = shtpfpc.floaters;
    playerInputModel.canUseHeat = shtpfpc.canUseHeat;
    break;
  case PlayerInputTypes.SELECT_CARD:
    const selectCard = waitingFor as SelectCard<ICard>;
    playerInputModel.cards = getCards(player, selectCard.cards, {
      showNewCost: !selectCard.played,
      showResources: selectCard.played,
      enabled: selectCard.enabled,
    });
    playerInputModel.maxCardsToSelect = selectCard.maxCardsToSelect;
    playerInputModel.minCardsToSelect = selectCard.minCardsToSelect;
    playerInputModel.showOnlyInLearnerMode = selectCard.enabled?.every((p: boolean) => p === false);
    playerInputModel.selectBlueCardAction = selectCard.selectBlueCardAction;
    if (selectCard.showOwner) {
      playerInputModel.showOwner = true;
    }
    break;

  case PlayerInputTypes.SELECT_GLOBAL_CARD:
    const selectEventCard = waitingFor as SelectCard<IGlobalEvent>;

    playerInputModel.globalEventCards = selectEventCard.cards;
    playerInputModel.maxCardsToSelect = selectEventCard.maxCardsToSelect;
    playerInputModel.minCardsToSelect = selectEventCard.minCardsToSelect;
    break;
  case PlayerInputTypes.SELECT_COLONY:
    playerInputModel.coloniesModel = (waitingFor as SelectColony).coloniesModel;
    break;
  case PlayerInputTypes.SELECT_HOW_TO_PAY:
    playerInputModel.amount = (waitingFor as SelectHowToPay).amount;
    playerInputModel.canUseSteel = (waitingFor as SelectHowToPay).canUseSteel;
    playerInputModel.canUseTitanium = (waitingFor as SelectHowToPay).canUseTitanium;
    playerInputModel.canUseHeat = (waitingFor as SelectHowToPay).canUseHeat;
    break;
  case PlayerInputTypes.SELECT_PLAYER:
    playerInputModel.players = (waitingFor as SelectPlayer).players.map(
      (player) => player.id,
    );
    break;
  case PlayerInputTypes.SELECT_SPACE:
    playerInputModel.availableSpaces = (waitingFor as SelectSpace).availableSpaces.map(
      (space) => space.id,
    );
    break;
  case PlayerInputTypes.SELECT_AMOUNT:
    playerInputModel.min = (waitingFor as SelectAmount).min;
    playerInputModel.max = (waitingFor as SelectAmount).max;
    break;
  case PlayerInputTypes.SELECT_DELEGATE:
    playerInputModel.players = (waitingFor as SelectDelegate).players.map(
      (player) => {
        if (player === 'NEUTRAL') {
          return 'NEUTRAL';
        } else {
          return player.color;
        }
      },
    );
    break;
  case PlayerInputTypes.SELECT_PARTY_TO_SEND_DELEGATE:
    playerInputModel.availableParties = (waitingFor as SelectPartyToSendDelegate).availableParties;
    if (player.game !== undefined) {
      playerInputModel.turmoil = getTurmoil(player.game);
    }
    break;
  case PlayerInputTypes.SELECT_PRODUCTION_TO_LOSE:
    const _player = (waitingFor as SelectProductionToLose).player;
    playerInputModel.payProduction = {
      cost: (waitingFor as SelectProductionToLose).unitsToLose,
      units: {
        megacredits: _player.getProduction(Resources.MEGACREDITS),
        steel: _player.getProduction(Resources.STEEL),
        titanium: _player.getProduction(Resources.TITANIUM),
        plants: _player.getProduction(Resources.PLANTS),
        energy: _player.getProduction(Resources.ENERGY),
        heat: _player.getProduction(Resources.HEAT),
      },
    };
    break;
  case PlayerInputTypes.SHIFT_ARES_GLOBAL_PARAMETERS:
    playerInputModel.aresData = (waitingFor as ShiftAresGlobalParameters).aresData;
    break;
  }
  return playerInputModel;
}

function getCards(
  player: Player,
  cards: Array<ICard>,
  options: {
    showResources?: boolean,
    showNewCost?: boolean,
    reserveUnits?: Array<Units>,
    enabled?: Array<boolean>, // If provided, then the cards with false in `enabled` are not selectable and grayed out
  } = {},
): Array<CardModel> {
  return cards.map((card, index) => ({
    resources: options.showResources ? player.getResourcesOnCard(card) : undefined,
    resourceType: card.resourceType,
    name: card.name,
    calculatedCost: options.showNewCost ? (card.cost === undefined ? undefined : player.getCardCost(card as IProjectCard)) : card.cost,
    cardType: card.cardType,
    isDisabled: options.enabled?.[index] === false,
    warning: card.warning,
    reserveUnits: options.reserveUnits ? options.reserveUnits[index] : Units.EMPTY,
    bonusResource: (card as IProjectCard).bonusResource,
    discount: card.cardDiscount,
  }));
}

// NOTE: This doesn't return a proper PlayerModel. It returns only a partial one, because
// many of the field's values aren't set. That's why the code needs an "as PlayerModel" at
// the end. Eyuch. Warning, surprises ahead.
function getPlayers(players: Array<Player>, game: Game): Array<PlayerModel> {
  const turmoil = getTurmoil(game);

  return players.map((player) => {
    return {
      color: player.color,
      corporationCard: getCorporationCard(player),
      energy: player.energy,
      energyProduction: player.getProduction(Resources.ENERGY),
      // TODO(kberg): strictly speaking, game options shouldn't be necessary on the
      // individual player level.
      gameOptions: getGameOptionsAsModel(game.gameOptions),
      heat: player.heat,
      heatProduction: player.getProduction(Resources.HEAT),
      id: player.id,
      megaCredits: player.megaCredits,
      megaCreditProduction: player.getProduction(Resources.MEGACREDITS),
      name: player.name,
      phase: game.phase,
      plants: player.plants,
      plantProduction: player.getProduction(Resources.PLANTS),
      plantsAreProtected: player.plantsAreProtected(),
      playedCards: getCards(player, player.playedCards, {showResources: true}),
      cardsInHandNbr: player.cardsInHand.length,
      citiesCount: player.getCitiesCount(),
      coloniesCount: player.getColoniesCount(),
      noTagsCount: player.getNoTagsCount(),
      influence: turmoil ? game.turmoil!.getPlayerInfluence(player) : 0,
      steel: player.steel,
      steelProduction: player.getProduction(Resources.STEEL),
      steelValue: player.getSteelValue(),
      terraformRating: player.getTerraformRating(),
      titanium: player.titanium,
      titaniumProduction: player.getProduction(Resources.TITANIUM),
      titaniumValue: player.getTitaniumValue(),
      victoryPointsBreakdown: player.getVictoryPoints(),
      isActive: player.id === game.activePlayer.id,
      venusScaleLevel: game.getVenusScaleLevel(),
      colonies: getColonies(game.colonies),
      tags: player.getAllTags(),
      actionsThisGeneration: Array.from(
        player.getActionsThisGeneration(),
      ),
      fleetSize: player.getFleetSize(),
      tradesThisGeneration: player.tradesThisGeneration,
      turmoil: turmoil,
      selfReplicatingRobotsCards: player.getSelfReplicatingRobotsCards(),
      waitingFor: getWaitingFor(player, player.getWaitingFor()),
      exited: player.exited,
      actionsTakenThisRound: player.actionsTakenThisRound,
      timer: player.timer.serialize(),
      availableBlueCardActionCount: player.getAvailableBlueActionCount(),
    } as PlayerModel;
  });
}

function getColonies(colonies: Array<Colony>): Array<ColonyModel> {
  return colonies.map(
    (colony): ColonyModel => ({
      colonies: colony.colonies.map(
        (player): Color => player.color,
      ),
      isActive: colony.isActive,
      name: colony.name,
      trackPosition: colony.trackPosition,
      visitor:
          colony.visitor === undefined ?
            undefined :
            colony.visitor.color,
    }),
  );
}

// Oceans can't be owned so they shouldn't have a color associated with them
// Land claim can have a color on a space without a tile
function getColor(space: ISpace): Color | undefined {
  if (
    (space.tile === undefined || space.tile.tileType !== TileType.OCEAN) &&
    space.player !== undefined
  ) {
    return space.player.color;
  }
  if (space.tile?.protectedHazard === true) {
    return Color.BRONZE;
  }
  return undefined;
}

function getSpaces(board: Board): Array<SpaceModel> {
  const volcanicSpaceIds = board.getVolcanicSpaceIds();
  const noctisCitySpaceIds = board.getNoctisCitySpaceIds();

  return board.spaces.map((space) => {
    let highlight: SpaceHighlight = undefined;
    if (volcanicSpaceIds.includes(space.id)) {
      highlight = 'volcanic';
    } else if (noctisCitySpaceIds.includes(space.id)) {
      highlight = 'noctis';
    }
    return {
      x: space.x,
      y: space.y,
      id: space.id,
      bonus: space.bonus,
      spaceType: space.spaceType,
      tileType: space.tile && space.tile.tileType,
      color: getColor(space),
      highlight: highlight,
    };
  });
}

function getGameOptionsAsModel(options: GameOptions): GameOptions {
  return options;
  // return {
  //   aresExtension: options.aresExtension,
  //   boardName: options.boardName,
  //   cardsBlackList: options.cardsBlackList,
  //   coloniesExtension: options.coloniesExtension,
  //   communityCardsOption: options.communityCardsOption,
  //   corporateEra: options.corporateEra,
  //   draftVariant: options.draftVariant,
  //   fastModeOption: options.fastModeOption,
  //   includeVenusMA: options.includeVenusMA,
  //   initialDraftVariant: options.initialDraftVariant,
  //   moonExpansion: options.moonExpansion,
  //   preludeExtension: options.preludeExtension,
  //   promoCardsOption: options.promoCardsOption,
  //   politicalAgendasExtension: options.politicalAgendasExtension,
  //   removeNegativeGlobalEvents: options.removeNegativeGlobalEventsOption,
  //   showOtherPlayersVP: options.showOtherPlayersVP,
  //   showTimers: options.showTimers,
  //   shuffleMapOption: options.shuffleMapOption,
  //   solarPhaseOption: options.solarPhaseOption,
  //   soloTR: options.soloTR,
  //   randomMA: options.randomMA,
  //   turmoilExtension: options.turmoilExtension,
  //   venusNextExtension: options.venusNextExtension,
  //   requiresVenusTrackCompletion: options.requiresVenusTrackCompletion,
  // };
}
