<template>
    <div class="btns" v-if="scence===1||scence===3">
        <img  
            @click="start" 
            src="../../src/assets/image/start.png" alt="">
        <div :class="clas">
            <p>左移: 手指左滑 or A键</p>
            <p>右移: 手指右滑 or D键</p>
            <p>旋转: 手指上滑 or W键</p>
            <p>加速: 手指下滑 or 空格</p>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['scence'],
        computed:{
            clas() {
                if(this.scence===1) return 'text'
                else return 'text mark'
            }
        },
        methods: {
            start() {
                this.$emit('start')
            }
        }
    }
</script>

<style scoped>
    .btns{
        width: 100%;
        height: 100%;
        /* background-color: red; */
        position: absolute;
        bottom: 0px;
        left: 0;
        display: flex;
        flex-flow: column nowrap;
        justify-content: space-between;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .btns img{
        display: block;
        width: 120px;
        height: 120px;
    }
    .btns .text{
        box-sizing: border-box;
        padding-top: 30px;
        padding-left: 18px;
        width: 210px;
        height: 210px;
        border: 7px solid #f44336;
        border-radius: 18px;
    }
    .btns .text p {
        font-size: 16px;
        font-weight: bolder;
        margin-bottom: 18px;
        color: #f44336;
        user-select:none;
    }
    .mark {
        background-color: rgba(0, 0, 0, .5)
    }
</style>