import {CorporationCard} from '../../corporation/CorporationCard';
import {Player} from '../../../Player';
import {ResourceType} from '../../../ResourceType';
import {CardName} from '../../../CardName';
import {IResourceCard} from '../../ICard';
import {Card} from '../../Card';
import {CardType} from '../../CardType';
import {CardRenderer} from '../../render/CardRenderer';
import {CardRenderItemSize} from '../../render/CardRenderItemSize';
import {CardRenderDynamicVictoryPoints} from '../../render/CardRenderDynamicVictoryPoints';

export class _Pristar_ extends Card implements CorporationCard, IResourceCard {
  constructor() {
    super({
      name: CardName._PRISTAR_,
      startingMegaCredits: 53,
      resourceType: ResourceType.PRESERVATION,
      cardType: CardType.CORPORATION,

      metadata: {
        cardNumber: 'R07',
        description: 'You start with 53 MC. Decrease your TR 2 steps. 1 VP per preservation resource here.',
        renderData: CardRenderer.builder((b) => {
          // b.br.br.br;
          b.megacredits(53).nbsp.nbsp.minus().tr(2, CardRenderItemSize.SMALL);
          b.corpBox('effect', (ce) => {
            ce.vSpace(CardRenderItemSize.LARGE);
            ce.effect('During production phase, if you did not get TR so far this generation, add one preservation resource here, gain 6 MC and draw one card.', (eb) => {
              eb.tr(1, CardRenderItemSize.SMALL, true).startEffect.preservation(1).megacredits(6).cards(1);
            });
            ce.effect('When triggering the end game requirement, immediatelt draw cards equal to your preservation resource amoutns. ', (eb) => {
              eb.asterix().startEffect.cards(1).slash().preservation(1);
            });
          });
        }),
        victoryPoints: CardRenderDynamicVictoryPoints.preservation(1, 1),
      },
    });
  }

    public resourceCount = 0;

    public setResourceMAx(number: number) {
      this.resourceCount = number;
    }

    public play(player: Player) {
      player.decreaseTerraformRatingSteps(2);
      return undefined;
    }

    public getVictoryPoints(): number {
      return Math.floor(this.resourceCount);
    }

    public onProductionPhase(player: Player) {
      if (!(player.hasIncreasedTerraformRatingThisGeneration)) {
        player.megaCredits += 6;
        player.addResourceTo(this, 1);
        player.drawCard(1);
      }
      return undefined;
    }
}
