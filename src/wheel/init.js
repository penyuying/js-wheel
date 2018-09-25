
import { extend } from '../utils/utils';

import { DEFAULT_OPTIONS } from './defaultConfig';

import { MAX_EXCEED, VISIBLE_RANGE, DEFAULT_ITEM_HEIGHT, DEFAULT_ITEM_WIDTH } from './constant';
import { isIos } from '../utils/browser';

import { prefixStyle } from '../utils/prefixStyle';

/**
 * 初始化模块
 *
 * @export
 * @param {Function} Wheel 构造函数
 */
export function initModule(Wheel) {
    /**
     * 刷新
     *
     */
    Wheel.prototype.refresh = function () {
        let _that = this;
        let _options = _that._options;
        let index = _that.index;
        let direction = _that._options.direction || 'vertical';

        _that._resetItems();

        let _elItems = _that._elItems;

        // 轮的高度
        _that.height = _that._el.offsetHeight;
        _that.width = _that._el.offsetWidth;

        let sizeParam;
        let defaultSize;

         // 半径
        if (direction == 'horizontal') {
            _that.r = _that.width / 2 - _options.blurWidth;
            defaultSize = DEFAULT_ITEM_WIDTH;
            sizeParam = 'Width';
        } else if (direction == 'vertical' || !direction) {
            _that.r = _that.height / 2 - _options.blurWidth;
            defaultSize = DEFAULT_ITEM_HEIGHT;
            sizeParam = 'Height';
        }

        // 直径
        _that.d = _that.r * 2;

        // 列表项的高度
        _that.itemSize = _options['item' + sizeParam] || (_elItems && _elItems.length > 0 ? _elItems[0]['offset' + sizeParam] : defaultSize);

        // 每项旋转的角度
        _that.itemAngle = parseInt(_that._calcAngle(_that.itemSize * 0.8));

        // 高亮项的角度
        _that.hightlightRange = _that.itemAngle / 2;

        // 可视角度
        _that.visibleRange = VISIBLE_RANGE;

        // 轮的开始角度
        _that.beginAngle = 0;

        // 超过的角度
        _that.beginExceed = _that.beginAngle - MAX_EXCEED;

        // 轮当前的角度
        _that._angle = _that.beginAngle;

        if (isIos) { // ios设置旋转的中心轴
            _that._wheelEl.style[prefixStyle('transformOrigin')] = 'center center ' + _that.r + 'px';
        }

        _that._calcElementItemPostion(true);

        // 设置默认项
        index > 0 && _that.wheelTo(index);
    };

    /**
     * 初始化
     *
     * @param {HTMLElement} el 元素节点
     * @param {Object} options 选项
     */
    Wheel.prototype._init = function (el, options) {
        let _that = this;
        let _options = _that._initOptions(options);
        _that._initEl(el);
        _that.refresh();
        _that.index = _options.selectedIndex || 0;
        _that.index > 0 && _that.wheelTo(_that.index);
    };
    /**
     * 初始化选项
     *
     * @param {Object} options 选项
     * @returns {Object}
     */
    Wheel.prototype._initOptions = function (options) {
        let _that = this;
        _that._options = extend({}, DEFAULT_OPTIONS, options);
        return _that._options;
    };
}