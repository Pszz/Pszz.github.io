<!--
  DESC: 描述
  created: 2018.11.02
  author: Pi
-->

<template>
  <section class="ai-layer">
    <div class="ai-box" :class="{'ai-box-show': show}">
      <ul class="opt">
        <li
          v-for="(item, index) in msgItem"
          :key="index"
          :class="{'gm': !item.type}"
          v-text="item.msg"
        ></li>
      </ul>
      <div class="input">
        <input type="text" v-model="msg">
        <input type="button" value="发送" @click="onSend">
      </div>
    </div>
    <div class="ai-open" @click="onShow()">AI</div>
  </section>
</template>

<script>
export default {
  name: 'AI',
  data () {
    return {
      show: false,
      msgItem: [],
      stash: [],
      msg: ''
    }
  },
  mounted () {
    document.onkeyup = ev => {
      if (ev.keyCode === 13) {
        this.onSend()
      }
    }
  },
  methods: {
    onShow () {
      this.show = !this.show
      if (!this.show) {
        this.msgItem = []
        this.stash = []
        this.msg = []
      } else {
        this.stash = [{
          type: 0,
          msg: '欢迎进入人机交互'
        }]
        setTimeout(() => {
          this.onRender()
        }, 1000)
      }
    },
    onSend () {
      let val = this.msg.trim()
      if (val) {
        // 添加问题
        this.stash.push({
          type: 1,
          msg: val
        })
        this.msg = ''
        this.onRender()
        setTimeout(() => {
          // 添加回复
          this.stash.push({
            type: 0,
            msg: val.replace(/\?|？/g, '! ').replace(/吗|啊/g, '')
          })
          this.onRender()
        }, parseInt(Math.random() * 3000))
      }
    },
    onRender () {
      this.msgItem.push(this.stash.shift())
    }
  }
}
</script>

<style lang='less' scoped>
.ai-layer {
  position: fixed;
  bottom: 50px;
  right: 50px;
  z-index: 999;
}
.ai-open {
  height: 60px;
  width: 60px;
  border-radius: 50%;
  text-align: center;
  line-height: 60px;
  background-color: #ff5722;
  color: #fff;
  font-weight: bold;
  float: right;
}
.ai-box {
  width: 0;
  height: 0;
  margin: 0 auto;
  border: 1px solid #ccc;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  overflow: hidden;
  transition: width 0.5s ease, height 0.5s ease;
  .input {
    height: 40px;
    border-top: 1px solid #ccc;
    display: flex;
    input {
      border: 0 none;
    }
    input:first-child {
      flex: 1;
      text-align: center;
    }
    input:last-child {
      width: 100px;
    }
  }
  .opt {
    flex: 1;
    overflow: auto;
    li {
      font-size: 14px;
      color: red;
      list-style: lao;
    }
    .gm {
      list-style: thai;
      color: goldenrod;
    }
  }
}
.ai-box-show {
  width: 600px;
  height: 600px;
}
</style>
