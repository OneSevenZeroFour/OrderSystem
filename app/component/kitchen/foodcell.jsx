/*
 * @Author: lzh 
 * @Date: 2017-10-23 14:05:40 
 * @Last Modified by:   lzh 
 * @Last Modified time: 2017-10-23 14:05:40 
 */

import React from "react";

class FoodCell extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            col: 1
        }
    }
    

    render(){
        return (
            <div className="foodcell">
                <div className="cell-wrap">
                    <div className="food-icon">
                        <img src="../../../img/CakesAndPastries/ciba.jpg" />
                    </div>
                    <div className="food-msg">
                        <p className="msg-title">次次次次糍粑</p>
                        <p className="msg-state">状态: <span>准备中</span></p>
                    </div>
                    <div className="food-state">  
                        <div className="cooking stateblock">
                            <span>制作中..</span>
                        </div>
                        <div className="ordering stateblock unstate">
                            <span>上菜</span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default FoodCell;