/**
 * 减速度运动,结束速度为0,动画缓函数
 *
 * @export
 * @param {Number} t current time（当前时间）当前时间,即动画已经进行了多长时间,开始时间为0；
 * @param {Number} b beginning value（初始值）开始值；
 * @param {Number} c value（变化量）总的变化量；
 * @param {Number} d （持续时间）动画持续多长时间。
 * @returns {Number}
 */
export function easing(t, b, c, d) { // quartEaseOut
    return -c * ((t = t / d - 1) * t * t * t - 1) + b;
}