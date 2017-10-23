/*
 * @Author: lzh 
 * @Date: 2017-10-23 14:05:33 
 * @Last Modified by:   lzh 
 * @Last Modified time: 2017-10-23 14:05:33 
 */
import React from "react";
import FoodCell from "./foodcell.jsx";

class TableCell extends React.Component{
    constructor(props){
        super(props)
    }
    render(){
        return (
            <div className="tablecell">
                <div className="tablecell-wrap">
                    <div className="table-msg">
                        <p className="tabletitle"><span className="titlespan"><span className="tablenum">1</span>桌，订单状态:<span className="orderstate">完成</span></span></p>
                    </div>
                    <div className="foodlist">
                        <FoodCell />
                        <FoodCell />
                        <FoodCell />
                        <FoodCell />
                        <FoodCell />
                        <FoodCell />
                        <FoodCell />
                        <FoodCell />
                    </div>
                </div>
            </div>
        )
    }
}
export default TableCell;