/*
 * @Author: lzh 
 * @Date: 2017-10-23 14:05:33 
 * @Last Modified by: lzh
 * @Last Modified time: 2017-10-26 16:32:31
 */
import React from "react";
import FoodCell from "./foodcell.jsx";

class TableCell extends React.Component{
    constructor(props){
        super(props)
    }
    isOrderCompleted(){
        let completed = true;
        let cont = decodeURI(this.props.arg.content)
        let arr = JSON.parse(cont);
        for(let i = 0; i < arr.length; i++){
            if(arr[i].state != 2){
                return false;
            }
        }
        return true;
    }
    componentWillReceiveProps(){
        console.log(this.props)
    }
    render(){
        return (
            <div className="tablecell">
                <div className="tablecell-wrap">
                    <div className="table-msg">
                        <p className="tabletitle"><span className="titlespan"><span className="tablenum">订单号:{this.props.arg.id}</span>，订单状态:<span className="orderstate">{this.isOrderCompleted()?"完成":"未完成"}</span></span></p>
                    </div>
                    <div className="foodlist">
                        {
                            (function(self){
                                var cont = decodeURI(self.props.arg.content)
                                
                                var arr = JSON.parse(cont);
                                console.log(arr)

                                return arr.map(function(item, index){
                                    return <FoodCell tabidx={self.props.tabidx} desk={self.props.arg.desk} socket={self.props.socket} cellidx={index} arg={item} key={index*2}/>
                                })
                            })(this)
                        }
                    </div>
                </div>
            </div>
        )
    }
}
export default TableCell;