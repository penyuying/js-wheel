import { MAX_EXCEED, VISIBLE_RANGE, DEFAULT_ITEM_HEIGHT, BLUR_WIDTH } from './core/constant';

import {warn} from './utils/debug';

import { easing } from './utils/easing';
import { rad2deg } from './utils/rad2deg';

import { isIos } from './utils/browser';
import { EVENT_TYPE } from './utils/eventType';

import { eventModule } from './wheel/event';
/**
 * picker滚轮
 *
 * @param {HTMLElement|String} el 元素
 * @param {Object|undefined} options 选项
 */
function Wheel (el, options) {

}

Wheel.use = function(Fn, options) {
    if (Fn instanceof Function) {
        Fn(Wheel, options);
    } else if (Fn && Fn.default instanceof Function) {
        Fn.default(Wheel, options);
    } else {
        warn('can not resolve the wrapper dom');
    }
};

Wheel.use(eventModule);

Wheel.Version = '1.0.0';

export default Wheel;
export {
    Wheel
};