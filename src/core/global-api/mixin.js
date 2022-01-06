/* @flow */

import { mergeOptions } from '../util/index'

// global mixin
export function initMixin (Vue: GlobalAPI) {
  Vue.mixin = function (mixin: Object) {
    // 将mixin中的成员拷贝到Vue.options上
    this.options = mergeOptions(this.options, mixin)
    return this
  }
}
