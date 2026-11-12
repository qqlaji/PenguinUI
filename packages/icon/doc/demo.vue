<template>
	<p class="titlep">所有图标（点击可复制类名）</p>
	<div class="">
		<t-input v-model="keywords" leftIcon="t-icon-search" placeholder="输入图标关键词进行搜索"></t-input>
	</div>
	<div class="usage-tip">
		新写法：<code>&lt;t-icon name="search" size="24" color="#0e80eb" /&gt;</code>
		<t-icon name="search" size="24" color="#0e80eb" />
		<t-icon name="penguin" size="24" spin />
	</div>
	<div class="iconListBox">
		<ul>
			<li v-for="(item,index) in IconListData" :key="index" @click="copyIconName(item.className)">
				<i class="iconfont" :class="item.className"></i>
				<span>{{item.className}}</span>
			</li>
		</ul>
		<p v-if="!IconListData.length" class="empty-tip">没有匹配的图标</p>
	</div>
	<textarea ref="copyInput" class="copy-input" />
</template>

<script setup>
	import Message from '../../message/index'
	import { ref, computed } from 'vue'
	import iconList from '@/const/iconList.js'
	const keywords = ref('')
	const copyInput = ref(null)
	const IconListData = computed(() => {
		const kw = keywords.value.trim().toLowerCase()
		if (!kw) return iconList
		return iconList.filter(item => item.className.toLowerCase().includes(kw))
	})
	const copyIconName = async (name) => {
		try {
			if (navigator.clipboard && navigator.clipboard.writeText) {
				await navigator.clipboard.writeText(name)
			} else {
				copyInput.value.value = name
				copyInput.value.select()
				if (!document.execCommand('copy')) throw new Error('copy failed')
			}
			Message({ type: 'success', text: '复制成功' })
		} catch {
			Message({ type: 'error', text: '复制失败' })
		}
	}
</script>

<style lang="scss" scoped>
	.titlep { font-size: 18px; font-weight: 600; }
	.usage-tip {
		margin: 1vh 0;
		color: #555;
		display: flex;
		align-items: center;
		gap: 12px;
		code { background: #f5f5f5; padding: 2px 6px; border-radius: 3px; }
	}
	.empty-tip { text-align: center; color: #999; }
	.copy-input { opacity: 0; height: 0; position: fixed; z-index: -99999999; }
	.iconListBox{
		width: 100%;
		height: auto;
		overflow: hidden;
		margin-top:2vh;
		ul{
			margin:0;
			padding: 0;
			width: 100%;
			height: auto;
			overflow: hidden;
			li{
				list-style: none;
				width: 10.5vw;
				height: 140px;
				float: left;
				padding:1vw;
				box-sizing: border-box;
				text-align: center;
				transition: all .15s ease;
				cursor: pointer;
				border-radius: 4px;
				i{
					font-size:40px;
					color:#555;
					display: block;
					margin-top:1vh;
				}
				span{
					margin-top: 1vh;
					display: inline-block;
					font-size:.9vw;
					color:#555;
					margin-bottom:1vh;
				}
				&:hover{
					background-color:#0e80eb ;
					i{ color:#fff }
					span{ color:#fff }
				}
			}
		}
	}
</style>
