<template>
  <div id="app">
    <div :class="setupClass"
         id="setup">
      <div class="prog">
        <span v-text="progress"></span>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
  data() {
    return {
      progress: 0,
      setupClass: ''
    }
  },
  watch: {
    '$route'(to, from) {
      this.loading();
    }
  },
  methods: {
    loading: function (s) {
      var that = this, temp = 0;
      this.setupClass = "setup";
      var timer = setInterval(function () {
        temp = temp + 5;
        if (temp > 99) {
          that.progress = "OK";
          clearInterval(timer);
          setTimeout(function () {
            that.setupClass = "hd";
          }, 800)
        } else {
          that.progress = temp + "%";
        }
      }, 50);
    }
  },
  created() {
    this.loading();
  }
}
</script>

<style lang="less">
@import "assets/css/core.less";
html,
body,
#app {
  height: 100%;
}

.hd {
  display: none;
}

.setup {
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: @theme-color;
  z-index: 9999;
  top:0;
  left:0;
  .prog {
    background-color: #fff;
    position: absolute;
    width: 100%;
    height: 100%;
    margin: auto;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    span {
      font-size: 20px;
      font-weight: bold;
      position: absolute;
      background-color: #fff;
      text-align: center;
      width: 100%;
      height: 100px;
      border-radius: 50%;
      margin: auto;
      left: 0;
      right: 0;
      bottom: 0;
      top: 0;
      line-height: 100px;
    }
  }
}
.setup{
  .-anima(anim-setup, 0.7s, linear, 1.5s, 1);
}
.setup .prog {
  .-anima(anim-prog, 1.5s, ease-out, 0s, 1);
}
@keyframes anim-setup {
  0%{opacity:0.8}
  100%{opacity:0}
}
@keyframes anim-prog {
  0% {
    width: 100%;
    height: 100px;
  }
  100%{
    width: 100%;
    height: 100%;
  }
}
</style>