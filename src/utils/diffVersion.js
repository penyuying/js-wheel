/**
 * 比较两个版本
 *
 * @export
 * @param {String} nowVer 当前版本
 * @param {String} ver 比较的版本
 * @returns {-1|0|1} 返回-1：当前版本小;0：和当前版本相等;1：当前版本大
 */
export default function diffVersion(nowVer, ver) {
    let res = 0;
    nowVer = (nowVer || '0') + '';
    ver = (ver || '0') + '';
    let nowArr = nowVer.split('.');
    let arr = ver.split('.');
    let len = Math.max(nowArr.length, arr.length);
    let mlen = Math.min(nowArr.length, arr.length);
    let offset = len - mlen;
    if (offset > 0) { // 两个数组不一样的时候补齐
        let aOffset = (new Array(offset)).fill(0);
        if (nowArr.length > arr.length) {
            arr = aOffset.concat(arr);
        }
        else {
            nowArr = aOffset.concat(nowArr);
        }
    }
    for (let i = 0; i < len; i++) {
        const now = parseInt(nowArr[i] || '0', 10) || 0;
        const item = parseInt(arr[i] || '0', 10) || 0;
        if (now < item) {
            res = -1;
            break;
        }
        else if (now > item) {
            res = 1;
            break;
        }
    }
    return res;
}
