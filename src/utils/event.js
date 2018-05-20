import { extend } from './utils';
/**
 * 自定义事件处理模块
 *
 * @export
 * @param {Function} Fn 构造函数
 */
export function eventModule(Fn) {
    Fn.prototype.dispatchEvent = function (target, eventType, options) {
        if (target && target.tagName && eventType && typeof eventType === 'string') {
            let ev = document.createEvent(window && window.MouseEvent ? 'MouseEvents' : 'Event');
            ev.initEvent(eventType, true, false);
            ev._constructed = true;
            ev = extend(ev, options);
            target.dispatchEvent(ev);
        }
    };
    Fn.prototype.on = function (type, fn, context = this) {
        let _that = this;
        _that._events = _that._events || {};
        _that._events[type] = _that._events[type] || [];

        _that._events[type].push([fn, context]);
    };

    Fn.prototype.once = function (type, fn, context = this) { // 绑定后执行一次就移除
        let _that = this;
        let fired = false;
        /**
         * 魔法函`
         *
         */
        function magic() {
            _that.off(type, magic);

            if (!fired) {
                fired = true;
                fn.apply(context, arguments);
            }
        }
        // 将参数中的回调函数挂载在magic对象的fn属性上,为了执行off方法的时候，暴露对应的函数方法
        magic.fn = fn;

        _that.on(type, magic);
    };

    Fn.prototype.off = function (type, fn) { // 移除
        let _that = this;
        let _events = _that._events[type];
        if (!_events) {
            return;
        }

        let count = _events.length;
        while (count--) {
            // 移除通过on或者once绑定的回调函数
            if (_events[count][0] === fn || (_events[count][0] && _events[count][0].fn === fn)) {
                _events[count][0] = undefined;
            }
        }
    };

    Fn.prototype.trigger = function (type) { // 执行事件
        let _that = this;
        let events = (_that._events && _that._events[type]);
        if (!events) {
            return;
        }

        let len = events.length;
        let eventsCopy = [...events];
        for (let i = 0; i < len; i++) {
            let event = eventsCopy[i];
            let [fn, context] = event;
            if (fn) {
                fn.apply(context, [].slice.call(arguments, 1));
            }
        }
    };
}
