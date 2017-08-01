
import { warn } from '../utils/debug';
import { MAX_EXCEED } from './constant';
import { prefixStyle } from '../utils/prefixStyle';
/**
 * 初始化模块
 *
 * @export
 * @param {Function} Wheel 构造函数
 */
export function domModule(Wheel) {
    Wheel.prototype._initEl = function (el) {
        let _that = this;
        let _options = _that._options;
        _that._el = el;
        let _wheelEl = _that._wheelEl = _that._getElements(_options.wheelEl, el)[0];
        if (_wheelEl) {
            let _elItems = _that._getElements(_options.wheelItemEl, _wheelEl);
            if (_elItems && _elItems.length > 0) {
                _that._elItems = _elItems;
                _that.refresh();
                _that._bindEvent();
            } else {
                warn('can not resolve the wheelItem dom');
            }
        } else {
            warn('can not resolve the wheel dom');
        }
    };
    /**
     * 获取元素列表
     *
     * @param {any} el 元素列表、元素标签名称、class名称或空
     * @param {any} [pEl=document] 父节点
     * @returns {Elements} 元素列表
     */
    Wheel.prototype._getElements = function(el, pEl = document) {
        let _el;
        if (el) {
            _el = typeof el === 'string' ? pEl.querySelectorAll(el) : el;
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

    Wheel.prototype._calcElementItemPostion = function (andGenerateItms) { // 设置列表项的角度
        let _that = this;
        // if (andGenerateItms) {
        //     _that.items = [];
        // }
        _that._elItems.forEach(function (item, index) {
            // let index = _that._elItems.indexOf(item);
            _that.endAngle = _that.itemAngle * index;
            item._index = index;
            item.angle = _that.endAngle;
            item.style[prefixStyle('transformOrigin')] = 'center center -' + _that.r + 'px';
            item.style[prefixStyle('transform')] = 'translateZ(' + _that.r + 'px) rotateX(' + (-_that.endAngle) + 'deg)';
            // if (andGenerateItms) {
            //     let dataItem = {};
            //     dataItem.text = item.innerHTML || '';
            //     dataItem.value = item.getAttribute('data-value') || dataItem.text;
            //     _that.items.push(dataItem);
            // }
        });
        _that.endExceed = _that.endAngle + MAX_EXCEED;
        _that._setItemVisibility(_that.beginAngle);
    };
}