const platform = navigator.platform.toLowerCase();
const userAgent = navigator.userAgent.toLowerCase();

export const browserVersion = (userAgent.match(/version\/(.+?)\s/i) || [])[1]; // 浏览器版本号
export const isIos = (userAgent.indexOf('iphone') > -1 ||
    userAgent.indexOf('ipad') > -1 ||
    userAgent.indexOf('ipod') > -1) &&
    (platform.indexOf('iphone') > -1 ||
        platform.indexOf('ipad') > -1 ||
        platform.indexOf('ipod') > -1);