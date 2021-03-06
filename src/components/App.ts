import {GameEnd} from './GameEnd';
import {CreateGameForm} from './CreateGameForm';
import {GameHome} from './GameHome';
import {GamesOverview} from './GamesOverview';
import {PlayerHome} from './PlayerHome';
import {SpectatorHome} from './SpectatorHome';
import {PlayerModel} from '../models/PlayerModel';
import {StartScreen} from './StartScreen';
import {LoadGameForm} from './LoadGameForm';
import {DebugUI} from './DebugUI';
import {GameHomeModel} from '../models/GameHomeModel';
import {Help} from './help/Help';

import {$t} from '../directives/i18n';

import * as constants from '../constants';
import * as raw_settings from '../genfiles/settings.json';

const dialogPolyfill = require('dialog-polyfill');


import {Login} from './Login';
import {Register} from './Register';
import {MyGames} from './MyGames';
import {Donate} from './Donate';
import {PreferencesManager} from './PreferencesManager';

function getDay() {
  return new Date(new Date().getTime()+8*60*60*1000).toISOString().slice(0, 10).replace('T', ' ');
}

interface MainAppData {
    screen: string;
    /**
     * We set player once the app component has loaded. Vue only
     * watches properties that exist initially. When we
     * use this property we can't trigger vue state without
     * a refactor.
     */
    player?: PlayerModel;
    playerkey: number;
    settings: typeof raw_settings;
    isServerSideRequestInProgress: boolean;
    componentsVisibility: {[x: string]: boolean};
    game: GameHomeModel | undefined;
}

export const mainAppSettings = {
  'el': '#app',
  'data': {
    screen: 'empty',
    playerkey: 0,
    settings: raw_settings,
    isServerSideRequestInProgress: false,
    componentsVisibility: {
      'millestones_list': true,
      'awards_list': true,
      'tags_concise': false,
      'pinned_player_0': false,
      'pinned_player_1': false,
      'pinned_player_2': false,
      'pinned_player_3': false,
      'pinned_player_4': false,
      'turmoil_parties': false,
    } as {[x: string]: boolean},
    game: undefined as GameHomeModel | undefined,
    isvip: true, // ?????????????????????isvip, ??????????????????????????????????????????vip
    oscreen: 'empty', // ??????????????????????????????
    logPaused: false,
  } as MainAppData,
  'components': {
    'start-screen': StartScreen,
    'create-game-form': CreateGameForm,
    'load-game-form': LoadGameForm,
    'game-home': GameHome,
    'player-home': PlayerHome,
    'spectator-home': SpectatorHome,
    'player-end': GameEnd,
    'games-overview': GamesOverview,
    'debug-ui': DebugUI,
    'help': Help,
    'login': Login,
    'register': Register,
    'my-games': MyGames,
    'donate': Donate,
  },
  'methods': {
    showAlert: function(message: string, cb: () => void = () => {}): void {
      const dialogElement: HTMLElement | null = document.getElementById('alert-dialog');
      const buttonElement: HTMLElement | null = document.getElementById('alert-dialog-button');
      const messageElement: HTMLElement | null = document.getElementById('alert-dialog-message');
      if (buttonElement !== null && messageElement !== null && dialogElement !== null && (dialogElement as HTMLDialogElement).showModal !== undefined) {
        messageElement.innerHTML = $t(message);
        const handler = () => {
          buttonElement.removeEventListener('click', handler);
          cb();
        };
        buttonElement.addEventListener('click', handler);
        (dialogElement as HTMLDialogElement).showModal();
      } else {
        alert(message);
        cb();
      }
    },
    setVisibilityState: function(targetVar: string, isVisible: boolean) {
      if (isVisible === this.getVisibilityState(targetVar)) return;
      (this as unknown as typeof mainAppSettings.data).componentsVisibility[targetVar] = isVisible;
    },
    getVisibilityState: function(targetVar: string): boolean {
      return (this as unknown as typeof mainAppSettings.data).componentsVisibility[targetVar] ? true : false;
    },
    updatePlayer: function() {
      const currentPathname: string = window.location.pathname;
      const xhr = new XMLHttpRequest();
      const app = this as unknown as typeof mainAppSettings.data;

      const userId = PreferencesManager.loadValue('userId');
      let url = '/api/player' + window.location.search.replace('&noredirect', '');
      if (userId.length > 0) {
        url += '&userId=' + userId;
      }
      xhr.open('GET', url);
      xhr.onerror = function() {
        alert('Error getting game data');
      };
      xhr.onload = () => {
        if (xhr.status === 200) {
          const scrollablePanel = document.getElementById('logpanel-scrollable');
          if (scrollablePanel !== null) {
            // ??????????????????????????? ?????????????????????
            if (scrollablePanel.scrollTop > scrollablePanel.scrollHeight - scrollablePanel.clientHeight - 10) {
              (window as any).logScrollTop = -1;
            } else {
              (window as any).logScrollTop = scrollablePanel.scrollTop;
            }
          }

          app.player = xhr.response as PlayerModel;
          app.playerkey++;
          if (
            app.player.phase === 'end' &&
                        window.location.search.includes('&noredirect') === false
          ) {
            app.screen = 'the-end';
            if (currentPathname !== '/the-end') {
              window.history.replaceState(
                xhr.response,
                `${constants.APP_NAME} - Player`,
                '/the-end?id=' + app.player.id,
              );
            }
          } else {
            app.screen = 'player-home';
            if (currentPathname !== '/player') {
              window.history.replaceState(
                xhr.response,
                `${constants.APP_NAME} - Game`,
                '/player?id=' + app.player.id,
              );
            }
          }
        } else {
          alert('Unexpected server response');
        }
      };
      xhr.responseType = 'json';
      xhr.send();
    },
    udpatevip: function(userId : string) {
      const app = (this as any);
      const vip = PreferencesManager.loadValue('vip');
      // let vipupdate = PreferencesManager.loadValue("vipupdate");
      // ??????????????????vip
      // if(vipupdate < getDay()){
      const xhr = new XMLHttpRequest();
      xhr.open('GET', '/api/isvip?userId='+ userId );
      xhr.onerror = function() {
        alert('Error getting game data');
      };
      xhr.onload = () => {
        if (xhr.status === 200) {
          const resp = xhr.response;
          if (resp === 'success') {
            app.isvip = true;
            PreferencesManager.saveValue('vip', 'true');
          } else {
            app.isvip = true;
            PreferencesManager.saveValue('vip', 'false');
            app.showdonate();// ????????????id?????????vip?????????????????????????????????
          }
        } else {
          app.isvip = true;
          PreferencesManager.saveValue('vip', 'false');
        }
        PreferencesManager.saveValue('vipupdate', getDay());
      };
      xhr.send();
      // }
      if (vip && vip === 'true') {
        app.isvip = true;
      }
    },
    showdonate: function() {
      const app = (this as any);
      const r = Math.random() * 10 > 9;// 10?????????????????????
      const d = PreferencesManager.loadValue('donateupdate');
      const threeday = new Date().getTime() - 3*24*3600000;// ???3???????????????
      if (d < threeday.toString() && r && app.screen !== 'donate' && app.screen !== 'start-screen' && !app.isvip ) {
        app.oscreen = app.screen;
        app.screen = 'donate';
        PreferencesManager.saveValue('donateupdate', new Date().getTime().toString());
      }
    },
  },
  'mounted': function() {
    document.title = constants.APP_NAME;
    dialogPolyfill.default.registerDialog(document.getElementById('alert-dialog'));
    const currentPathname: string = window.location.pathname;
    const app = this as unknown as (typeof mainAppSettings.data) & (typeof mainAppSettings.methods);
    const userId = PreferencesManager.loadValue('userId');
    if (userId !== '') {
      if (currentPathname === '/') {// ??????????????????vip
        PreferencesManager.saveValue('vipupdate', '');
      }
      app.udpatevip(userId);
    }

    if (currentPathname === '/player' || currentPathname === '/the-end') {
      app.updatePlayer();
    } else if (currentPathname === '/game') {
      app.screen = 'game-home';
      const xhr = new XMLHttpRequest();
      xhr.open('GET', '/api/game' + window.location.search+'&userId='+ userId );
      xhr.onerror = function() {
        alert('Error getting game data');
      };
      xhr.onload = () => {
        if (xhr.status === 200) {
          window.history.replaceState(
            xhr.response,
            `${constants.APP_NAME} - Game`,
            '/game?id=' + xhr.response.id,
          );
          app.game = xhr.response as GameHomeModel;
        } else {
          alert('Unexpected server response');
        }
      };
      xhr.responseType = 'json';
      xhr.send();
    } else if (currentPathname === '/games-overview') {
      app.screen = 'games-overview';
    } else if (
      currentPathname === '/new-game' || currentPathname === '/solo'
    ) {
      app.screen = 'create-game-form';
    } else if (currentPathname === '/load') {
      app.screen = 'load';
    } else if (currentPathname === '/debug-ui' || currentPathname === '/cards') {
      app.screen = 'cards';
    } else if (currentPathname === '/help') {
      app.screen = 'help';
    } else if (currentPathname === '/spectator') {
      app.screen = 'spectator-home';
    } else if (currentPathname === '/login') {
      app.screen = 'login';
    } else if (currentPathname === '/register') {
      app.screen = 'register';
    } else if (currentPathname === '/mygames') {
      app.screen = 'my-games';
    } else if (currentPathname === '/donate') {
      app.screen = 'donate';
    } else {
      app.screen = 'start-screen';
    }

    if (userId === '') {// ????????????id???  ????????????????????????
      app.showdonate();
    }
  },
};
