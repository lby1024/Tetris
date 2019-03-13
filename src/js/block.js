import {for_each} from '../../src/utils/utils' // 效果和map()一样,只是map遍历的是一维数组, for_each是二维
import {blocks} from '../../src/assets/js/data'

export default class Block {
    constructor() {
        this.x = 4
        this.y = 0
        this.speed = 3.9
        this.num = parseInt(Math.random()*4)     // 类型
        this.number = 0                          // 旋转方向
        this.matrix = blocks[this.num][this.number]
    }
    // 获取每个格子的绝对坐标
    // ab_x = re_x + this.x -----> 绝对坐标 = 参考点+相对坐标
    // 参数1 : block在墙上的x坐标
    // 参数2 : block在墙上的y坐标
    // 参数3 : block的矩阵   item = number
    // return 矩阵, 里面每个 item = {x,y,number}
    get_xy(x, y, matrix) {
        return for_each(matrix, (item,re_x,re_y)=>({
            x: re_x+x,
            y: re_y+y,
            number: item,
        }))
    }
    // 检查这个block中是否有无法投射的点
    // 参数1 : block的x坐标
    // 参数2 : block的y坐标
    // 参数3 : block的矩阵 item = number
    // 参数4 : wall的矩阵  item = number
    // return: [{x,y,1}, {x,y,1}, ... ]
    get_err_cells(x, y, matrix, map) {
        matrix = this.get_xy(x, y, matrix) // 获取block中所有点的绝对坐标
        let result = []
        for_each(matrix, item=>{
            let {number, x, y} = item
            if(number===1){
                // console.log('x坐标:', x,'number:', map[y][x])
                if(x<0
                || x>9
                || y<0
                || y>19
                || map[y][x]===2 ) result.push(item)
            }
        })
        return result
    }
    // 参数1 : 墙的矩阵
    // 参数2 : block的矩阵
    can_right(map, matrix) {
        let x = this.x+1
        let y = this.y
        let arr = this.get_err_cells(x, y, matrix, map)
        return arr.length===0?true:false    // 如果数组为空说明没有不合格的cell可以投射,否则不能投射
    }
    // 参数1 : 墙的矩阵, item=number
    // 参数2 : block的矩阵, item=number
    right(map, matrix) {
        let can = this.can_right(map, matrix)
        if(!can) return
        this.x += 1
    }
    // 参数1 : 墙的矩阵, item=number
    // 参数2 : block的矩阵, item=number
    can_left(map, matrix) {
        let x = this.x-1
        let y = this.y
        let err_cells = this.get_err_cells(x, y, matrix, map)
        return err_cells.length===0?true:false    // 如果数组为空说明没有不合格的cell可以投射,否则不能投射
    }
    // 参数1 : 墙的矩阵, item=number
    // 参数2 : block的矩阵, item=number
    left(map, matrix) {
        let can = this.can_left(map, matrix)
        if(!can) return
        this.x -= 1
    }
    // 参数1 : 墙的矩阵, item=number
    // 参数2 : block的矩阵, item=number
    can_down(map, matrix) {
        let x = this.x
        let y = this.y+1
        let err_cells = this.get_err_cells(x, y, matrix, map)
        return err_cells.length===0?true:false
    }
    // 参数1 : 墙的矩阵, item=number
    // 参数2 : block的矩阵, item=number
    down(map, matrix) {
        let can = this.can_down(map, matrix)
        if(can) this.y += 1
    }
    // 参数1 : 墙的矩阵, item=number
    can_turn(map) {
        let {num, number, x, y} = this
        number++
        if(number>3) number = 0
        let matrix = blocks[num][number]
        let err_cells = this.get_err_cells(x, y, matrix, map)
        if(err_cells.length===0) return '没有不合格的cell'
        else                     return this.find_reason(err_cells)
    }
    // 参数1 : 墙的矩阵, item=number
    turn(map) {
        let {num, number} = this
        let reson = this.can_turn(map)
        if(reson==='没有不合格的cell') {
            number = number+1
            if(number>3) number=0
            this.number = number
            this.matrix = blocks[num][number]
        }else if(reson==='撞到左边墙了') {
            number = number+1
            if(number>3) number=0
            this.number = number
            this.matrix = blocks[num][number]
            this.x+=1
        }else if(reson==='撞到右边墙了') {
            number = number+1
            if(number>3) number=0
            this.number = number
            this.matrix = blocks[num][number]
            if(this.matrix.length===3) this.x-=1
            if(this.matrix.length===4) this.x-=2
        }else if(reson==='撞到数字2了') {
            console.log(reson)
        }else if(reson==='既撞到墙了,又碰到数字2了') {
            console.log(reson)
        }
    }
    // 找出旋转的时候发生碰撞的原因
    // 参数: err_cells = [{x,y,number}, ... ]
    find_reason(err_cells) {
        let list = []
        err_cells.map(item=>{
            if(item.x<0) {
                list.push('撞到左边墙了')
            }
            else if(item.x>9) {
                list.push('撞到右边墙了')
            }
            else list.push('撞到数字2了')
        })
        list = [...new Set(list)]       // 去重
        if(list.length===2) return '既撞到墙了,又碰到数字2了'
        else return list[0]
    }
    // 快速下落
    right_now(map, matrix) {
        
    }
}