<template>
    <div class="container" style="height:100%; width:100%;">
        <div id="DoList" class="resizable">
            <ul v-for="(item, index) in clearit_items" :key="item" style="padding:0; margin: 0;">
                <li class="clearit" @mouseover="item.hover = true" @mouseleave="item.hover = false"
                    @click="selected = index; load_ep_state()">
                    <img :src="'covers/' + item.sid + '.jpg'" class="img-thumbnail" />
                    <div class='one-line-text' style="display:flex;font-size: larger;">{{ item.title }}</div>
                    <div style="display:flex;color: gray;margin-top: 12px;margin-bottom: 4px;">
                        [{{ item.ep_clear }}/{{ item.total_ep }}]</div>
                    <el-progress :percentage="item.ep_clear / item.total_ep * 100"
                        :color="item.hover ? '#FF654E' : '#BBBBBB'" :show-text="false" />
                </li>
            </ul>
        </div>
        <div v-if="clearit_items[selected]" id="ItemDetail">
            <div id="ItemInfo">
                <div style="height: 170px;padding: 0;display:block">
                    <img :src="'covers/' + clearit_items[selected].sid + '.jpg'" id="img-cover"
                        :alt="clearit_items[selected].title" />
                    <h1 class='one-line-text'>{{ clearit_items[selected].title }}</h1>
                    <h2 class='one-line-text'>{{ clearit_items[selected].subtitle }}</h2>
                    <div class="f-horizontal tag-group">
                        <span class="tag" v-for="item in clearit_items[selected].tag_array" :key="item">{{ item
                        }}</span>
                    </div>
                </div>

                <el-progress id="do-progress"
                    :percentage="Math.ceil(clearit_items[selected].ep_clear / clearit_items[selected].total_ep * 100)"
                    :text-inside="true" :stroke-width="20" color="#FF654E" :show-text="true" :format="format" />
                <div id="ItemSummary">
                    <p style="white-space: pre-wrap; width: 100%;">
                        {{ clearit_items[selected].description }}
                    </p>
                </div>
            </div>
            <div id="ItemEp">
                <el-tooltip v-for="index in clearit_items[selected].total_ep" :key="index"
                    :content="clearit_items[selected].ep_title_array[index - 1]" placement="top" :enterable="false"
                    :hide-after="0">
                    <el-button class="ep-grid" :type="
                    (ep_state[index]) ? 
                    (ep_state[index].state == 0 ? 'default' : 
                        (ep_state[index].state < 0 ? 'success' : 'primary')
                    ):'default'"
                        :plain="(ep_state[index]) ? (ep_state[index].state == 0 ? true : false) : true"
                        @click="set_ep_state($event, clearit_items[selected].sid, ep_state[index].state == 1 ? 0 : 1, index)" 
                        @click.right="set_ep_state($event, clearit_items[selected].sid, ep_state[index].state == -1 ? 0 : -1, index)">
                        {{ index
                        }}
                    </el-button>
                </el-tooltip>

            </div>
        </div>

    </div>
</template>


<script>

import interact from 'interactjs'


export default {
    name: "DoFrame",

    data() {
        return {
            ep: 10,
            total_ep: 20,
            clearit_items: [

            ],
            ep_state: [],
            selected: 0
        }
    },
    methods: {
        update_ep() {
            this.ep += 1;
        },
        async refresh_list() {
            //查询数据库
            this.update(await window.sqlite3api.db_query("select * from Subject_View where state=1 order by last_update desc"))
            this.load_ep_state()
        }
        ,
        update(sqlResult) {
            //把数据库改成可显示的形式
            var clearit = sqlResult
            clearit.forEach(element => {
                element.hover = false;
                if (element.tags == '') {
                    element.tag_array = []
                } else {
                    element.tag_array = element.tags.split(' ');
                }
                if (element.ep_titles == null) element.ep_titles = '1'
                element.ep_title_array = element.ep_titles.split('\r\n');
                for (let i = element.ep_title_array.length + 1; i <= element.total_ep; i++) {
                    element.ep_title_array.push(i.toString());
                }
            });

            this.clearit_items = clearit;
        },
        async load_ep_state() {
            this.ep_state = []
            let item_selected = this.clearit_items[this.selected]
            let eps = await window.sqlite3api.db_query("select * from EP_status where sid=" + item_selected.sid)
            eps.forEach(element => {
                this.ep_state[element.ep_num] = {
                    comment: element.comment,
                    state: element.state,
                    last_update: element.last_update,
                }
            });
            for (let i = 1; i <= item_selected.total_ep; i++) {
                if (this.ep_state[i]) continue
                this.ep_state[i] = {
                    comment: '',
                    state: 0,
                    last_update: 0
                }
            }
        }
        ,
        async set_ep_state(e, sid, state, index) {
            this.ep_state[index] = state
            let time = new Date().getTime();
            let sql = `insert or replace into EP_Status(sid,ep_num,comment,state,last_update) values(${sid}, ${index},NULL,${state},${time});`
            //console.log(sql)
            await window.sqlite3api.db_run(sql);
            sql = `update Status set ep_clear=(select count(state) from EP_Status where sid = ${sid} and state>=1),last_update=${time} where sid=${sid}`
            await window.sqlite3api.db_run(sql);
            let item_selected = this.clearit_items[this.selected]
            let state_str=''
            switch(state){
                case 0:state_str='未完成';break
                case -1:state_str='待办';break
                case 1:state_str='已完成';break
            }
            window.sqlite3api.db_insert_timeline(2,sid,`进度更新:《${item_selected.title}》`,`第${index}集 \n ${item_selected.ep_title_array[index-1]} \n设置为"${state_str}"`)
            let target = e.target;
            // 根据button组件内容 里面包括一个span标签，如果设置icon，则还包括一个i标签，其他情况请自行观察。
            // 所以，在我们点击到button组件上的文字也就是span标签上时，直接执行e.target.blur()不会生效，所以要加一层判断。
            if (target.nodeName == 'SPAN' || target.nodeName == 'I') {
                target = e.target.parentNode;
            }
            target.blur();
            this.refresh_list();
            this.selected=0
        }
    }
    ,
    created() {
        this.refresh_list();
        interact('#DoList')
            .resizable({
                // resize from all edges and corners
                edges: { left: false, right: true, bottom: false, top: false },

                listeners: {
                    move(event) {
                        var target = event.target
                        var x = (parseFloat(target.getAttribute('data-x')) || 0)
                        var y = (parseFloat(target.getAttribute('data-y')) || 0)

                        // update the element's style
                        target.style.width = event.rect.width + 'px'

                        // translate when resizing from top or left edges
                        x += event.deltaRect.left
                        y += event.deltaRect.top

                        //TODO: 把px换成百分比
                        target.style.transform = 'translate(' + x + 'px,' + y + 'px)'
                        document.querySelector(".container").style.setProperty('grid-template-columns', target.style.width + ' 1fr')
                        target.setAttribute('data-x', x)
                        target.setAttribute('data-y', y)
                        //target.textContent = Math.round(event.rect.width) + '\u00D7' + Math.round(event.rect.height)
                    }
                },
                modifiers: [
                    // keep the edges inside the parent
                    interact.modifiers.restrictEdges({
                        outer: 'parent'
                    }),

                    // minimum size
                    interact.modifiers.restrictSize({
                        min: { width: 300 },
                        max: { width: 500 }

                    })
                ],
                inertia: false
            })
        //window.sqlite3api.dbtest();
    },
    computed: {
        
    }
} 
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1 {
    margin: 5px;
}

h2 {
    margin: 5px;
    color: gray;
}


.container {
    display: grid;
    grid-template-columns: 40% 1fr;

}

.tag {
    background-color: var(--benkyou-theme-color);
    color: #fff;
    height: 20px;
    line-height: 20px;
    margin-top: 5px;
    margin-right: 5px;
    padding: 1px 5px 2px 5px;
    margin-bottom: auto;
}

.clearit {
    display: block;
    padding: 10px 10px 10px 0px;
    border-top: 1px solid #FFF;
    border-bottom: 1px solid #EEE;
    list-style: none;

}

#do-progress {
    width: auto;
    margin-top: 10px;
    margin-right: 36px;
}

.img-thumbnail {
    object-fit: cover;
    height: 64px;
    width: 64px;
    float: left;
    margin: 0 5px 0 0;
}

#img-cover {
    object-fit: cover;
    height: 150px;
    float: left;
    left: 10px;
    margin: 0 10px 0 -5px;
    aspect-ratio: 1 / 1;
    border-color: #FFF;
    border-style: solid;
    border-width: 5px;
    border-radius: 15px;

    box-shadow: var(--el-box-shadow);
}

#DoList {
    /* height: 100%; */
    /* width: 300px; */
    box-shadow: var(--el-box-shadow-light);
    z-index: 10;
    background-color: #fff;
    overflow-y: scroll;
}

img[src=''] {
    display: none;
}

#ItemDetail {
    /* height: 100%; */
    /* width: 1fr; */
    /* display: grid; */
    word-wrap: break-word;
    overflow: hidden;
}

#ItemSummary {
    top: 70px;
    margin-right: 30px;
}

.f-horizontal {
    display: flex;
    flex-direction: row;
}

.tag-group {
    overflow-y: scroll;
    gap: 4px;
    flex-wrap: wrap;
    width: 1fr;
    height: 60px;
}

#ItemInfo {
    overflow-y: scroll;
    display: block;
    width: 100%;
    height: 60%;
    flex-basis: 40%;
    flex-grow: 1;
    padding: 10px 20px 10px 20px;
    padding-right: 20px;
    z-index: 9;
    text-align: left;

    word-wrap: break-word;
    overflow: scroll;
}

#ItemEp {
    overflow-y: scroll;
    display: flex;
    padding: 8px;
    z-index: 0;
    flex-basis: 40%;
    height: calc(40% - 40px);
    flex-grow: 1;
    border-top-color: var(--benkyou-theme-color);
    border-top-width: 4px;
    border-top-style: dashed;

    flex-wrap: wrap;
    gap: 8px;
    align-content: flex-start;
}

.ep-grid {
    height: 48px;
    width: 48px;
    margin: 0 !important;

}
</style>

<style>
.el-tab-pane {
    height: 100%;
}

::-webkit-scrollbar {
    display: none;
}


.one-line-text {

    /* text-overflow: ellipsis;  */
    white-space: nowrap;
    overflow-x: hidden;
    width: 1fr;
}
</style>