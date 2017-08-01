const platform = navigator.platform.toLowerCase();
const userAgent = navigator.userAgent.toLowerCase();
export const isIos = (userAgent.indexOf('iphone') > -1 ||
    userAgent.indexOf('ipad') > -1 ||
    userAgent.indexOf('ipod') > -1) &&
    (platform.indexOf('iphone') > -1 ||
        platform.indexOf('ipad') > -1 ||
        platform.indexOf('ipod') > -1);