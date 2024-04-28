<!-- @format -->

<template>
  <Result v-if="showAllRes" />
  <div v-else class="box">
    <div class="title-main">
      2024-年会抽奖：{{ steps[step] }}（{{ luckyTotal[step] || "-" }}人）
    </div>
    <div class="title">
      <div class="award" v-for="(award, index) in awards" :key="index">
        <template v-if="index === step">
          <img class="award-img" :src="award.img" alt="" />
          <div class="award-title">
            {{ award.title }}
          </div>
        </template>
      </div>
      <div class="boxbox">
        <img :class="{ action: beginAni }" src="../assets/2024/4.png" alt="" />
        <div class="actionBg" :class="{ actionBg: beginAni }"></div>
      </div>
    </div>
    <div class="roller" @click="letsDraw">
      <span :class="{ rollerAni: beginAni, longName: item.length > 8 }" class="name" v-for="(item, index) in allNameList"
        :style="getStart()" :key="index">
        <p>{{ item }}</p>
      </span>
    </div>
    <div class="result" v-if="showRes">
      <div class="resultTitle">恭喜以下同学抽中 {{ steps[step] }}</div>
      <div class="luckyOne">
        <span class="luckyOneItem" v-for="(item, index) in theLuckyOne[step]" :key="`${step}-${index}`">{{ item }}</span>
      </div>
    </div>
    <div class="pendant-box">
      <img class="couplet-l" src="../assets/2024/couplet-l.png" alt="" />
      <img class="couplet-r" src="../assets/2024/couplet-r.png" alt="" />
      <div class="slogan">逐梦前行，砥砺共进·Pursue Dreams Ahead Together</div>
      <!-- <div class="slogan"> -->
      <!-- <flashing-text></flashing-text> -->
      <!-- </div> -->
      <fireworks></fireworks>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Result from "./result.vue";
import getParameterByName from "../utils/getParameterByName";
// import award1 from '../assets/awards/award1.png';
// import award2 from '../assets/awards/award2.png';
// import award3 from '../assets/awards/award3.png';
// import award4 from '../assets/awards/award4.png';
// import award5 from '../assets/awards/award5.png';
// import award6 from '../assets/awards/award6.png';
import stepsData from "../nameList/stepsData";
// import nameList1To3 from '../nameList/nameList1To3';
// import nameList4To6 from '../nameList/nameList4To6';
import Fireworks from "./fireworks.vue";
// import FlashingText from './flashing-text.vue';

export default {
  components: {
    Result,
    Fireworks,
    // FlashingText,
  },
  data() {
    return {
      step: JSON.parse(localStorage.getItem("res") || "[]").length,
      steps: stepsData.map((item) => {
        return item.step;
      }),
      awards: stepsData.map((item) => {
        return item.awards;
      }),
      nameListTypes: stepsData.map((item) => {
        return item.nameListType;
      }),
      luckyTotal: stepsData.map((item) => {
        return item.luckyTotal;
      }),
      allNameList: [],
      theLuckyOne: JSON.parse(localStorage.getItem("res") || "[]"),
      showRes: false,
      beginAni: false,
      showAllRes: getParameterByName("show"),
      nameList1To3: [],
      nameList4To6: [],
    };
  },
  created() {
    this.getNameList(); // 获取人员名单
    if (this.step === this.steps.length) {
      this.showAllRes = true;
    }
  },
  methods: {
    
    /**
     * 发送抽奖结果
     * @param {Array} luckyList - 中奖名单
     * @returns {Promise} - 返回一个 Promise 对象，如果成功则返回中奖名单，否则抛出错误
     */
    async sendRes(luckyList) {
      try {
        let res = await axios.post("/api/lottery/sendres", {
          luckyList,
          step: this.step,
        });
        let data = res.data;
        if (data.code === 0) {
          this.luckyRes = luckyList;
        }
      } catch (e) {
        alert("发送失败");
      }
    },
    
    /**
     * 获取名单列表
     * @returns {Promise} - 返回一个 Promise 对象，如果成功则返回名单列表，否则抛出错误
     */
    async getNameList() {
      try {
        let res = await axios.get("/api/lottery/get-name-list");
        let data = res.data;
        if (data.code === 0) {
          this.nameList1To3 = data.nameList1To3;
          this.nameList4To6 = data.nameList4To6;
          this.allNameList = this.nameList4To6; // 全部名单
        }
      } catch (e) {
        alert("获取名单失败");
      }
    },
    getStart() {
      const bgColors = [
        // '#0052d9',
        // '#d54941',
        // '#2ba471',
        // '#029cd4',
        // '#8e56dd',
        // '#e851b3',
        "rgba(235,168,30, 1)",
      ];
      const xPosition = `${Math.random() * 150 - 20}vw`;
      const duration = `${Math.random() * 10 + 5}s`;
      const color = bgColors[~~(Math.random() * bgColors.length)];
      const delay = `${~~(Math.random() * 20)}s`;
      const size = `${Math.random() * 30 + 50}px`;
      const aniFc = ~~(Math.random() * 2) === 1 ? "linear" : "ease-in-out";
      return {
        "animation-delay": delay,
        transform: `translate(${xPosition}, -150px)`,
        "animation-duration": duration,
        "background-color": color,
        width: size,
        height: size,
        "animation-timing-function": aniFc,
      };
    },
    checkHadDraw(item) {
      const allLuckys = this.theLuckyOne.join(",").split(",");
      return allLuckys.includes(item);
    },
    /**
     * 排除B数组中已存在的A数组
     * @param {} arrA 需要处理的数组
     * @param {} arrB 已存在的数组
     */
    excludeElementsFromArray(arrA, arrB) {
      // 使用filter方法过滤掉在arrB中存在的元素
      const result = arrA.filter((element) => !arrB.includes(element));
      return result;
    },
    doubleRandom(min, max) {
      return (
        (Math.floor(Math.pow(10, 14) * Math.random() * Math.random()) %
          (max - min + 1)) +
        min
      );
    },
    letsDraw() {
      if (this.step === this.steps.length) {
        return;
      }
      if (this.showRes) {
        this.nextStep();
        return;
      }

      if (!this.beginAni) {
        this.beginAni = true;
        return;
      }
      this.beginAni = false;
      const luckyList = [];
      let total = this.luckyTotal[this.step];
      const nameListType = this.nameListTypes[this.step];
      let nameList = [];
      //   if (this.step < 3) {
      // 4 ~ 6 等奖名单（领导不参与1-3等奖）
      if (nameListType === "nameList4To6") {
        nameList = this.nameList4To6;
      }
      if (nameListType === "nameList1To3") {
        nameList = this.nameList1To3;
      }
      //   } else {
      // 1 ~ 3 等奖名单
      //   }
      if (nameList.length < total) {
        alert("参与抽奖人数不够");
        this.beginAni = false;
        return;
      }
      const allLuckys = this.theLuckyOne.join(",").split(","); // 已抽奖中奖是所有用户
      const canDrawAList = this.excludeElementsFromArray(nameList, allLuckys); // 可以抽奖的人列表
      if (canDrawAList.length === 0) {
        alert("此奖项参与抽奖人数不足");
        this.beginAni = false;
        return;
      }
      if (canDrawAList.length < total) {
        // alert('此奖项参与抽奖人数不足');
        total = canDrawAList.length;
        this.beginAni = false;
      }
      while (luckyList.length < total) {
        const theOne = nameList[this.doubleRandom(0, nameList.length - 1)];
        if (!luckyList.includes(theOne) && !this.checkHadDraw(theOne)) {
          luckyList.push(theOne);
        }
      }
      this.sendRes(luckyList);
      this.theLuckyOne[this.step] = luckyList;
      this.showRes = true;
      localStorage.setItem("res", JSON.stringify(this.theLuckyOne));
    },
    nextStep() {
      this.showRes = false;
      this.step++;
      if (this.step === this.steps.length) {
        this.showAllRes = true;
      }
    },
  },
};
</script>

<style scoped>
@keyframes bubbles {
  100% {
    transform: translate(20vw, 220vh);
    opacity: 0.2;
  }
}

@keyframes ddd {
  50% {
    transform: rotate(20deg) translateY(-10px);
  }

  100% {
    transform: rotate(-10deg);
  }
}

@keyframes warn {
  0% {
    transform: scale(0.5);
    opacity: 0;
  }

  25% {
    transform: scale(0.7);
    opacity: 0.1;
  }

  50% {
    transform: scale(1);
    opacity: 0.3;
  }

  75% {
    transform: scale(1.2);
    opacity: 0.5;
  }

  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

@keyframes showRes {
  0% {
    transform: scale(0.2);
    opacity: 0;
  }

  100% {
    transform: scale(1);
    opacity: 1;
  }
}

* {
  font-family: "PingFang SC", "Avenir", Helvetica, Arial, sans-serif;
}

.box {
  /* background-color: #c12124; */
  /* background-color: #000; */
  /* background: radial-gradient(ellipse at bottom, #1b2735 0, #090a0f 100%); */
  background: radial-gradient(ellipse at bottom, #c12124 0, #4d1124 100%);
  display: block;
  position: absolute;
  height: 100%;
  width: 100%;
  cursor: pointer;
}

.title-main {
  position: absolute;
  top: 80px;
  width: 100%;
  color: #f1c477;
  font-size: 40px;
  text-align: center;
  /*position: relative;*/
  z-index: 3;
}

.title {
  position: absolute;
  top: 140px;
  color: #fff;
  font-size: 32px;
  text-align: center;
  /*position: relative;*/
  z-index: 3;
  width: 100%;
}

.award-img {
  pointer-events: none;
  margin-top: 20px;
  width: 300px;
  height: auto;
  border-radius: 30px;
}

.roller {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  /* position: relative; */
  z-index: 5;
}

.name {
  pointer-events: none;
  transform-style: preserve-3d;
  z-index: 9;
  color: #fff;
  padding: 15px;
  position: absolute;
  animation-iteration-count: infinite;
  border-radius: 100%;
  /* background: radial-gradient(
    circle at top right,
    rgba(255, 255, 255, 0.7),
    rgba(255, 255, 255, 0) 58%
  ); */
  display: flex;
  align-content: center;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  overflow: hidden;
  white-space: pre-wrap;
  opacity: 0.9;
  text-align: center;
}

.name p {
  /* height: 20px; */
  margin: 10px;
}

.longName {
  font-size: 0.8em;
}

.rollerAni {
  animation-name: bubbles;
  z-index: 10;
}

.result {
  border-radius: 10px;
  /* border: 1px solid #f6f91a; */
  animation-name: showRes-1fdf2732;
  animation-duration: 0.5s;
  animation-timing-function: ease-in-out;
  position: fixed;
  background: #f1c477dd;
  z-index: 99;
  top: 40vh;
  width: 1000px;
  left: calc(50vw - 500px);
  overflow: hidden;
  box-shadow: 0 0 30px #8d8d8d87;
  max-height: 58vh;
  overflow-y: auto;
  padding: 10px;
}

.resultTitle {
  padding: 5px 0;
  text-align: center;
  font-size: 28px;
}

.luckyOne {
  padding: 0 15px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  font-size: 26px;
}

.luckyOneItem {
  padding: 3px 5px;
}

.allResult {
  z-index: 9999;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 20px;
}

.boxbox {
  position: relative;
  margin: 0 auto;
  width: 200px;
  height: 200px;
  text-align: center;
  display: inline-block;
  margin-top: 60px;
}

.boxbox img {
  width: 200px;
}

.action {
  transform-origin: 40% 50%;
  animation-name: ddd;
  animation-duration: 0.2s;
  animation-iteration-count: infinite;
  animation-timing-function: ease-in-out;
}

.actionBg {
  z-index: -1;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  content: 0;
  border-radius: 100%;
  border: 15px solid #e9e9e9;
  box-shadow: 0 0 20px #e9e9e9;
  opacity: 0;
  animation: warn 2s ease-out;
  animation-iteration-count: infinite;
}

.pendant-box {
  pointer-events: none;
}

.cloud {
  position: absolute;
  top: 20px;
  left: 20px;
  width: 200px;
}

.cloudbg {
  position: absolute;
  top: 180px;
  left: 80px;
  width: 500px;
}

.lantern {
  position: absolute;
  bottom: 20px;
  right: 20px;
  width: 200px;
}

.br {
  position: absolute;
  bottom: 20px;
  right: 20px;
  width: 200px;
}

.tr {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 200px;
}

.bl {
  position: absolute;
  bottom: 20px;
  left: 20px;
  width: 200px;
}

.op05 {
  opacity: 0.7;
}

.fireworks1 {
  position: absolute;
  top: 230px;
  left: 350px;
}

.fireworks2 {
  position: absolute;
  top: 380px;
  right: 400px;
}

.fireworks3 {
  position: absolute;
  bottom: 380px;
  left: 500px;
}

.fireworks4 {
  position: absolute;
  bottom: 180px;
  left: 150px;
}

.fireworks5 {
  position: absolute;
  bottom: 130px;
  right: 100px;
}

.happynewyear {
  position: absolute;
  left: 50%;
  transform: translate(-50%, 0);
  bottom: 20px;
  z-index: 1;
}

.slogan {
  position: absolute;
  left: 50%;
  transform: translate(-50%, 0);
  bottom: 10px;
  z-index: 1;
  color: #faca7a;
  font-size: 16px;
}

.couplet-b {
  position: absolute;
  left: 50%;
  transform: translate(-50%, 0);
  top: 10px;
  width: 400px;
}

.couplet-t {
  position: absolute;
  left: 50%;
  transform: translate(-50%, 0);
  top: -20px;
  width: 500px;
}

.couplet-l {
  position: absolute;
  top: 50%;
  transform: translate(0, -50%);
  left: 10px;
  width: 140px;
}

.couplet-r {
  position: absolute;
  top: 50%;
  transform: translate(0, -50%);
  right: 10px;
  width: 140px;
}
</style>
