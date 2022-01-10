import { initMixin } from './init'
import { stateMixin } from './state'
import { renderMixin } from './render'
import { eventsMixin } from './events'
import { lifecycleMixin } from './lifecycle'
import { warn } from '../util/index'

// Vue构造器本尊
function Vue (options) {
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  this._init(options)
}

// Vue原型对象添加_init方法
initMixin(Vue)
// Vue原型对象上添加 $data $props属性 以及$set $delete $watch方法（数据相关）
stateMixin(Vue)
// 给Vue的原型对象上添加 $on $once $emit $off方法（事件相关）
eventsMixin(Vue)
// 给Vue的原型对象上添加 _update（内部调用patch） $forceUpdate $destroy方法（生命周期相关）
lifecycleMixin(Vue)
// 给Vue的原型对象上添加 _render $nextTick方法（渲染相关）
renderMixin(Vue)

export default Vue
