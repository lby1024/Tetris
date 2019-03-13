// 遍历矩阵的每一个item
// 效果和map()一样,只是map遍历的是一维数组, for_each是二维
// 参数1 : matrix: 二维数组
// 参数2 : 回调函数
export function for_each(matrix, callback) {
    //
    (callback)
    // 判断matrix是否是数组
    let is_arr = matrix instanceof Array
    if(!is_arr) return console.error('请输入维度至少为二的数组')
    // 遍历matrix
    return matrix.map((row, y)=>{
        // 判断row是否是数组
        let is_arr = row instanceof Array
        if(!is_arr) return console.error('数组维度低于二')
        // 遍历row
        return row.map((item, x)=>{
            return callback(item, x, y)
        })
    })
}

// 获取转置矩阵
export function turn_matrix(map) {
    let arr = []
    for_each(map, (item, x, y) => {
        if(arr[x]) arr[x].push(item)
        else {
            arr[x] = []
            arr[x].push(item)
        } 
    })
    return arr
}

// 数组切割 [1,1,1,2,2,2,0,0,0] -----> [[1,1,1],[2,2,2],[0,0,0]]
export function cut(arr) {
    let start
    let end
    let list = []
    arr.map((number, index)=>{
        if(index===0){
            start={number, index}
            end = {number, index}
        }
        else {
            end = {number, index}
            // 情况01
            // [0, 0, 0, 1, 1, 1]
            //  ↑        ↑ 
            if(
                start.number!==end.number
                &&index!==arr.length-1
            ) {
                let array = [...arr]
                list.push(array.splice(start.index, end.index-start.index))
                start = {number, index}
            }
            // 这种情况02
            // [0, 0, 0, 1, 1, 1, 2]
            //           ↑        ↑ 
            else if(
                start.number!==end.number
                &&index===arr.length-1
            ) {
                let array = [...arr]
                list.push(array.splice(start.index, end.index-start.index))
                list.push(array.splice(index))
                start = {number, index}
            }
            // 这种情况03
            // [0, 0, 0, 1, 1, 1]
            //           ↑     ↑ 
            else if(
                start.number===end.number
                &&index===arr.length-1
            ) {
                let array = [...arr]
                list.push(array.splice(start.index))
                start = {number, index}
            }
        }
    })
    return list
}
