<template>
    <t-space :size="[0, 60]">
          <t-badge :value="11" :max="10">
            <t-button>设置最大值10</t-button>
        </t-badge>
         <t-badge :value="100" :max='99'>
            <t-button>设置最大值99</t-button>
        </t-badge>
    </t-space>
</template>