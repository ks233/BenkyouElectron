<template>
    <el-tabs tab-position='left' class="demo-tabs" @tab-click="refresh_tl">
        <el-tab-pane label="正在进行">
            <DoFrame></DoFrame>
        </el-tab-pane>
        <el-tab-pane label="我的条目">
            <CollectFrame></CollectFrame>
        </el-tab-pane>
        <el-tab-pane label="条目管理"><SubjectMgrFrame/></el-tab-pane>
        <el-tab-pane label="时间线" ><TimelineFrame ref='tl'/></el-tab-pane>
    </el-tabs>
</template>

<script>
import DoFrame from "./DoFrame.vue";
import CollectFrame from "./CollectFrame.vue";
import TimelineFrame from "./TimelineFrame.vue";
import SubjectMgrFrame from "./SubjectMgrFrame.vue";

export default {
    name: "MainFrame",
    components: { DoFrame, CollectFrame, TimelineFrame, SubjectMgrFrame },
    mounted() {

    },methods:{
        refresh_tl(){
            this.$emit('tl-upd');
        }
    }
} 
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.demo-tabs>.el-tabs__content {
    padding: 32px;
    height: 100%;
    font-size: px;
    font-weight: 600;
}
</style>
<style>
.el-tabs {
    height: calc(100vh);
}

.el-tabs__item {
    height: 36px !important;
    margin: 5px 10px;
    width: 100px;
    line-height: 36px !important;
    text-align: center !important;
}

.el-tabs__item:hover {
    color: var(--benkyou-theme-color) !important;
}

.el-tabs__item.is-active {
    background-color: var(--benkyou-theme-color) !important;
    color: white !important;
    box-shadow: var(--el-box-shadow-light);
    border-radius: 8px;

}

.el-tabs__active-bar {
    background-color: var(--benkyou-theme-color) !important;
}

.el-tabs--right .el-tabs__content,
.el-tabs--left .el-tabs__content {
    height: 100%;
}

</style>