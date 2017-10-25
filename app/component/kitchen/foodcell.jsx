/*
 * @Author: lzh 
 * @Date: 2017-10-23 14:05:40 
 * @Last Modified by: lzh
 * @Last Modified time: 2017-10-25 16:35:38
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
        axios.get("http://localhost:10002/kitchen")
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
            axios.get("http://localhost:10002/changeState",{
                params:{
                    orderid: self.props.store.kitchen[self.props.tabidx].id,
                    foodid: self.props.cellidx,
                    state: 1
                }
            })
            .then(function(res){
                console.log(res);  
                if(res.data.code === 1){
                    self.loadKitchen(self)
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
            axios.get("http://localhost:10002/changeState",{
                params:{
                    orderid: self.props.store.kitchen[self.props.tabidx].id,
                    foodid: self.props.cellidx,
                    state: 2
                }
            })
            .then(function(res){
                console.log(res);  
                if(res.data.code === 1){
                    self.loadKitchen(self)
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
                <div className="cell-wrap">
                    <div className="food-icon">
                        <img src={"../../../"+this.props.arg.img} />
                        
                    </div>
                    <div className="food-msg">
                        <p className="msg-title">{this.props.arg.name}</p>
                        <p className="msg-state">状态: <span>准备中</span></p>
                    </div>
                    <div className="food-state">  
                        <div className={"cooking stateblock " + (this.props.arg.state==0?"":"unstate")} onClick={this.toReady}>
                            <span>制作</span>
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