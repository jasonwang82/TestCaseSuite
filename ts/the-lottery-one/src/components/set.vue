<!-- @format -->

<template>
  <div class="set-page">
    <div class="content">
      <div class="list-area">
        <h2>系统重置</h2>
        <div>
          <button @click="reset">现在重置</button>
        </div>
      </div>
      <div class="list-area">
        <h2>名单信息</h2>
        <div>
          <h4>
            非全名单：（排除特别的人，例如领导不能中大奖）
          </h4>
          <h5>当前人数：{{ nameList1To3Show.split(',').length || '' }}</h5>
          <div class="name-show">{{ nameList1To3Show }}</div>
        </div>
        <div>
          <h4>全名单：（包含所有人）</h4>
          <h5>当前人数：{{ nameList4To6Show.split(',').length || '' }}</h5>
          <div class="name-show">{{ nameList4To6Show }}</div>
        </div>
      </div>
      <hr />
      <div class="list-set-area">
        <h2>名单设置</h2>

        <div>
          <h4>非全名单：（排除特别的人，例如领导不能中大奖）</h4>
          <div>
            <textarea
              v-model="nameList1To3"
              class="text-area"
              placeholder="请输入姓名，以英文','分割"
            ></textarea>
          </div>
        </div>
        <div>
          <h4>全名单：（包含所有人）</h4>
          <div>
            <textarea
              v-model="nameList4To6"
              class="text-area"
              placeholder="请输入姓名，以英文','分割"
            ></textarea>
          </div>
        </div>
        <div class="save"><button @click="saveNameList">保存</button></div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  components: {},
  data() {
    return {
      nameList1To3: '',
      nameList1To3Show: '',
      nameList4To6: '',
      nameList4To6Show: '',
    };
  },
  mounted() {
    this.getNameList();
  },
  methods: {
    /**
     * 保存名单
     */
    async saveNameList() {
      let nameList1To3 = this.nameList1To3
        .replace(/\n/gi, '')
        .replace(/\s/gi, '');
      let nameList4To6 = this.nameList4To6
        .replace(/\n/gi, '')
        .replace(/\s/gi, '');
      try {
        let res = await axios.post('/api/lottery/save-name-list', {
          nameList1To3: nameList1To3.split(/,|，/),
          nameList4To6: nameList4To6.split(/,|，/),
        });
        if (res.data.code === 0) {
          this.getNameList();
          alert('保存成功');
        }
      } catch (e) {}
    },
    /**
     * 获取名单
     */
    async getNameList() {
      try {
        let res = await axios.get('/api/lottery/get-name-list');
        let data = res.data;
        if (data.code === 0) {
          this.nameList1To3 = data.nameList1To3.join(',');
          this.nameList1To3Show = data.nameList1To3.join(',');
          this.nameList4To6 = data.nameList4To6.join(',');
          this.nameList4To6Show = data.nameList4To6.join(',');
        }
      } catch (e) {
        alert('获取名单失败');
      }
    },
    /**
     * 重置
     */
    reset() {
      let confirm = window.confirm(
        '重置后所有已抽奖将失效，系统回到初始状态！'
      );
      if (confirm == true) {
        window.localStorage.removeItem('res');
        alert('重置成功');
      } else {
      }
    },
  },
};
</script>

<style scoped>
.set-page {
  height: 100%;
  overflow: auto;
  width: 100%;
  top: 0;
  left: 0;
  position: absolute;
}
.list-area .name-show {
  color: rgba(0, 82, 217, 0.8);
}
.set-page .content {
  padding: 20px 40px;
}
.list-set-area .text-area {
  width: 100%;
  max-width: 100%;
  min-height: 200px;
  padding: 5px;
}
.list-set-area .save {
  margin: 20px 0;
}
.list-set-area .save button {
  background: rgb(0, 82, 217);
  color: #fff;
  border: 0;
  font-size: 14px;
  padding: 5px 10px;
  cursor: pointer;
}
</style>
