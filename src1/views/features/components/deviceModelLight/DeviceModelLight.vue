<template>
  <div class="light-wrap">
    <span
      v-for="(item, index) in lightMaxNum"
      :key="index"
      :class="['lightBlock', {'active': index < lightNum}]"
    />
  </div>
</template>

<script>
export default {
  name: 'DeviceModelLight',
  props: {
    lightNum: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      lightMaxNum: 5
    }
  }
}
</script>

<style lang="scss" scoped>
.light-wrap{
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  .lightBlock{
    width: 8px;
    height: 8px;
    border-radius: 2px;
    background-color: #024C54;
    margin-right: 4px;
  }
  .active{
    background-color: #00FFF0;
  }
}
</style>
