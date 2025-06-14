// 引入所有的lua模块
require('aeslua');
require('decrypt');
require('json');
require('md5');
require('popups');

// 引入所有THD的lua模块
if (IsServer()) {
    require('../util/util');
    require('../util/constants');
    require('../util/container');
    require('../util/damage');
    require('../util/stun');
    require('../util/pauseunit');
    require('../util/silence');
    require('../util/magic_immune');
    require('../util/mode_select');
    require('../util/timer');
    // 使用框架自带的timers
    require('timers');
    // require('../util/timers')
    require('../util/util');
    require('../util/disarmed');
    require('../util/invulnerable');
    require('../util/graveunit');
    require('../util/collision');
    require('../util/nodamage');
    require('../util/CheckItemModifies');
    require('../util/performattack');
    require('../util/create_illusion');
    require('../lib/selection');
    require('../components/modifiers/init');
    require('../lib/libraries_init');
    // clothes
    require('../util/specialmode');
    require('../util/clothes');
    require('../util/eventregister');
    require('../util/observe');
    require('../util/rune_fixer');
    require('../util/neutral_spawner_fixer');
    require('../util/charge_manager');
    require('../util/webapi');
    require('../util/shuffle');
    require('../util/urd');
    require('../util/super_siege');
    require('../util/thd_wheel');
    require('../util/thd_secondary_ability');
    require('../util/camerayaw');
    require('../util/skill_change');
    require('../util/mushroom');
    require('../util/heroselectoverlay');
    require('../util/occult_ball');
    require('../util/notifications');
}

// rename SHA and make it global
globalThis.SHA = require('sha');
globalThis.LibDeflate = require('libs/deflate');
globalThis.base64 = require('libs/base64');
