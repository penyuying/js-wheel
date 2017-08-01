# Wheel
picker的滚轮


## Installation

You can use this package on the server side as well as the client side.

### [Node.js](http://nodejs.org/):

~~~
npm install js-wheel
~~~


## Usage

~~~ javascript
    import { Wheel } from 'js-wheel'

    new Wheel('#wheel', {
        wheelEl: '', // 滚轮列表：元素列表、元素标签名称、class名称或空（空的时候取初始化时el的第一个子元素）
        wheelItemEl: '', // 滚轮列表项（wheelEl的子元素）:元素列表、元素标签名称、class名称或空（空的时候取子元素列表）
        activeCls: 'active', // 活动项的Class名
        visibleCls: 'visible', // 显示项的Class名
        perspective: '1000px' // 视角
    });

~~~