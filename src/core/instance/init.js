/* @flow */

import config from '../config'
import { initProxy } from './proxy'
import { initState } from './state'
import { initRender } from './render'
import { initEvents } from './events'
import { mark, measure } from '../util/perf'
import { initLifecycle, callHook } from './lifecycle'
import { initProvide, initInjections } from './inject'
import { extend, mergeOptions, formatComponentName } from '../util/index'

let uid = 0

export function initMixin (Vue: Class<Component>) {
  Vue.prototype._init = function (options?: Object) {
    // 形参options: Vue实例化时传入的选项
    // 变量vm: Vue实例对象
    const vm: Component = this
    // a uid
    // vm._uid 作为vue实例的唯一标识
    vm._uid = uid++

    // 开发环境下的性能检测（可暂时忽略）
    let startTag, endTag
    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
      startTag = `vue-perf-start:${vm._uid}`
      endTag = `vue-perf-end:${vm._uid}`
      mark(startTag)
    }

    // a flag to avoid this being observed
    // vm._isVue 作为对象是Vue实例对象的标识
    vm._isVue = true

    // merge options
    // 合并options到vm.$options
    if (options && options._isComponent) {
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      // options._isComponent 标识选项是组件
      initInternalComponent(vm, options)
    } else {
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      )
    }

    // 设置渲染代理对象（渲染时会使用）
    /* istanbul ignore else */
    if (process.env.NODE_ENV !== 'production') {
      // 开发环境下，设置代理对象
      initProxy(vm)
    } else {
      // 生产环境下，代理对象（vm._renderProxy）赋值为 Vue实例对象
      vm._renderProxy = vm
    }



    // expose real self
    // 暴露自己
    vm._self = vm

    // 在Vue实例对象上挂载一些和 生命周期相关的 属性。比如 $parent $children $root $refs等
    initLifecycle(vm)
    // 在Vue实例对象上挂载一些和 事件相关的 属性。比如 _events _hasHookEvent等
    initEvents(vm)
    // 在Vue实例对象上挂载一些和 渲染相关的 属性。比如 $slots $scopedSlots $createElement $attrs $listeners等
    initRender(vm)

    // 第一个生命周期钩子函数被调用-beforeCreate
    callHook(vm, 'beforeCreate')


    // initInjections 与 initProvide 是一对用来实现 依赖注入 的函数
    // injections 完成依赖注入
    initInjections(vm) // resolve injections before data/props
    initState(vm)
    // provide 完成依赖提供
    initProvide(vm) // resolve provide after data/props

    // 第二个生命周期钩子函数被调用-created
    callHook(vm, 'created')

    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
      vm._name = formatComponentName(vm, false)
      mark(endTag)
      measure(`vue ${vm._name} init`, startTag, endTag)
    }

    if (vm.$options.el) {
      vm.$mount(vm.$options.el)
    }
  }
}

export function initInternalComponent (vm: Component, options: InternalComponentOptions) {
  const opts = vm.$options = Object.create(vm.constructor.options)
  // doing this because it's faster than dynamic enumeration.
  const parentVnode = options._parentVnode
  opts.parent = options.parent
  opts._parentVnode = parentVnode

  const vnodeComponentOptions = parentVnode.componentOptions
  opts.propsData = vnodeComponentOptions.propsData
  opts._parentListeners = vnodeComponentOptions.listeners
  opts._renderChildren = vnodeComponentOptions.children
  opts._componentTag = vnodeComponentOptions.tag

  if (options.render) {
    opts.render = options.render
    opts.staticRenderFns = options.staticRenderFns
  }
}

export function resolveConstructorOptions (Ctor: Class<Component>) {
  let options = Ctor.options
  if (Ctor.super) {
    const superOptions = resolveConstructorOptions(Ctor.super)
    const cachedSuperOptions = Ctor.superOptions
    if (superOptions !== cachedSuperOptions) {
      // super option changed,
      // need to resolve new options.
      Ctor.superOptions = superOptions
      // check if there are any late-modified/attached options (#4976)
      const modifiedOptions = resolveModifiedOptions(Ctor)
      // update base extend options
      if (modifiedOptions) {
        extend(Ctor.extendOptions, modifiedOptions)
      }
      options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions)
      if (options.name) {
        options.components[options.name] = Ctor
      }
    }
  }
  return options
}

function resolveModifiedOptions (Ctor: Class<Component>): ?Object {
  let modified
  const latest = Ctor.options
  const sealed = Ctor.sealedOptions
  for (const key in latest) {
    if (latest[key] !== sealed[key]) {
      if (!modified) modified = {}
      modified[key] = latest[key]
    }
  }
  return modified
}
