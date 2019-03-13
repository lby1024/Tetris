<template>
    <div
        @touchstart="touchstart"
        @touchmove.prevent="touchmove"
        @touchend="touchend" 
        id="app">
        <wall 
            :scence="scence"
            ref="wall" 
            @change="change_scene"/>
        <btn 
            :scence="scence"
            @start="start" />
    </div>
</template>

<script>
    import wall from '../src/components/wall'
    import btn from '../src/components/btn'

    export default {
        components: {wall, btn},
        data: ()=>({
            scence: 1,
            cur_block: null,
            is_game_start: true,
            x: 0,               // 手指在x方向的位移, x = move_ing_x - move_start_x
            y: 0,               // 手指在y方向的位移, y = move_ing_y - move_start_y
            move_start_x: 0,
            move_start_y: 0,
            move_ing_x: 0,
            move_ing_y: 0,
        }),
        mounted() {
            this.init01()
            this.loop()
            // 事件监听=====================================================
            window.addEventListener('keydown', e=>{
                let {keyCode} = e
                // console.log(keyCode)
                if(keyCode===65||keyCode===37) this.left()    // a键: 向右
                if(keyCode===68||keyCode===39) this.right()   // d建: 向左
                if(keyCode===87||keyCode===38) this.turn()    // w建: 旋转
                if(keyCode===32||keyCode===40) this.fall()    // 空格:加速
            })
        },
        methods: {
            loop() {
                let loop = () => {
                    let {scence} = this
                    if(scence===1) this.scence01()
                    if(scence===2) this.scence02()
                    if(scence===3) this.scence03()
                    if(this.is_game_start) this.timer=window.requestAnimationFrame(loop)
                } // 必须使用箭头函数否则有this指向问题
                this.timer = window.requestAnimationFrame(loop)
            },
            // 场景01初始化
            init01(){
                
            },
            // 场景01循环
            scence01() {
                
            },
            // 场景02初始化
            init02(){
                this.$refs['wall'].init(this.scence)
            },
            // 场景02循环
            scence02() {
                this.$refs['wall'].fall()
            },
            // 场景03初始化
            init03(){
                this.$refs['wall'].init(this.scence)
            },
            // 场景03循环
            scence03() {
                this.$refs['wall'].fill()
            },
            // 点击按钮left
            left() {
                if(this.scence!==2) return
                this.$refs['wall'].left()

            },
            // 点击按钮 right
            right() {
                if(this.scence!==2) return
                this.$refs['wall'].right()
            },
            down() {
                if(this.scence!==2) return
                this.$refs['wall'].down()
            },
            // 点击按钮 旋转
            turn() {
                if(this.scence!==2) return
                this.$refs['wall'].turn()
            },
            // 点击按钮 快速下落
            fall() {
                if(this.scence!==2) return
                this.$refs['wall'].right_now()
            },
            // 点击开始按钮
            start() {
                this.scence = 2
                this.init02()
            },
            // 修改场景
            change_scene(scence) {
                this.scence = scence
            },
            // 滑动事件===========================================
            touchstart(e) {
                this.move_start_x = e.targetTouches[0].clientX
                this.move_start_y = e.targetTouches[0].clientY
            },
            touchmove(e) {
                this.move_ing_x = e.targetTouches[0].clientX
                this.move_ing_y = e.targetTouches[0].clientY
                this.x = this.move_ing_x-this.move_start_x
                this.y = this.move_ing_y-this.move_start_y
            },
            touchend(e) {
                let {x, y} = this
                let ab_x = Math.abs(x)
                let ab_y = Math.abs(y)
                if(x>10 && ab_x>ab_y) this.right()
                if(x<-10&& ab_x>ab_y) this.left()
                if(y>10 && ab_y>ab_x) this.fall()
                if(y<-10&& ab_y>ab_x) this.turn()
            }
        }
    }
</script>

<style>
    body{
        background-color: #000;
        height: 100vh;
        width: 100vw;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    #app{
        overflow: hidden;
        height: 100%;
        width: 100%;
        max-height: 820px;
        max-width: 430px;
        background-color: #fff;
        margin: 0 auto;
        position: relative;
    }

</style>
