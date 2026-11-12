<script>
import { h } from 'vue';

export default {
  name: 'tBreadcrumb',
  props: {
    customClass: String,
    separator: { type: String, default: '/' },
    separatorIcon: { type: String, default: '' },
    space: { type: Number, default: 8 },
  },
  setup(props, { slots }) {
    return () => {
      const items = slots.default ? slots.default() : [];
      const children = [];
      items.forEach((item, index) => {
        children.push(item);
        if (index < items.length - 1) {
          children.push(
            h(
              'span',
              {
                class: 'pui-breadcrumb__separator',
                style: { margin: `0 ${props.space}px` },
                'aria-hidden': 'true',
              },
              props.separatorIcon
                ? [h('i', { class: `iconfont ${props.separatorIcon}` })]
                : props.separator
            )
          );
        }
      });
      return h(
        'nav',
        {
          class: ['pui-breadcrumb', props.customClass],
          'aria-label': 'Breadcrumb',
        },
        children
      );
    };
  },
};
</script>

<style lang="scss">
.pui-breadcrumb {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  min-height: 22px;
  font-size: 14px;
  line-height: 1.5;
  color: var(--pui-text-muted, #8b96a6);
}
.pui-breadcrumb__separator {
  display: inline-flex;
  align-items: center;
  color: var(--pui-text-muted, #8b96a6);
  opacity: 0.7;
  user-select: none;

  i {
    font-size: 12px;
  }
}
</style>
