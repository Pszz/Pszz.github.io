<template>
    <section class="container-fluid">
        <div class="anim-box">
            <div class="anim-l"></div>
            <h1 class="title">
                    <span>For Learning</span>
                    <router-link to="/main">Go</router-link>
                 </h1>
            <div class="anim-r"></div>
        </div>
    </section>
</template>

<script>
export default {
    name: 'Index'
}
</script>

<style scoped lang="less">
@import "../assets/css/core.less";
.container-fluid {
    height:100%;
    background-color: @theme-color;
    .title {
        font-size: 50px;
        font-weight: bold;
        color: #fff;
        text-shadow: 1px 1px 1px #a7a4a4;
        position: relative;
        height: 150px;
        margin: 0;
        a {
            color: #fff;
            position: absolute;
            z-index: 1;
            opacity: 0;
            .-trans(all, 0.5s);
            top: 50px;
            left: 150px;
        }
        span {
            .-trans(all,0.3s);
            opacity: 1;
            position: absolute;
            width: 100%;
            left: 0;
            top: 50px;
        }
        &:hover span {
            opacity: 0;
        }
        &:hover a {
            display: inline;
            opacity: 1;
        }
    }
    .anim-box {
        top: 30%;
        position: absolute;
        left: 0;
        right: 0;
        margin: 0 auto;
        width: 380px;
        text-align: center;
    }
    .anim-l,
    .anim-r {
        width: 100%;
        border-top: 1px solid #fff;
        position: absolute;
    }
    .anim-l:after,
    .anim-r:after {
        content: " ";
        position: absolute;
        z-index: 1;
        border-radius: 50%;
        background-color: #fff;
        border: 6px solid #fff;
        top: -13px; //transition: left 3s ease-out;
    }
    .anim-l:after {
        left: 365px;
        .-anima(anim-l, 3s, linear, 0s, infinite, alternate);
    }
    .anim-r:after {
        left: 0;
        .-anima(anim-r, 3s, linear, 0s, infinite, alternate);
    }
    @keyframes anim-l {
        0% {
            left: 365px;
            top: 0px;
        }
        25% {
            top: 140px;
        }
        50% {
            top: 0px;
        }
        75% {
            top: 140px;
        }
        100% {
            left: 0;
            top: 0px;
        }
    }
    @keyframes anim-r {
        0% {
            left: 0px;
        }
        25% {
            left: 273.75px;
        }
        50% {
            left: 0;
        }
        75% {
            left: 91.25px;
        }
        100% {
            left: 365px;
        }
    }
}
</style>
