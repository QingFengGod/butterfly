import type { PermissionKeyType } from '@/common/enums'
import { usePermission } from '@/common/hooks'
import { defineComponent, type PropType } from 'vue'

export default defineComponent({
  name: 'Permission',
  props: {
    code: {
      type: [String, Array] as PropType<PermissionKeyType | PermissionKeyType[]>,
      required: true
    },
    method: {
      type: String as PropType<'and' | 'or'>,
      default: 'and'
    },
    custom: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { slots }) {
    const hasPermission = usePermission()
    return () => {
      if (props.custom) {
        return slots.default?.(hasPermission(props.code as PermissionKeyType[], props.method))
      }
      if (hasPermission(props.code as PermissionKeyType[], props.method)) {
        return slots.default?.(hasPermission(props.code as PermissionKeyType[], props.method))
      }
      return null
    }
  }
})
