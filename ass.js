var obj1 = {
    a:1,
    b:2,
    c:{
        d:3,
        e:{
            f:22
        }
    }
},
obj2 = {

        e:{
            f:66
        }

}
console.log(obj1);
var obj = Object.assign({},obj1,obj2);
console.log(obj)