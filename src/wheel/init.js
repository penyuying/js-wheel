
import { extend } from '../utils/utils';

import { DEFAULT_OPTIONS } from './defaultConfig';

import { MAX_EXCEED, VISIBLE_RANGE, DEFAULT_ITEM_HEIGHT, BLUR_WIDTH } from './constant';
import { isIos } from '../utils/browser';

import { prefixStyle } from '../utils/prefixStyle';

/**
 * 初始化模块
 *
 * @export
 * @param {Function} Wheel 构造函数
 */
export function initModule(Wheel) {
    Wheel.prototype.refresh = function () {
        let _that = this;
        let index = _that.getSelectedIndex();
        _that._resetItems();
        _that.height = _that._el.offsetHeight;
        _that.r = _that.height / 2 - BLUR_WIDTH;
        _that.d = _that.r * 2;
        _that.itemHeight = _that._elItems.length > 0 ? _that._elItems[0].offsetHeight : DEFAULT_ITEM_HEIGHT;
        _that.itemAngle = parseInt(_that._calcAngle(_that.itemHeight * 0.8));
        _that.hightlightRange = _that.itemAngle / 2;
        _that.visibleRange = VISIBLE_RANGE;
        _that.beginAngle = 0;
        _that.beginExceed = _that.beginAngle - MAX_EXCEED;
        _that._angle = _that.beginAngle;
        if (isIos) {
            _that._wheelEl.style[prefixStyle('transformOrigin')] = 'center center ' + _that.r + 'px';
        }
        _that._calcElementItemPostion(true);
        _that.wheelTo(index);
    };

    /**
     * 初始化
     *
     * @param {HTMLElement} el 元素节点
     * @param {Object} options 选项
     */
    Wheel.prototype._init = function (el, options) {
        let _that = this;
        _that._initOptions(options);
        _that._initEl(el);
        _that.refresh();
    };

    Wheel.prototype._initOptions = function (options) {
        let _that = this;
        _that._options = extend({}, DEFAULT_OPTIONS, options);
        return _that._options;
    };
}