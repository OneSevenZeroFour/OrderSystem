import React from "react";
import '../../css/myorder.css';
import UFooter from './ufooter.jsx';
import {connect} from "react-redux";
import io from "socket.io-client";
var socket = io("http://localhost:10002");

class Myorder extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            list:this.props.orderlist
            // list:[{img:"",name:"名字",price:18.00,num:2,state:"制作中..."}]
        }
        this.getList = () => {
            var self = this;
            if(this.props.orderid)
                $.ajax({
                    url: 'http://localhost:10002/getOrderlist',
                    type: 'POST',
                    data: {id: this.props.orderid},
                    success:function(data){
                        data = JSON.parse(decodeURI(data.content));
                        for(var i=0;i<data.length;i++)
                            data[i].state = data[i].state==0?"制作中...":"已上菜";
                        
                        // data = JSON.parse(data);
                        self.setState(Object.assign({},self.state,{
                            list:data
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
                            <img src={item.img} />
                            <div className="txt">
                                <p className="name">{decodeURI(item.name)}</p>
                                <p className="price">￥<span>{item.price}</span> &times; {item.num}</p>
                            </div>
                            <p className="state">{item.state}</p>
                            {item.state=="已完成"?<span>确认</span>:""}
                        </div>
                    })
                    :<p className="notyet">还没有下单哦~</p>
            }</div>
            <UFooter />
            </div>
            )
    }
    componentWillMount(){
        var self = this;
        this.getList();
        socket.on("get_order_state",function(data){
            console.log(data);
            self.getList();
        })
    }

    componentWillReceiveProps(){
    }
}

export default connect((state)=>{
    return state;
})(Myorder);