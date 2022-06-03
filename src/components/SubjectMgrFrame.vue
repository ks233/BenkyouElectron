<template>
    <el-dialog v-model="dialogFormVisible" :title="edit ? '编辑条目' : '新建条目'" fullscreen>
        <el-form :model="form">
            <el-row>
                <el-col :span="9">
                    <el-form-item label="标题" label-width="60px">
                        <el-input v-model="form.title" autocomplete="off" />
                    </el-form-item>
                </el-col>
                <el-col :span="9">
                    <el-form-item label="副标题" label-width="60px">
                        <el-input v-model="form.subtitle" autocomplete="off" />
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="集数" label-width="60px">
                        <el-input-number v-model="form.ep" :min="1" :max="500" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="标签" label-width="60px">
                        <el-input v-model="form.tag" autocomplete="off" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>

                <el-col :span="5">
                    <el-form-item label="标题" label-width="60px">
                        <el-input-number v-model="form.ep_select" :min="1" :max="form.ep" controls-position="right" />
                    </el-form-item>
                </el-col>
                <el-col :span="16">
                    <el-input v-model="form.ep_title[form.ep_select - 1]" autocomplete="off" />
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="简介" label-width="60px">
                        <el-input v-model="form.desc" type="textarea" resize="none" :rows="6" style="resize: none;" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                
                <el-col :span="4">
                    <el-form-item label="使用新封面">
                        <el-switch v-model="form.update_cover" />
                    </el-form-item>
                </el-col>
                <el-col :span="2">
                    <a style="color:blue;cursor: pointer;" @click="select_cover">选择封面</a>
                </el-col>
            </el-row>

        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取消</el-button>
                <el-button type="primary" @click="dialogFormVisible = false; insert_subject()">确认</el-button>
            </span>
        </template>
    </el-dialog>


    <el-dialog v-model="bvFormVisible" title="输入视频bv号">
        <el-form-item label="bv" label-width="60px">
            <el-input v-model="bvid_input" autocomplete="off" />
        </el-form-item>
        <span class="dialog-footer">
            <el-button @click="bvFormVisible = false">Cancel</el-button>
            <el-button type="primary" @click="fill_form_bili">Confirm</el-button>
        </span>
    </el-dialog>

    <!-- 上面都是弹出框的内容 -->

    <div class="search">
        <el-input v-model="searchInput" placeholder="搜索条目" @keydown.enter="search(searchInput)" />
        <!-- <el-input v-model="searchInput" placeholder="输入“#标签”可以搜索标签，多个标签用空格隔开" @keydown.enter="search(searchInput)" /> -->
    </div>
    <el-scrollbar class="w100 listbox">
        <ul class="first-item">
            <button class="big-circle-button" color="#ff654e" @click="show_form()">
                <font-awesome-icon class="fa-4x" :icon="['fas', 'plus']" style="color:var(--benkyou-theme-color)" />
            </button>

            <button class="big-circle-button" @click="bvFormVisible = true">
                <font-awesome-icon class="fa-4x" :icon="['fab', 'bilibili']" style="color:var(--benkyou-theme-color)" />
            </button>
        </ul>
        <ul style="padding:0">
            <SubjectMgrItem v-for="item in subject_items" :key="item" :title="item.title"
                :imgUrl="'covers/' + item.sid + '.jpg'" :ep="item.ep_clear" :totalEp="item.total_ep"
                :tags='item.tag_array' @delete="delete_subject(item.sid)" @edit="show_edit_form(item)">
            </SubjectMgrItem>
        </ul>
    </el-scrollbar>
</template>
<script setup>
import { ref, reactive } from 'vue'
import { trim } from "lodash";
// import { UploadFilled } from '@element-plus/icons-vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { fas } from '@fortawesome/free-solid-svg-icons'
library.add(fab, fas)
const searchInput = ref('')
const dialogFormVisible = ref(false)
const form = reactive({
    sid: 0,
    title: '',
    subtitle: '',
    ep: 12,
    tag: '',
    desc: '',
    ep_select: '',
    ep_title: [],
    update_cover:false
})
const bvFormVisible = ref(false)
const bvid_input = ref("")
</script>

<script>
import SubjectMgrItem from "./SubjectMgrItem.vue";
export default {
    name: "SubjectMgrFrame",
    components: { SubjectMgrItem },
    data() {
        return {
            subject_items: [

            ], edit: false
        }
    },
    methods: {
        async insert_subject() {
            let upd_sid=this.form.sid

            let title = this.form.title
            let subtitle = this.form.subtitle
            let description = this.form.desc
            let total_ep = this.form.ep
            let tags = trim(this.form.tag)
            let ep_titles = this.form.ep_title.join('\r\n')
            ep_titles = ep_titles.replaceAll('\'', '\'\'')
            // description = description.replaceAll(/(?:\r\n|\r|\n)/g, "\n\r")
            description = description.replaceAll('\'', '\'\'')

            let time = new Date().getTime()
            if(this.edit==false){//新条目
                let sql = `insert into subject(sid,title,subtitle,description,total_ep,tags,ep_titles) values (null,'${title}','${subtitle}','${description}',${total_ep},'${tags}','${ep_titles}') returning sid`
                console.log(sql)
                let new_sid = await window.sqlite3api.db_query(sql)
                let sid = new_sid[0]['sid']
                if(this.form.update_cover)window.fileAPI.copyFile('temp.jpg',`public/covers/${sid}.jpg`)
                sql = `insert into status(sid,ep_clear,state,last_update) values (${sid},0,1,'${new Date().getTime()}')`
                await window.sqlite3api.db_run(sql)
            }else{
                let sql = `update subject set title='${title}',subtitle='${subtitle}',description='${description}',total_ep=${total_ep},tags='${tags}',ep_titles='${ep_titles}' where sid=${upd_sid}`
                await window.sqlite3api.db_run(sql)
                if(this.form.update_cover)window.fileAPI.copyFile('temp.jpg',`public/covers/${upd_sid}.jpg`)
                sql = `update status set last_update=${time}`
            }
            await this.search(this.searchInput)

        },
        async delete_subject(sid) {
            console.log(sid)
            await window.sqlite3api.db_run(`delete from subject where sid=${sid}`)
            this.search(this.searchInput);
        },
        async fill_form_bili() {
            this.clear_form()
            let bvid = this.bvid_input;
            console.log(bvid)
            let bili = await window.fetch_api.get_bv(bvid)
            if(bili.data.pic)window.fileAPI.dlTempPic(bili.data.pic);
            console.log(bili.data.title)
            let title = bili.data.title
            let subtitle = bili.data.owner.name
            let description = bili.data.desc
            let total_ep = bili.data.videos
            bili.data.pages.forEach(element => {
                this.form.ep_title.push(element.part)
            });
            this.form.title = title
            this.form.subtitle = subtitle
            this.form.ep = total_ep
            this.form.desc = description
            this.form.update_cover = true
            this.bvFormVisible = false;
            this.dialogFormVisible = true
        }
        ,
        async search(input) {
            let items
            if (trim(input) == '') {
                items = await window.sqlite3api.db_query("select * from subject_view order by last_update desc")
            } else {
                items = await window.sqlite3api.db_query("select * from subject_view where title like '%" + input + "%' or subtitle like '%" + input + "%' order by last_update desc")
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
        },clear_form(){
            this.edit = false;
            this.form.sid=0
            this.form.title= ''
            this.form.subtitle= ''
            this.form.ep= 12
            this.form.tag= ''
            this.form.desc= ''
            this.form.ep_select= 1
            this.form.ep_title= []
            this.form.update_cover=false
        },
        async show_form() {
            this.clear_form()
            this.dialogFormVisible = true
        },
        async select_cover(){
            let cover_path = await window.electronAPI.openFile()
            
            console.log('file path '+cover_path)
            if(cover_path==''){
                return
            }else{
                window.fileAPI.copyFile(cover_path,'temp.jpg')
            }
        },
        show_edit_form(item) {
            this.edit = true;
            this.form.sid= 0
            this.form.title= ''
            this.form.subtitle= ''
            this.form.ep= 12
            this.form.tag= ''
            this.form.desc= ''
            this.form.ep_select= 1
            this.form.ep_title= []

            this.form.sid = item.sid
            this.form.title = item.title
            this.form.subtitle = item.subtitle
            this.form.ep = item.total_ep
            this.form.desc = item.description
            this.form.tag = item.tags
            this.form.ep_select = '1'

            let title_array = item.ep_titles.split('\r\n');
            for (let i = title_array.length + 1; i <= item.total_ep; i++) {
                title_array.push(i.toString());
            }


            console.log(title_array)
            this.form.ep_title = title_array
            this.dialogFormVisible = true
        }
    }, created() {
        this.search()
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

.search {
    width: calc(100% - 28px);
    margin-top: 10px;
    padding-left: 10px;
}

.first-item {
    margin-bottom: 10px;
    box-shadow: var(--el-box-shadow-light);
    width: calc(100% - 40px);
    height: 140px;
    margin-left: 6px;
    padding: 10px 10px 10px 10px;
    vertical-align: middle;
}

.big-circle-button {
    height: 100px;
    width: 100px;
    margin-left: 20px;
    margin-top: 20px;
    background-color: #fff;
    border-color: var(--benkyou-theme-color);
    border-radius: 50%;
    border-width: 5px;
    box-shadow: var(--el-box-shadow-light);
}

.collect-item:hover {
    box-shadow: 0 0 10px var(--benkyou-theme-color);
}

.listbox {
    overflow-y: scroll;
    width: calc(100% - 10px);
    height: calc(100vh - 64px);
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