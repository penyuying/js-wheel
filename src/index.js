
import {warn} from './utils/debug';

// import { easing } from './utils/easing';
// import { rad2deg } from './utils/rad2deg';

// import { EVENT_TYPE } from './utils/eventType';

import { eventModule } from './utils/event';

import { domModule } from './wheel/dom';
import { coreModule } from './wheel/core';
import { initModule } from './wheel/init';
/**
 * picker滚轮
 *
 * @param {HTMLElement|String} el 元素
 * @param {Object|undefined} options 选项
 */
function Wheel (el, options) {
    let _that = this;
    // let _el = typeof el === 'string' ? document.querySelector(el) : el;
    el = _that._getElements(el)[0];
    if (!el) {
      warn('can not resolve the wrapper dom');
    } else {
        _that._init(el, options);
    }
}

Wheel.use = function(Fn, options) {
    if (Fn instanceof Function) {
        Fn(Wheel, options);
    } else if (Fn && Fn.default instanceof Function) {
        Fn.default(Wheel, options);
    } else {
        warn('can not resolve the use module');
    }
};

Wheel.use(eventModule);
Wheel.use(domModule);
Wheel.use(coreModule);
Wheel.use(initModule);

Wheel.Version = '1.0.3';

export default Wheel;
export {
    Wheel
};