<template>
  <div class="flashing-text-comp">
    <div class="container">
      <span class="text">HELLO!</span>
      <span class="back"></span>
      <span class="shine"></span>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
};
</script>
<style scoped>
.flashing-text-comp .container {
  filter: brightness(300%);
  overflow: hidden;
}
span.text {
  color: #fff;
  font-size: 200px;
  font-weight: bold;
  background-color: transparent;
}
span.text::before {
  /* content: attr(data-text); */
  content: 'HELLO!';
  position: absolute;
  /* 设置混合模式为：差别 */
  mix-blend-mode: difference;
  /* 模糊滤镜 */
  filter: blur(2px);
}
span.back {
  /* 渐变背景 */
  /* background: linear-gradient(113deg, rgba(1, 96, 186,1),rgba(128, 17, 128,1)); */
  background: linear-gradient(
    113deg,
    rgba(193, 148, 63, 1),
    rgba(238, 205, 108, 1)
  );
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  /* 设置混合模式为：乘法（类似PS的正片叠底） */
  mix-blend-mode: multiply;
}
span.shine {
  /* 径向渐变背景，并且尺寸缩放为25%，按照默认方式平铺 */
  background: radial-gradient(circle at center, white, black 35%) center / 25%
    25%;
  position: absolute;
  top: -100%;
  left: -100%;
  bottom: 0;
  right: 0;
  /* 设置混合模式：颜色减淡 */
  mix-blend-mode: color-dodge;
  /* 执行动画：动画名 时长 线性的 无限次播放 */
  animation: move 2s linear infinite;
}

/* 定义动画 */
@keyframes move {
  to {
    transform: translate(50%, 50%);
  }
}
</style>
