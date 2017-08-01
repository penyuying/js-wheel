export const EVENT_TYPE = (() => {
    let res = {};
    if ('ontouchstart' in window) {
        res.isTouchable = true;
        res.EVENT_START = 'touchstart';
        res.EVENT_MOVE = 'touchmove';
        res.EVENT_END = 'touchend';
    } else {
        res.isTouchable = false;
        res.EVENT_START = 'mousedown';
        res.EVENT_MOVE = 'mousemove';
        res.EVENT_END = 'mouseup';
    }
    res.EVENT_CANCEL = 'touchcancel';
    res.EVENT_CLICK = 'click';
    return res;
})();