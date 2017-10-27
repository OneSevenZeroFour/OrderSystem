import React from "react";
import '../../css/myorder.css';
import UFooter from './ufooter.jsx';
import {connect} from "react-redux";
import io from "socket.io-client";
var socket = io("http://10.3.132.65:10002");

class Myorder extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            list:this.props.orderlist
            // list:[{img:"",name:"名字",price:18.00,num:2,state:"制作中..."}]
        }
        this.getList = () => {
            var self = this;
            if(window.localStorage.getItem("desk_num"))
                $.ajax({
                    url: 'http://10.3.132.65:10002/getOrderlist',
                    type: 'POST',
                    data: {id: window.localStorage.getItem("desk_num")},
                    success:function(data){
                        var arr = [];
                        for(var i=0;i<data.length;i++){
                            var arr_mid = JSON.parse(decodeURI(data[i].content));
                            for(var j=0;j<arr_mid.length;j++){
                                // console.log(arr_mid[j]);
                                arr_mid[j].state = arr_mid[j].state==0?"准备中...":"已上菜";
                                arr.push(arr_mid[j]);
                            }

                        }
                        
                        // data = JSON.parse(data);
                        self.setState(Object.assign({},self.state,{
                            list:arr
                        }));
                    }
                });
            
        }
    }

    render(){
        return(<div className="myorder">
                <div className="order">
            {   this.state.list&&this.state.list.length>0?
                    this.state.list.map(function(item,idx){
                        return <div className="li" key={'oli'+idx}>
                            <header>
                            <img src={item.img} />
                            </header>
                            <div className="txt">
                                <p className="name">{decodeURI(item.name)}</p>
                                <p className="price">￥<span>{item.price}</span> &times; {item.num}</p>
                            </div>
                            <p className="state">{item.state}</p>
                            {item.state=="已完成"?<span>确认</span>:""}
                        </div>
                    })
                    :<p className="notyet">没点餐,去菜单下单哦~</p>
            }</div>
            <UFooter />
            </div>
            )
    }
    componentDidMount(){
        var self = this;
        this.getList();
        socket.on("get_order_state",function(data){
            // console.log(data);
            if(data.desk===self.props.desk)
                self.getList();
        });
    }
}

export default connect((state)=>{
    return state;
})(Myorder);