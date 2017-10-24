/*
 * @Author: lzh 
 * @Date: 2017-10-23 14:05:40 
 * @Last Modified by: lzh
 * @Last Modified time: 2017-10-24 16:11:13
 */

import React from "react";

class FoodCell extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            col: 1
        }
    }
    
    toReady(ev){
        ev.preventDefault();
        console.log('====================================');
        console.log("ready");
        console.log('====================================');
    }

    toOrder(ev){
        ev.preventDefault();
        console.log('====================================');
        console.log("order");
        console.log('====================================');
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
export default FoodCell;