<template>
<div id="wall">
    <span 
        class="score" 
        v-if="scence===2||scence===3">
        {{score}}</span>
    <div 
        class="row"
        v-for="(row, y) in map"
        :key="y" >
        <div 
            :class="class_cell(num)"
            v-for="(num, x) in row"
            :key="x" ><span /></div>
    </div>
</div>
</template>

<script>
    import {for_each, turn_matrix, cut} from '../../src/utils/utils' // 效果和map()一样,只是map遍历的是一维数组, for_each是二维
    import Block from '../../src/js/block'
    import {map} from '../../src/assets/js/data'

    export default {
        props: ['scence'],
        mounted() {
            this.init()
        },
        // map中个数字代表的含义:
        // ---> 数字0: 空的cell
        // ---> 数字1: 黑色的cell
        // ---> 数字2: 固定了的cell
        // ---> 数字3: 会闪烁的红色cell
        data: ()=>({
            score: 0,
            map: map,
            cur_block: null,
            count: 0,
            fill_speed: 2,
        }),
        computed: {

        },
        methods: {
            class_cell(number) {
                if(number===0) return `cell cell00`
                if(number===1) return `cell cell01`
                if(number===2) return `cell cell01`
            },
            // 初始化
            init(scene) {
                if(scene===1) this.init01()
                if(scene===2) this.init02()
                if(scene===3) this.init03()
            },
            init01() {

            },
            init02() {
                this.score=0
                this.map = map
                this.cur_block=new Block()  // 生成一个block
                this.updata()               // 将block映射到map上
            },
            init03() {
                this.count=0
            },
            // 每秒下落一格
            fall() {
                this.count += this.cur_block.speed
                if(this.count>200) {
                    this.down()
                    this.count=0
                }
            },
            // 深克隆
            clone(data) {
                return JSON.parse(JSON.stringify(data))
            },
            // 将矩阵中所有的1去掉
            clear() {
                let map = this.clone(this.map)
                map = for_each(map, item=>{
                    if(item===1) return 0
                    else return item
                }) // 效果和map()一样,只是map遍历的是一维数组, for_each是二维
                this.map = this.clone(map)
            },
            // 将cur_block映射到map中
            updata() {
                let map = this.clone(this.map)
                let {x, y, matrix} = this.cur_block
                matrix = this.cur_block.get_xy(x,y,matrix)
                for_each(matrix, item=>{
                    let {number, x, y} = item
                    if(number===1) map[y][x]=1 
                })
                this.map = this.clone(map)
            },
            // 将block定死在wall上面
            put_into() {
                let map = this.clone(this.map)
                let {x, y, matrix} = this.cur_block
                matrix = this.cur_block.get_xy(x,y,matrix)
                for_each(matrix, item=>{
                    let {number, x, y} = item
                    if(number===1) map[y][x]=2
                })
                this.map = this.clone(map)
            },
            left() {
                // 准备矩阵
                let map = this.clone(this.map)                                  // 获取wall的矩阵, item=number
                let {matrix} = this.cur_block
                // 执行
                this.clear()
                this.cur_block.left(map, matrix)
                this.updata()
            },
            right() {
                let {map} = this
                let {matrix} = this.cur_block
                this.clear()
                this.cur_block.right(map, matrix)
                this.updata()
            },
            down() {
                let {map} = this
                let {matrix} = this.cur_block
                this.clear()
                let can = this.cur_block.can_down(map, matrix)
                  // 如果可以向下
                if(can) {
                    this.cur_block.down(map, matrix)
                    this.updata()
                } // 不能下而且y=0, --> gg
                else if(this.cur_block.y===0){
                    this.put_into()
                    this.$emit('change', 3)
                } // 不能下而且y!=0, 定死在wall上
                else {
                    this.put_into()
                    this.check()
                    this.cur_block = new Block()
                    this.updata()
                }
            },
            turn() {
                let {map} = this
                this.clear()
                this.cur_block.turn(map)
                this.updata()
            },
            // 快速下落
            right_now() {
                this.cur_block.speed = 200
            },
            // 消行
            check() {
                let map = this.clone(this.map)
                map.forEach((row, index) => {
                    row = [...new Set(row)] // 去重
                    if(row.length===1&&row[0]===2) {
                        map.splice(index, 1)
                        map.unshift([0,0,0,0,0,0,0,0,0,0])
                        this.score += 1
                    }
                })
                this.map = this.clone(map)
            },
            // 游戏结束-->填充
            fill() {
                this.count += this.fill_speed
                if(this.count<10) return
                let map = this.clone(this.map)
                for (let i=map.length-1; i>=0; i--) {
                    let row = [...new Set(map[i])]  // 去重, 看一下这一行有几种数字
                    if(row.length===2){
                        map.splice(i,1, [2, 2, 2, 2, 2, 2, 2, 2, 2, 2])
                        break;
                    }        // 当游戏结束时每一行必定有两种数字
                }
                this.map = map
                this.count = 0
            }
        }
    }
</script>

<style scoped>
#wall{
    background-color: #9ead86;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-around;
    padding-top: 1px;
}
.score{
    position: absolute;
    width: 180px;
    height: 60px;
    top: 0;
    left: 0;
    line-height: 60px;
    font-size: 50px;
    color: #f44336;
}
.row{
    display: flex;
    justify-content: space-around;
    align-items: flex-start;
    height: 8%;
}
.cell{
    flex: none;
    width: 8.7%;
    height: 95%;
    border-radius: 8%;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
}
.cell span{
    width: 87%;
    height: 87%;
    border-radius: 12%;
}
.cell00{
    opacity: .5;
    border: 1.5px solid #879372;
}
.cell01{
    border: 1.5px solid #000;
}
.cell02{
    border: 1.5px solid red;
}
.cell00 span{
    background-color: #879372;
}
.cell01 span{
    background-color: #000;
}
.cell02 span{
    background-color: skyblue;
}
</style>