import React from "react";
import TableCell from "./tableCell.jsx";
import {connect} from "react-redux";
import "../../../css/kitchen.scss";
import axios from "axios";
import io from "socket.io-client";

var socket = io("http://10.3.132.65:10002");

class Kitchen extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            kitchen: [],
            currentTab: -1
        }
        this.loadKitchen = this.loadKitchen.bind(this);
    }  
    loadKitchen(self){
        axios.get("http://10.3.132.65:10002/kitchen")
            .then(function(res){
                console.log(res);
                var curtab = 0;
                // console.log(self.props.store);
                if(self.props.store){
                    curtab = self.props.store.currentTab;
                    console.log(curtab)
                }
                self.props.setStore({
                    kitchen: res.data,
                    currentTab: curtab
                });
                console.log(self.props["store"])
            })
            .catch(function(err){
                console.log(err);
            });
    }
    componentDidMount() {
        this.loadKitchen(this);
        var self = this;
        console.log(socket)
        socket.on("confirmOrder",function(data){
            console.log(data);
            self.loadKitchen(self);
        })
    }

    switchTab(ev,idx){
        ev.preventDefault();
        if(this.props.store.currentTab != idx){
            console.log("switch")
            // this.setState(Object.assign({},this.state,{currentTab: idx}))
            this.props.setStore(Object.assign({}, this.props.store,{currentTab:idx}))
        }
    }

    render(){
        return (
            <div id="kitchen">
                <header>
                    <h1>后厨系统</h1>
                </header> 
                <div className="kitchen-wrap">    
                    <div className="kitchen-table">
                        <ul className="tablelist">
                            {/* 左侧桌号列表 */}
                            {
                                (function(self){
                                    if(self.props["store"]){
                                        return self.props.store.kitchen.map((item, index) => {
                                            return (
                                                <li className={"tableItem"+" "+(self.props.store.currentTab==index?"tableItem-sel":"")} key={index*2} onClick={(e) => { self.switchTab(e,index)}}>
                                                    {item.desk}桌
                                                </li>)
                                        }) 
                                    }
                                })(this)
                            } 
                        </ul>
                    </div>
                    <div className="kitchen-main">
                        <div className="main-wrap">
                            {/* 右侧桌号对应订单 */}
                            {
                                (function(self){
                                    if(self.props["store"]){
                                        if(self.props.store.kitchen.length > 0){
                                            let item = self.props["store"]["kitchen"][self.props["store"]["currentTab"]];
                                            return (<TableCell arg={item} socket={socket} tabidx={self.props["store"]["currentTab"]}/>)
                                        }else{
                                            return (
                                                <div className="nodata">
                                                    <p>没有数据啦</p>
                                                </div>
                                            )
                                        }
                                    }
                                })(this)
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default connect((state) => {
    console.log(state);
    return state;
}, (dispatch) => {
    return {
        setStore(kit) {
          dispatch({type: "KITCHEN", store: kit})
        }
      }
})(Kitchen)
