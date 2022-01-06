/* @flow */

import { ASSET_TYPES } from 'shared/constants'
import { isPlainObject, validateComponentName } from '../util/index'

export function initAssetRegisters (Vue: GlobalAPI) {
  /**
   * Create asset registration methods.
   */
  ASSET_TYPES.forEach(type => {
    Vue[type] = function (
      id: string,
      definition: Function | Object
    ): Function | Object | void {
      if (!definition) {
        // definition不存在，意味着没有定义，只是获取值
        return this.options[type + 's'][id]
      } else {
        /* istanbul ignore if */
        if (process.env.NODE_ENV !== 'production' && type === 'component') {
          validateComponentName(id)
        }

        if (type === 'component' && isPlainObject(definition)) {
          // 若定义的是Vue.component 且 定义值是一个对象
          // 将定义对象构造成一个Vue子类（组件）
          definition.name = definition.name || id
          definition = this.options._base.extend(definition)
        }

        if (type === 'directive' && typeof definition === 'function') {
          // 若定义的是Vue.directive 且 定义值是函数对象
          // 创建一个新对象，其内部的bind和update属性，设置为 定义值函数
          definition = { bind: definition, update: definition }
        }

        // 综上：
        // Vue.options.components里存储的都是Vue子类
        // Vue.options.directives里存储的都是创建的对象（{bind: Function, update: Function}）
        // Vue.options.filters里存储的 既可以是对象 也可以是函数
        this.options[type + 's'][id] = definition
        // 返回定义
        return definition
      }
    }
  })
}
