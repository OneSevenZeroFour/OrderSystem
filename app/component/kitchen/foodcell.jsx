/*
 * @Author: lzh 
 * @Date: 2017-10-23 14:05:40 
 * @Last Modified by: lzh
 * @Last Modified time: 2017-10-26 16:41:18
 */

import React from "react";
import {connect} from "react-redux";
import axios from "axios";

class FoodCell extends React.Component{
    constructor(props){
        super(props)
        this.state = {
        }
        this.toReady = this.toReady.bind(this);
        this.toOrder = this.toOrder.bind(this);
        this.loadKitchen = this.loadKitchen.bind(this);
    }
    loadKitchen(self){
        axios.get("http://10.3.132.65:10002/kitchen")
            .then(function(res){
                console.log(res);
                var curtab = 0;
                if(self.props.store){
                    curtab = self.props.store.currentTab;
                    if(curtab >= res.data.length){
                        curtab--;
                    }
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
    toReady(ev){
        ev.preventDefault();
        if(this.props.arg.state == 0){
            let self = this;
            axios.get("http://10.3.132.65:10002/changeState",{
                params:{
                    orderid: self.props.store.kitchen[self.props.tabidx].id,
                    foodid: self.props.cellidx,
                    state: 1,
                    name: self.props.arg.name,
                    num: self.props.arg.num
                }
            })
            .then(function(res){
                console.log(res);  
                if(res.data.code === 1){
                    self.loadKitchen(self)
                    console.log(self.props.socket)
                    self.props.socket.emit("change-food-state",{
                        desk: self.props.desk,
                        text: "change state to 1"
                    });
                }
            })
            .catch(function(err){
                console.log(err)
            })
        }
    }


    toOrder(ev){
        ev.preventDefault();
        if(this.props.arg.state == 1){
            let self = this;
            axios.get("http://10.3.132.65:10002/changeState",{
                params:{
                    orderid: self.props.store.kitchen[self.props.tabidx].id,
                    foodid: self.props.cellidx,
                    state: 2
                }
            })
            .then(function(res){
                console.log(self.props.arg);  
                if(res.data.code === 1){
                    self.loadKitchen(self)
                    self.props.socket.emit("change-food-state",{
                        desk: self.props.desk,
                        text: "change state to 2"
                    });
                }
            })
            .catch(function(err){
                console.log(err)
            })
        }
    }

    render(){
        return (
            <div className="foodcell">
                <div className={"cell-wrap "+(this.props.arg.state==2?"completed-wrap":"")}>
                    <div className="food-icon">
                        <img src={"../../../"+this.props.arg.img} />
                        
                    </div>
                    <div className="food-msg">
                        <p className="msg-title">{this.props.arg.name}</p>
                        <p className="msg-state">
                            <span className="foodnum">数量:{this.props.arg.num}</span> 
                            <span className="foodstate">状态:{(function(self){
                                if(self.props.arg.state == 0){
                                    return " 准备中"
                                }else if(self.props.arg.state == 1){
                                    return " 制作中"
                                }else{
                                    return " 以上菜"
                                }
                            })(this)}</span>
                        </p>
                    </div>
                    <div className="food-state">  
                        <div className={"cooking stateblock " + (this.props.arg.state==0?"":"unstate")} onClick={this.toReady}>
                            <span>{this.props.arg.state==1?"制作中...":"制作"}</span>
                        </div>
                        <div className={"ordering stateblock " + (this.props.arg.state==1?"":"unstate")} onClick={this.toOrder}>
                            <span>上菜</span>
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
},(dispatch) => {
    return {
        setStore(kit) {
            dispatch({type: "KITCHEN", store: kit})
          }
    }
})(FoodCell);