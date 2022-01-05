/* @flow */

import { toArray } from '../util/index'

export function initUse (Vue: GlobalAPI) {
  Vue.use = function (plugin: Function | Object) {
    // 函数内this指向Vue构造器

    // 定义并获取Vue._installedPlugins
    const installedPlugins = (this._installedPlugins || (this._installedPlugins = []))
    // 若插件已经安装过，返回Vue
    if (installedPlugins.indexOf(plugin) > -1) {
      return this
    }

    // 收集参数后，调用插件
    // additional parameters
    const args = toArray(arguments, 1) // 收集当前函数除第一个参数（plugin）外的其他参数
    args.unshift(this) // 参数加上Vue构造器
    if (typeof plugin.install === 'function') {
      // 若plugin是对象，调用plugin.install，并传入参数，函数内部this指向plugin
      plugin.install.apply(plugin, args)
    } else if (typeof plugin === 'function') {
      // 若plugin是函数，直接调用，函数内部this指向null
      plugin.apply(null, args)
    }

    // Vue._installedPlugins中存储该插件
    installedPlugins.push(plugin)
    return this
  }
}
