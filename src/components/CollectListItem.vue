<template>

    <li class="collect-item">
        <div class="f-vertical full">
            <div class="f-horizontal">
                <img v-bind:src="imgUrl" class="img-cover" />
                <div class="f-vertical one-line-text">
                    <div style="display:flex;font-size: larger;">{{ title }} [{{ep}}/{{totalEp}}]
                    </div>

                    <div v-if="tags.length > 0" class="f-horizontal tag-group">
                        <span class="tag" v-for="item in tags" :key="item">{{ item }}</span>
                    </div>
                </div>
                <div class="f-vertical button-group">
                    <el-select v-model="value" placeholder="Select" style="width:80px;margin-right:10px">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"
                            :disabled="item.disabled" />
                    </el-select>
                    <el-button type="primary" :icon="Edit" @click="this.$emit('change-state',value)" plain round>变更状态</el-button>
                    <!-- <el-popconfirm title="确认删除？" @confirm="this.$emit('delete')">
                        <template #reference>
                            <el-button type="danger" :icon="Delete" plain round>删除条目</el-button>
                        </template>
                    </el-popconfirm> -->
                </div>
            </div>
            <el-progress class="collect-progress" v-bind:percentage="ep / totalEp * 100" :text-inside="true"
                :stroke-width="20" color="#FF654E" :show-text="true" :format="format" />
        </div>
    </li>
</template>
<script setup>

import {
    Edit
} from '@element-plus/icons-vue'

import { ref } from 'vue'

const value = ref(1)
const options = [
  {
    value: 1,
    label: '在看',
  },
  {
    value: 2,
    label: '看过'
  },
  {
    value: 3,
    label: '想看',
  },
  {
    value: 4,
    label: '搁置',
  },
  {
    value: 5,
    label: '抛弃',
  },
]

</script>

<script>
export default {
    name: 'CollectListItem',
    props: {
        title: String,
        ep: Number,
        totalEp: Number,
        imgUrl: String,
        tags: Array,
        state: Number
    },
    methods: {
        format(percentage) {
            return  Math.ceil(percentage) + "%"
            // return "  [" + this.ep + "/" + this.totalEp + "] " + Math.ceil(percentage) + "%";
        }
    },created(){
        this.value=this.state
    }
}
</script>

<style scoped>
.collect-item {
    margin-bottom: 10px;
    box-shadow: var(--el-box-shadow-light);
    width: calc(100% - 40px);
    height: 140px;
    margin-left: 6px;
    padding: 10px 10px 10px 10px;
}

.f-vertical {
    display: flex;
    flex-direction: column;
}

ul {
    list-style-type: none;
}

.tag {
    background-color: var(--benkyou-theme-color);
    color: #fff;
    margin-top: 5px;
    height: 20px;
    line-height: 20px;
    padding: 1px 5px 2px 5px;
    margin-bottom: auto;
}

.f-horizontal {
    display: flex;
    flex-direction: row;
}

.button-group {
    flex-basis: 100px;
    flex-direction: row;
    margin-left: auto;
    padding: 0 0 0 0;
    gap: 0px;
}

.tag-group {
    overflow-y: scroll;
    gap: 4px;
    flex-wrap: wrap;
    width: 1fr;
    height: 60px;
}

.full {
    height: 100%;
    width: 100%;
}

.img-cover {
    object-fit: cover;
    float: left;
    height: 100px;
    width: 100px;
    aspect-ratio: 1 / 1;
    margin-right: 12px;
}

.collect-progress {
    flex-grow: 1;
    margin-top: 5px;
}
</style>