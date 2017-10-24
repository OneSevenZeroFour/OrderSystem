
import React from "react";
import '../../css/footer.css';
import {connect} from "react-redux";
import io from "socket.io-client";
var socket = io("http://localhost:10002");

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
                    herfs:"#/myorder",
                    clas:"icon-activity_fill"
                },{
                    title:"呼叫结账",
                    herfs:"javascript:;",
                    clas:"icon-financial_fill"
                }
            ],
            bg_num:this.props.bg_num
        }
        this.change_bg = (e) => {
            var idx = e.target.dataset.idx;
            if(idx==0||idx==2)
                this.props.dispatch({type:"changebg",bg_num:idx});
            this.setState(Object.assign({},this.state,{
                bg_num:idx
            }));
            if(idx==1)
                this.callServer();
            if(idx==3)
                this.callPay();
        }

        this.callServer = () => {
            //呼叫服务员
            console.log('callServer');
            socket.emit('callServer',{id:this.props.desk});
        }
        this.callPay = () => {
            //来结帐啦
            console.log("call to pay");
            socket.emit("callToPay",{id:this.props.desk});
        }

    }

    render(){
        return(
            <footer>
                <ul className="foot_menu">
                {
                    this.state.list.map(function(item,idx){
                        return <li key={idx}>
                                <a href={item.herfs} data-idx={idx} onClick={this.change_bg} className={this.state.bg_num == idx?"active_bg":""}><i className={'iconfont '+item.clas}></i>{item.title}</a>
                            </li>
                        }.bind(this))
                    }
                </ul>
            </footer> 
        )
    }
    componentWillReceiveProps(){
        this.setState(Object.assign({},this.state,{
            bg_num:this.props.bg_num
        }))
        console.log(this.state);
    }

}

export default connect((state)=>{
    return state;
})(Ufooter);

