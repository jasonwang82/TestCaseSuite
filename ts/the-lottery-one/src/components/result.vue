<!-- @format -->

<template>
  <div class="allResult">
    <div class="luckyName" v-for="(item, index) in theLuckyOne" :key="index">
      <div class="luckyTitle">
        {{ steps[index] }}
      </div>
      <div class="luckyTitle">
        中奖名单
      </div>
      <div class="luckyRes">
        <span
          class="luckyResItem"
          v-for="(child, cIndex) in item"
          :key="`c-${cIndex}`"
          >{{ child }}</span
        >
      </div>
    </div>
  </div>
</template>
<script>
import stepsData from '../nameList/stepsData';

export default {
  data() {
    return {
      steps: stepsData.map((item) => {
        // return item.stepName + item.awards.title;
        return `${item.stepName}（${item.awards.title} ${item.luckyTotal}人）`;
      }),
      theLuckyOne: JSON.parse(window.localStorage.getItem('res')),
    };
  },
};
</script>
<style scoped>
.allResult {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  background: #fff;
  overflow-y: scroll;
}
.luckyName {
  border-bottom: 1px solid #ccc;
  padding-bottom: 10px;
  margin-bottom: 10px;
}
.luckyTitle {
  font-size: 18px;
  font-weight: bold;
}
.luckyRes {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
}
.luckyResItem {
  display: block;
  padding: 3px 5px;
}
</style>
