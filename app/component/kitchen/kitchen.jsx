import React from "react";
import TableCell from "./tableCell.jsx";
import {connect} from "react-redux";
import $ from "jquery";
class Kitchen extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            kitchen: [],
            currentTab: -1
        }
    }  
    componentWillMount() {
        let self = this;
        console.log(2222)
        $.ajax({
            url: 'http://localhost:10002/kitchen',
            type: 'GET',
            dataType: 'json',
            data: {}
        })
        .done(function(data) {
            /* self.setState({
                kitchen: data,
                currentTab: 0
            })  */
            self.props.setStore({
                kitchen: data,
                currentTab: 0
            });
            // console.log(self.state.kitchen)
            console.log(self.props["store"])
        });
    }
    
    switchTab(ev,idx){
        ev.preventDefault();
        if(this.props.currentTab != idx){
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
                                            console.log(self)
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
                                        let item = self.props["store"]["kitchen"][self.props["store"]["currentTab"]];
                                        return (<TableCell arg={item} />)
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
