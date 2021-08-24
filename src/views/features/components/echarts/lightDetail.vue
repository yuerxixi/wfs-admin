<template>
  <div class="loading" style="width: 100%;height: 100%">
    <div>
      <div class="left" />
      <div class="right" />
      <div class="progress">
        <span style="margin-top: 25px;font-size: 24px;margin-bottom: 10px;font-weight: bold">90%</span>
        <span style="color: #909399;font-size: 12px;">亮灯率</span>
      </div>
    </div>
    <div style="color:rgba(255, 255, 255, 0.6);font-size: 14px;position: absolute;right: 60px;top: 10px">
      <div v-for="item in dataType" :key="item.index" style="margin-top: 10px"><span>{{ item.name }}</span> <span style="font-size: 18px;margin-left: 20px">{{ item.value }}</span></div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'LightDetail',
  data() {
    return {
      dataType: [
        { value: '125个', name: '灯具总数' },
        { value: '162.2kw.h', name: '预计能耗' },
        { value: '162.2kw.h', name: '实际能耗' }
      ]
    }
  },
  computed: {

  },
  mounted() {
  },
  methods: {

  }
}
</script>

<style scoped>
  .loading {
    margin:20px 0 0 30px;
    width: 7em;
    height: 7em;
    position: relative;
  }

  .loading .progress {
    display: flex;
    flex-direction: column;
    position: absolute;
    width: 6em;
    height: 6em;
    background-color:#050b20;
    border-radius: 50%;
    left: 1em;
    top: 1em;
    /*line-height: 6em;*/
    text-align: center;
  }

  .left,
  .right {
    width: 4em;
    height: 8em;
    overflow: hidden;
    position: relative;
    float: left;
    background-color:rgba(5, 11, 32, 0.3)
  }

  .left {
    border-radius: 8em 0 0 8em;
  }

  .right {
    border-radius: 0 8em 8em 0;
  }

  .left:after,
  .right:after {
    content: "";
    position: absolute;
    display: block;
    width: 4em;
    height: 8em;
    /*background-color: white;*/
    border-radius: 8em 0 0 8em;
    background: linear-gradient(180deg, rgba(27, 253, 252, 0.6) 0%, rgba(48, 106, 255, 0.6) 80%);
  }

  .right:after {
    content: "";
    position: absolute;
    display: block;
    border-radius: 0 8em 8em 0;
  }
  .left:after {
    transform-origin: right center;
  }

  .right:after {
    transform-origin: left center;
    transform: rotateZ(45deg);
  }
</style>
