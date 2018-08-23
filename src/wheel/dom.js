
// import { warn } from '../utils/debug';
import { MAX_EXCEED } from './constant';
import { prefixStyle } from '../utils/prefixStyle';
/**
 * 初始化模块
 *
 * @export
 * @param {Function} Wheel 构造函数
 */
export function domModule(Wheel) {
    /**
     * 列表
     *
     */
    Wheel.prototype._resetItems = function() {
        let _that = this;
        let _options = _that._options;
        let _wheelEl = _that._wheelEl;
        if (_wheelEl) {
            let _elItems = _that._getElements(_options.wheelItemEl, _wheelEl);
            if (_elItems && _elItems.length > 0) {
                _that._elItems = _elItems;
            }
            // } else {
            //     warn('can not resolve the wheelItem dom');
            // }
        }
        // } else {
        //     warn('can not resolve the wheel dom');
        // }
    };
    /**
     * 初始化轮元素
     *
     * @param {HTMLElement} el 轮的包裹盒子元素
     */
    Wheel.prototype._initEl = function (el) {
        let _that = this;
        let _options = _that._options;
        _that._el = el;
        let _wheelEl = _that._wheelEl = _that._getElements(_options.wheelEl, el)[0];
        if (_wheelEl) {
            _that._bindEvent();
        }
    };
    /**
     * 获取元素列表
     *
     * @param {HTMLElement} el 元素列表、元素标签名称、class名称或空
     * @param {HTMLElement} [pEl=document] 父节点
     * @returns {HTMLElements} 元素列表
     */
    Wheel.prototype._getElements = function(el, pEl = document) {
        let _el;
        if (el) {
            if (typeof el === 'string') {
                _el = pEl.querySelectorAll(el);
            } else if (typeof el.length !== 'number') {
                _el = [el];
            }
        } else if (pEl && pEl !== document && pEl.children && pEl.children.length > 0) {
            _el = pEl.children;
        }
        if (_el && _el.length === 0) {
            _el = undefined;
        }
        if (_el && !(_el instanceof Array) && _el.length < 1) {
            _el = [_el];
        }
        return _el || [];
    };
    /**
     * 设置列表项的角度
     *
     */
    Wheel.prototype._calcElementItemPostion = function () {
        let _that = this;
        let _elItems = _that._elItems;
        if (_elItems && _elItems.length > 0) {
            for (let index = 0; index < _elItems.length; index++) {
                const item = _elItems[index];
                _that.endAngle = _that.itemAngle * index;
                item._index = index;
                item.angle = _that.endAngle;
                item.style[prefixStyle('transformOrigin')] = 'center center -' + _that.r + 'px';
                item.style[prefixStyle('transform')] = 'translateZ(' + _that.r + 'px) rotateX(' + (-_that.endAngle) + 'deg)';
            }
        }
        // _that._elItems.forEach(function (item, index) {
        //     _that.endAngle = _that.itemAngle * index;
        //     item._index = index;
        //     item.angle = _that.endAngle;
        //     item.style[prefixStyle('transformOrigin')] = 'center center -' + _that.r + 'px';
        //     item.style[prefixStyle('transform')] = 'translateZ(' + _that.r + 'px) rotateX(' + (-_that.endAngle) + 'deg)';
        // });

        _that.endExceed = _that.endAngle + MAX_EXCEED;
        _that._setItemVisibility(_that.beginAngle);
    };

    /**
     * 设置可范围内的项显示
     *
     * @param {Number} angle 当前的角度
     */
    Wheel.prototype._setItemVisibility = function (angle) {
        let _that = this;
        let _elItems = _that._elItems;
        let _options = _that._options;
        let activeCls = _options.activeCls;
        let visibleCls = _options.visibleCls;
        if (_elItems && _elItems.length > 0) {
            for (let index = 0; index < _elItems.length; index++) {
                const item = _elItems[index];
                let difference = Math.abs(item.angle - angle);
                if (difference < _that.hightlightRange) {
                    item.classList.add(activeCls);
                } else if (difference < _that.visibleRange) {
                    item.classList.add(visibleCls);
                    item.classList.remove(activeCls);
                } else {
                    item.classList.remove(activeCls);
                    item.classList.remove(visibleCls);
                }
            }
        }
        // _that._elItems.forEach(function (item) {
        //     let difference = Math.abs(item.angle - angle);
        //     if (difference < _that.hightlightRange) {
        //         item.classList.add(activeCls);
        //     } else if (difference < _that.visibleRange) {
        //         item.classList.add(visibleCls);
        //         item.classList.remove(activeCls);
        //     } else {
        //         item.classList.remove(activeCls);
        //         item.classList.remove(visibleCls);
        //     }
        // });
    };
    /**
     * 设置轮的旋转角度
     *
     * @param {Number} angle 角度
     */
    Wheel.prototype._setAngle = function (angle) {
        let _that = this;
        let _options = _that._options;
        _that._angle = angle;
        _that._wheelEl.style[prefixStyle('transform')] = 'perspective(' + _options.perspective + ') rotateY(0deg) rotateX(' + angle + 'deg)';
        _that._setItemVisibility(angle);
    };
}