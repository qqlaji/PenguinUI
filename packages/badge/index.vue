<script setup>
import { computed } from 'vue';

const props = defineProps({
    value: [String, Number],
    hidden: { type: Boolean, default: false },
    isDot: { type: Boolean, default: false },
    type: { type: String, default: 'danger' },
    max: { type: Number, default: 99 },
    // ===== v1.9 新增 =====
    // isDot 的语义化别名
    dot: { type: Boolean, default: false },
    // 自定义徽章颜色，优先于 type
    color: { type: String, default: '' },
    // value 为 0 / '0' 时是否仍然显示
    showZero: { type: Boolean, default: true },
    // 呼吸动画，适合表示实时状态
    pulse: { type: Boolean, default: false },
});

const dotMode = computed(() => props.isDot || props.dot);
const show = computed(() =>
    !props.hidden &&
    (dotMode.value || props.showZero || String(props.value) !== '0')
);
const badgeStyle = computed(() =>
    props.color ? { backgroundColor: props.color, borderColor: props.color } : {}
);
</script>

<script>
export default {
    name: "tBadge",
};
</script>

<template>
    <div class="penguin-badge">
        <slot></slot>
        <template v-if="show">
            <sup v-if="!dotMode" :class="[type, { 'is-pulse': pulse }]" class="badge" :style="badgeStyle">
                <span v-if="typeof value === 'number'">{{ value <= max ? value : `${max}+` }}</span>
                <span v-else>{{ value }}</span>
            </sup>
            <sup v-else class="isdot" :class="{ 'is-pulse': pulse }" :style="badgeStyle"></sup>
        </template>
    </div>
</template>

<style scoped lang="scss">
.penguin-badge {
    position: relative;
    display: inline-flex;
    align-items: center;
    vertical-align: middle;
    white-space: nowrap;
}

.badge,
.isdot {
    position: absolute;
    top: 0;
    right: 0;
    // 描边跟随示例画布底色，暗色主题下不再是突兀的白圈
    border: 2px solid var(--pui-demo-bg, #fff);
}

.badge {
    transform: translateX(70%) translateY(-50%);
    padding: 1px 8px;
    min-width: 18px;
    height: 18px;
    box-sizing: border-box;
    border-radius: 999px;
    color: #fff;
    font-size: 11px;
    line-height: 1;
    font-variant-numeric: tabular-nums;
    box-shadow: 0 2px 6px rgba(24, 44, 78, 0.16);
    display: inline-flex;
    align-items: center;
    justify-content: center;
}

.isdot {
    transform: translateX(50%) translateY(-50%);
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: $danger;
}

.primary { background-color: $primary; }
.info { background-color: $info; }
.success { background-color: $success; }
.warning { background-color: $warn; }
.danger { background-color: $danger; }

/* ===== v1.9 新增：呼吸动画 ===== */
.is-pulse { animation: penguin-badge-pulse 1.8s ease-in-out infinite; }
@keyframes penguin-badge-pulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(236, 52, 55, 0.45); }
    50% { box-shadow: 0 0 0 6px rgba(236, 52, 55, 0); }
}
</style>
