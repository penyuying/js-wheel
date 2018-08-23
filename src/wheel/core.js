
import { EVENT_TYPE } from '../utils/eventType';
import { rad2deg } from '../utils/rad2deg';
import { prefixStyle } from '../utils/prefixStyle';
import { easing } from '../utils/easing';

/**
 * 初始化模块
 *
 * @export
 * @param {Function} Wheel 构造函数
 */
export function coreModule(Wheel) {
    /**
     * 获取选中的索引
     *
     * @returns {Number}
     */
    Wheel.prototype.getSelectedIndex = function () {
        let _that = this;
        let _options = _that._options;

        let index = parseInt((_that._angle / _that.itemAngle).toFixed(0));
        if (_that._elItems && index > _that._elItems.length - 1) {
            index = _that._elItems.length - 1;
        }
        if (index < 0) {
            index = 0;
        }
        return Math.abs(index) || (_options && parseInt(_options.selectedIndex + '', 10)) || 0;
    };
    /**
     * 转到指定的索引
     *
     * @param {any} index 索引号
     * @param {any} duration （持续时间）动画持续多长时间。
     * @param {any} callback 结束后的回调
     */
    Wheel.prototype.wheelTo = function (index, duration, callback) {
        let _that = this;
        _that._wheelEl.style[prefixStyle('transition')] = '';
        let angle = _that._correctAngle(_that.itemAngle * index);
        if (duration && duration > 0) {
            let distAngle = angle - _that._angle;
            _that._scrollDistAngle(Date.now(), _that._angle, distAngle, duration, callback);
        } else {
            _that._setAngle(angle);
            _that._triggerEnd(callback);
        }
    };
    /**
     * 当前所在的角度
     *
     * @param {any} angle 角度
     * @returns {Number}
     */
    Wheel.prototype._correctAngle = function (angle) {
        let _that = this;
        if (angle < _that.beginAngle) {
            return _that.beginAngle;
        } else if (angle > _that.endAngle) {
            return _that.endAngle;
        } else {
            return angle;
        }
    };
    /**
     * 手指移动结束后转为自动滚动
     *
     * @param {any} event 事件对象
     */
    Wheel.prototype._startScroll = function (event) {
        let _that = this;
        let point = event.changedTouches ? event.changedTouches[0] : event;
        /**
         * 缓动代码
         */
        let nowTime = event.timeStamp || Date.now();
        let v = (point.pageY - _that.lastMoveStart) / (nowTime - _that.lastMoveTime); // 最后一段时间手指划动速度
        let dir = v > 0 ? -1 : 1; // 加速度方向
        let deceleration = dir * 0.0006 * -1;
        let duration = Math.abs(v / deceleration); // 速度消减至0所需时间
        let dist = v * duration / 2; // 最终移动多少
        let startAngle = _that._angle;
        let distAngle = _that._calcAngle(dist) * dir;

        let srcDistAngle = distAngle;
        if (startAngle + distAngle < _that.beginExceed) {
            distAngle = _that.beginExceed - startAngle;
            duration = duration * (distAngle / srcDistAngle) * 0.6;
        }
        if (startAngle + distAngle > _that.endExceed) {
            distAngle = _that.endExceed - startAngle;
            duration = duration * (distAngle / srcDistAngle) * 0.6;
        }

        if (distAngle == 0) {
            _that._endScroll();
            return;
        }
        _that._scrollDistAngle(nowTime, startAngle, distAngle, duration);
    };
    /**
     * 自动滚动
     *
     * @param {Number} nowTime 当前时间
     * @param {Number} startAngle 开始角度
     * @param {Number} distAngle 结束角度
     * @param {Number} duration （持续时间）动画持续多长时间。
     * @param {Function} callback 滚动结束后的回调
     */
    Wheel.prototype._scrollDistAngle = function (nowTime, startAngle, distAngle, duration, callback) {
        let _that = this;
        _that.stopInertiaMove = false;
        (function (nowTime, startAngle, distAngle, duration) {
            let frameInterval = 13;
            let stepCount = duration / frameInterval;
            let stepIndex = 0;
            (function inertiaMove() {
                if (_that.stopInertiaMove) return;
                let newAngle = easing(stepIndex, startAngle, distAngle, stepCount);
                _that._setAngle(newAngle);
                stepIndex++;
                if (stepIndex > stepCount - 1 || newAngle < _that.beginExceed || newAngle > _that.endExceed) {
                    _that._endScroll(callback);
                    return;
                }
                let index = _that.getSelectedIndex();
                _that.dispatchEvent(_that._el, 'scroll', {
                    index: index
                });
                _that.trigger('scroll', {
                    index: index
                });
                setTimeout(inertiaMove, frameInterval);
            })();
        })(nowTime, startAngle, distAngle, duration);
    };
    /**
     * 结束滚动
     * @param {Function} callback 滚动结束后的回调
     */
    Wheel.prototype._endScroll = function (callback) {
        let _that = this;
        let _wheelEl = _that._wheelEl;
        if (_that._angle < _that.beginAngle) {
            _wheelEl.style[prefixStyle('transition')] = '150ms ease-out';
            _that._setAngle(_that.beginAngle);
        } else if (_that._angle > _that.endAngle) {
            _wheelEl.style[prefixStyle('transition')] = '150ms ease-out';
            _that._setAngle(_that.endAngle);
        } else {
            let index = parseInt((_that._angle / _that.itemAngle).toFixed(0));
            _wheelEl.style[prefixStyle('transition')] = '100ms ease-out';
            _that._setAngle(_that.itemAngle * index);
        }
        _that._triggerEnd(callback);
    };
    /**
     * 滚动结束
     *
     * @param {any} force 回调或者true:为true时候触发scrollEnd事件
     */
    Wheel.prototype._triggerEnd = function (force) {
        let _that = this;
        setTimeout(function () {
            let index = _that.getSelectedIndex();
            // let item = _that.items[index];
            if (_that.trigger && (index != _that.lastIndex || force === true)) {
                _that.dispatchEvent(_that._el, 'scrollEnd', {
                    index: index
                });
                _that.trigger('scrollEnd', {
                    index: index
                });
            }
            _that.lastIndex = index;
            typeof force === 'function' && force();
        }, 0);
    };
    Wheel.prototype._calcAngle = function (c) { // 计算角度
        let _that = this;
        let b = parseFloat(_that.r);
        let a = b;
        // 直径的整倍数部分直接乘以 180
        c = Math.abs(c); // 只算角度不关心正否值
        let intDeg = parseInt(c / _that.d) * 180;
        c = c % _that.d;
        // 余弦
        let cosC = (a * a + b * b - c * c) / (2 * a * b);
        let angleC = intDeg + rad2deg(Math.acos(cosC));
        return angleC;
    };
    /**
     * 设置移动前的数据
     *
     */
    Wheel.prototype._initInertiaParams = function () {
        let _that = this;
        _that.lastMoveTime = 0;
        _that.lastMoveStart = 0;
        _that.stopInertiaMove = false;
    };
    /**
     * 设置移动时的数据
     *
     * @param {any} event 事件对象
     * @param {any} isStart 是否为开始
     */
    Wheel.prototype._updateInertiaParams = function (event, isStart) {
        let _that = this;
        let point = event.changedTouches ? event.changedTouches[0] : event;
        if (isStart) {
            _that.lastMoveStart = point.pageY;
            _that.lastMoveTime = event.timeStamp || Date.now();
            _that.startAngle = _that._angle;
        } else {
            let nowTime = event.timeStamp || Date.now();
            if (nowTime - _that.lastMoveTime > 300) {
                _that.lastMoveTime = nowTime;
                _that.lastMoveStart = point.pageY;
            }
        }
        _that.stopInertiaMove = true;
    };

    Wheel.prototype._bindEvent = function () {
        let _that = this;
        let _el = _that._el;
        let lastAngle = 0;
        let startY = null;
        let gendY = null;
        let isPicking = false;
        _el.addEventListener(EVENT_TYPE.EVENT_START, function (event) {
            isPicking = true;
            event.preventDefault();
            let index = _that.getSelectedIndex();
            _that.dispatchEvent(_that._el, 'scrollEnd', {
                index: index
            });
            _that.trigger('scrollStart', {
                index: index
            });
            _that._wheelEl.style[prefixStyle('transition')] = '';
            startY = (event.changedTouches ? event.changedTouches[0] : event).pageY;
            gendY = startY;
            lastAngle = _that._angle;
            _that._updateInertiaParams(event, true);
        }, false);
        _el.addEventListener(EVENT_TYPE.EVENT_END, function (event) {
            isPicking = false;
            event.preventDefault();
            if (Math.abs(startY - gendY) < 10) {
                _that._triggerEnd(true);
            }
            _that._startScroll(event);
        }, false);
        _el.addEventListener(EVENT_TYPE.EVENT_CANCEL, function (event) {
            isPicking = false;
            event.preventDefault();
            _that._startScroll(event);
        }, false);
        _el.addEventListener(EVENT_TYPE.EVENT_MOVE, function (event) {
            if (!isPicking) {
                return;
            }
            event.preventDefault();
            let endY = (event.changedTouches ? event.changedTouches[0] : event).pageY;
            gendY = endY;
            let dragRange = endY - startY;
            let dragAngle = _that._calcAngle(dragRange);
            let newAngle = dragRange > 0 ? lastAngle - dragAngle : lastAngle + dragAngle;
            if (newAngle > _that.endExceed) {
                newAngle = _that.endExceed;
            }
            if (newAngle < _that.beginExceed) {
                newAngle = _that.beginExceed;
            }
            _that._setAngle(newAngle);
            _that._updateInertiaParams(event);
            _that.trigger('scroll', {
                index: _that.getSelectedIndex()
            });
        }, false);
    };
}