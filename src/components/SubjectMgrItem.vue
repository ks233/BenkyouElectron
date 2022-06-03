<template>

    <li class="collect-item">
        <div class="f-vertical full">
            <div class="f-horizontal">
                <img v-bind:src="imgUrl" class="img-cover" />
                <div class="f-vertical">
                    <div class="one-line-text" style="display:flex;font-size: larger; margin-top: -5px;">{{ title }}
                    </div>

                    <div v-if="tags.length>0" class="f-horizontal tag-group">
                        <span class="tag" v-for="item in tags" :key="item">{{ item }}</span>
                    </div>
                </div>
                <div class="f-horizontal button-group">
                    <el-button type="primary" :icon="Edit" @click="this.$emit('edit')" plain round>编辑条目</el-button>
                    <el-popconfirm title="确认删除？" @confirm="this.$emit('delete')">
                        <template #reference>
                            <el-button type="danger" :icon="Delete" plain round>删除条目</el-button>
                        </template>
                    </el-popconfirm>
                </div>
            </div>
            <el-progress class="collect-progress" v-bind:percentage="ep / totalEp * 100" :text-inside="true"
                :stroke-width="20" color="#FF654E" :show-text="true" :format="format" />
        </div>
    </li>
</template>
<script setup>

import {
    Edit, Delete
} from '@element-plus/icons-vue'
</script>

<script>
export default {
    name: 'SubjectMgrItem',
    props: {
        title: String,
        ep: Number,
        totalEp: Number,
        imgUrl: String,
        tags: Array
    },
    methods: {
        format(percentage) {
            return "  [" + this.ep + "/" + this.totalEp + "] " + Math.ceil(percentage) + "%";
        }
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
    height: 20px;
    line-height: 20px;
    margin-top: 5px;
    padding: 1px 5px 2px 5px;
    margin-bottom: auto;
}

.f-horizontal {
    display: flex;
    flex-direction: row;
}

.button-group {
    flex-basis: 100px;
    margin-left: auto;
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