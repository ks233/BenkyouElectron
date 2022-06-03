<template>
  <div class="full f-vertical" @click="refresh();">
    <div id="TimelineContainer" ref="TimelineContainer">

      <el-timeline>
        <el-timeline-item v-for="(activity, index) in activities" :key="index" :timestamp="activity.timestamp"
          placement="top" 
          :color="activity.type==1?'#409EFF':
                  (activity.type==2 ? '#67C23A':'#f3d19e')" center>
          <el-card :body-style="{ padding: '10px 15px 20px 10px' }" @click.right="del(activity)">
            <h1>{{ activity.title }}</h1>
            <p style="word-wrap: break-word;white-space: pre-line;font-size: 20px;">{{ activity.text }}</p>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </div>
    <div id="InputContainer">
      <textarea type="textarea" v-model="textInput" :placeholder="'第一行标题，下方正文\n按Ctrl+Enter添加记录'" name="" id="" cols="30"
        rows="" @keydown.ctrl.enter="submit"></textarea>
    </div>
  </div>
</template>

<script setup>

import { trim } from 'lodash';
import { ref } from 'vue'

const textInput = ref('')

</script>
<script>
export default {
  name: "TimelineFrame", 
  data() {
    return {
      activities: [],
      upd:false
    }
  },
  methods: {
    dateformat(time) {
      let d = new Date(time)
      return `${d.toLocaleDateString('zh-cn')} ${d.toLocaleTimeString('zh-cn')}`
    },
    async refresh() {
      this.activities = await window.sqlite3api.db_query(`select * from Timeline ORDER BY time desc`)
      this.activities.forEach(element => {
        element.timestamp = this.dateformat(element.time)
      });
      console.log(this.$refs['TimelineContainer'].scrollHeight)
    },
    async submit() {
      if (trim(this.textInput) == '') return
      let time = new Date().getTime();
      //分出第一行作为标题
      let title = this.textInput.split('\n')[0].replaceAll('\'', '\'\'');
      //后面的内容作为正文
      let text = this.textInput.substr(title.length + 1, this.textInput.length).replaceAll('\'', '\'\'');
      console.log(text)
      this.activities = await window.sqlite3api.db_query(
        `insert into Timeline(time,type,sid,title,text) values (${time},0,NULL,'${title}','${text}')`)
      this.textInput = ''
      await this.refresh()
    },
    async del(item) {
      await window.sqlite3api.db_run(`delete from Timeline where tid=${item.tid}`)
      console.log('del' + item.tid)
      await this.refresh()
    }
  }, async mounted() {
        await this.refresh()
  }

}

</script>

<style scoped>
.full {
  height: 100%;
  width: 100%;
  padding-right: 10px;
}

.f-vertical {
  display: flex;
  flex-direction: column;
}

#TimelineContainer {
  overflow-y: scroll;
  padding-right: 20px;
  margin-left: -20px;
  flex-grow: 1;
  flex-basis: 70%;
  /* border:1px solid red; */
}

#InputContainer {
  flex-basis: 30%;
  padding: 10px 20px 20px 10px;
  flex-grow: 1;
  font-size: large;
  box-shadow: var(--el-box-shadow-light);
}

.el-card {
  padding: 0 0 0 0;
}

h1,
p {
  text-align: left;
  margin-top: 0px;
  margin-bottom: 5px;
}

p {
  margin-top: 0px;
}

textarea {
  height: calc(100% - 10px);
  width: calc(100% - 10px);
  padding: 8px;
  font-size: large;
  border-radius: 5px;
  border: 1px dashed var(--benkyou-theme-color);
  resize: none;
}
</style>
<style>
textarea:focus {
  outline: none !important;
  box-shadow: inset 0 0 5px var(--benkyou-hover-color);
}
</style>