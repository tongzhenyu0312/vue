/* @flow */

import config from '../config'
import { initUse } from './use'
import { initMixin } from './mixin'
import { initExtend } from './extend'
import { initAssetRegisters } from './assets'
import { set, del } from '../observer/index'
import { ASSET_TYPES } from 'shared/constants'
import builtInComponents from '../components/index'
import { observe } from 'core/observer/index'

import {
  warn,
  extend,
  nextTick,
  mergeOptions,
  defineReactive
} from '../util/index'

export function initGlobalAPI (Vue: GlobalAPI) {
  // 添加私有属性Vue.config（该属性只读）
  const configDef = {}
  configDef.get = () => config
  if (process.env.NODE_ENV !== 'production') {
    configDef.set = () => {
      warn(
        'Do not replace the Vue.config object, set individual fields instead.'
      )
    }
  }
  Object.defineProperty(Vue, 'config', configDef)

  // 添加一些私有的工具方法 Vue.util。这些工具方法不准备暴露给开发者使用，除非你对风险有足够的了解
  // exposed util methods.
  // NOTE: these are not considered part of the public API - avoid relying on
  // them unless you are aware of the risk.
  Vue.util = {
    warn,
    extend,
    mergeOptions,
    defineReactive
  }

  // 添加一些和响应式有关的私有属性 Vue.set Vue.delete Vue.nextTick
  // https://cn.vuejs.org/v2/api/#Vue-set
  // https://cn.vuejs.org/v2/api/#Vue-delete
  // https://cn.vuejs.org/v2/api/#Vue-nextTick
  // related to reactivity
  Vue.set = set
  Vue.delete = del
  Vue.nextTick = nextTick

  // 添加显式的可观察api
  // https://cn.vuejs.org/v2/api/#Vue-observable
  // 2.6 explicit observable API
  Vue.observable = <T>(obj: T): T => {
    observe(obj)
    return obj
  }

  // 添加Vue.options 内部包含了 components, directives, filters
  // vue options
  Vue.options = Object.create(null)
  ASSET_TYPES.forEach(type => {
    Vue.options[type + 's'] = Object.create(null)
  })

  // 添加Vue._base
  // this is used to identify the "base" constructor to extend all plain-object
  // components with in Weex's multi-instance scenarios.
  Vue.options._base = Vue

  // Vue.components中加入 keep-alive
  // add keep-alive to Vue.options.components
  extend(Vue.options.components, builtInComponents)

  //</T>
  // 添加Vue.use https://cn.vuejs.org/v2/api/#Vue-use
  initUse(Vue)

  // 添加Vue.mixin https://cn.vuejs.org/v2/api/#Vue-mixin
  initMixin(Vue)

  // 添加Vue.extend https://cn.vuejs.org/v2/api/#Vue-extend
  initExtend(Vue)

  // 添加 Vue.component Vue.filter Vue.directive
  // 这几个API可以被定义在一起，是因为他们的参数类型相似
  // https://cn.vuejs.org/v2/api/#Vue-component
  // https://cn.vuejs.org/v2/api/#Vue-filter
  // https://cn.vuejs.org/v2/api/#Vue-directive
  initAssetRegisters(Vue)
}
