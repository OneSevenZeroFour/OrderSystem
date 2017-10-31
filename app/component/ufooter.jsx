
import React from "react";
import '../../css/footer.css';
import {connect} from "react-redux";
import io from "socket.io-client";
var socket = io("http://10.3.132.65:10002");

class Ufooter extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            list:[
                {
                    title:"菜单",
                    herfs:"#/user",
                    clas:"icon-shop_fill"
                },{
                    title:"服务铃",
                    herfs:"javascript:;",
                    clas:"icon-remind_fill"
                },{
                    title:"我的订单",
                    herfs:"javascript:;",
                    clas:"icon-activity_fill"
                },{
                    title:"呼叫结账",
                    herfs:"javascript:;",
                    clas:"icon-financial_fill"
                }
            ],
            bg_num:this.props.bg_num,
            haso:this.props.hasorder
        }
        this.change_bg = (e) => {
            var idx = e.target.dataset.idx;
            if(idx==0||(idx==2&&this.state.haso)){
                this.props.dispatch({type:"changebg",bg_num:idx});
                this.setState(Object.assign({},this.state,{
                    bg_num:idx
                }))
            };
            if(idx==1){
                console.log(this)
                this.setState(Object.assign({},this.state,{
                    bg_num:idx
                }))            
                this.callServer();
                this.cleared();
            };
            if(idx==3){
                this.setState(Object.assign({},this.state,{
                    bg_num:idx
                }))                 
                this.callPay();
            };
        }
        this.callPay = () => {
            //来结帐啦
            console.log("call to pay");
            socket.emit("callToPay",{id:window.localStorage.getItem("desk_num")});
        }

    }

    render(){
        var self = this;
        return(
            <footer>
                <ul className="foot_menu">
                {
                    self.state.list.map(function(item,idx){
                        return <li key={idx}>
                                <a href={idx==2&&self.state.haso?"#/myorder":item.herfs} data-idx={idx} onClick={self.change_bg} className={self.state.bg_num == idx?"active_bg":""}>
                                <i className={'iconfont '+item.clas+' '+ (self.state.bg_num == idx?"call_server":"")} ref={idx == 1?"service":""}></i>
                                {self.state.bg_num == idx&&item.title == "服务铃"?"店小二正火速赶来!":item.title}
                                </a>
                            </li>
                        })
                    }
                </ul>
            </footer> 
        )
    }
    componentDidMount(){
        this.callServer = () => {
            //呼叫服务员 每隔3秒 发送一次socket消息
            console.log('callServer');
            this.refs.service.classList.add("call_server");
            this.timer = setInterval(()=>{
                socket.emit('callServer',{id:window.localStorage.getItem("desk_num")});
                console.log("emit callServer")
            },2000)
        }
        //呼叫服务员 30秒自动清除定时器 清除样式(bug)
        this.cleared = ()=>{
            setTimeout(()=>{
                clearInterval(this.timer);
                this.refs.service.classList.remove("call_server");
                socket.emit("callOver",{id:window.localStorage.getItem("desk_num"),status:'呼叫服务'})
                console.log("emit callServer 样式已被清除")
            },10000)
        }
    }
    componentWillUnmount(){
        //组件销毁 也清除socket发送 以及样式
            clearInterval(this.timer);
            this.refs.service.classList.remove("call_server")
            console.log("emit callServer 样式已被清除,组件销毁!")        
    }
    componentWillReceiveProps(nextProps){
        this.setState(Object.assign({},this.state,{
            bg_num:nextProps.bg_num,
            haso:nextProps.hasorder
        }));
    }

}

export default connect((state)=>{
    return state;
})(Ufooter);

