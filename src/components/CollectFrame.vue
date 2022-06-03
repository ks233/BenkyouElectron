<template>
    <div class="w100">
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" active-text-color="#ff654e"
            text-color="#ff654e" :ellipsis="false">
            <el-menu-item index="1" @click="state=1;search(searchInput)">在看</el-menu-item>
            <el-menu-item index="2" @click="state=2;search(searchInput)">看过</el-menu-item>
            <el-menu-item index="3" @click="state=3;search(searchInput)">想看</el-menu-item>
            <el-menu-item index="4" @click="state=4;search(searchInput)">搁置</el-menu-item>
            <el-menu-item index="5" @click="state=5;search(searchInput)">抛弃</el-menu-item>
        </el-menu>
    </div>
    <div class="search">

        <el-input v-model="searchInput" placeholder="搜索条目" @keydown.enter="search(searchInput)" />
        <!-- <el-input v-model="searchInput" placeholder="输入“#标签”可以搜索标签，多个标签用空格隔开" /> -->
    </div>
    <el-scrollbar class="w100 listbox">
        <ul style="padding:0">
            <CollectListItem v-for="item in subject_items" :key="item" :title="item.title"
                :imgUrl="'covers/' + item.sid + '.jpg'" :ep="item.ep_clear" :totalEp="item.total_ep"
                :tags='item.tag_array' :state="state" @delete="delete_subject(item.sid)" @change-state="change_state($event,item)">
            </CollectListItem>
        </ul>
    </el-scrollbar>
</template>
<script setup>
import { ref } from 'vue'
import { trim } from "lodash";
const searchInput = ref('')
</script>

<script>
import CollectListItem from "./CollectListItem.vue";
export default {
    name: "CollectFrame",
    components: { CollectListItem },
    data() {
        return {
            subject_items: [
                
            ],
            state:1
        }
    },
    methods:{
        async search(input) {
            let items
            if (trim(input) == '') {
                items = await window.sqlite3api.db_query("select * from subject_view where state="+this.state + " order by last_update desc")
            } else {
                items = await window.sqlite3api.db_query(`select * from subject_view where title like '%${input}%' or subtitle like '%${input}%' and state=${this.state} order by last_update desc`)
            }
            this.update(items)
            console.log(input)

        },
        update(sqlResult) {
            var subjectArray = sqlResult;

            subjectArray.forEach(element => {
                if (element.tags == '') {
                    element.tag_array = []
                } else
                    element.tag_array = element.tags.split(' ');
            });
            this.subject_items = subjectArray;
        },
        dateformat: (d) => { return `${d.toLocaleDateString('zh-cn')} ${d.toLocaleTimeString('zh-cn')}` },
        async delete_subject(sid) {
            console.log(sid)
            let time = new Date().getTime()
            await window.sqlite3api.db_run(`update status set state=0,last_update=${time} where sid=${sid}`)
        },
        async change_state(value,item) {
            console.log(value)
            let state_str=''
            switch(value){
                case 1:state_str='在看';break
                case 2:state_str='看过';break
                case 3:state_str='想看';break
                case 4:state_str='搁置';break
                case 5:state_str='抛弃';break
            }
            let time = new Date().getTime()
            await window.sqlite3api.db_run(`update status set state=${value},last_update=${time} where sid=${item.sid}`)
            window.sqlite3api.db_insert_timeline(1,item.sid,'条目状态变更',`将《${item.title}》设置为 ${state_str}`)
            // await window.sqlite3api.db_insert_timeline(time,1,sid,"条目状态更新","")
            await this.search(this.searchInput)
        }
    }, async created() {
        await this.search(this.searchInput)
    }
}

</script>
<style scoped>
el-menu-item {
    color: var(--benkyou-theme-color);
}

.w100 {
    width: 100%;
}
.search{
    width: calc(100% - 28px);
    margin-top: 10px;
    padding-left: 10px;
}

.collect-item:hover {
    box-shadow: 0 0 10px var(--benkyou-theme-color);
}

.listbox {
    overflow-y: scroll;
    width: calc(100% - 10px);
    height: calc(100vh - 100px);
    padding: 5px 5px 5px 5px;
}
</style>
<style>
.el-menu-item:hover {

    background-color: var(--benkyou-hover-color) !important;

}

.el-menu-item.is-active {
    color: #fff !important;
    background: var(--benkyou-active-color) !important;
}
</style>