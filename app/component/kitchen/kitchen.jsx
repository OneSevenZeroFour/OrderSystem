import React from "react";
import TableCell from "./tableCell.jsx";
class Kitchen extends React.Component{
    constructor(props){
        super(props)
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
                            <li className="tableItem tableItem-sel">1桌</li>
                            <li className="tableItem">2桌</li>
                            <li className="tableItem">2桌</li>
                            <li className="tableItem">2桌</li>
                            <li className="tableItem">2桌</li>
                            <li className="tableItem">2桌</li>
                            <li className="tableItem">2桌</li>
                            <li className="tableItem">2桌</li>
                            <li className="tableItem">2桌</li>
                            <li className="tableItem">2桌</li>
                            <li className="tableItem">2桌</li>
                        </ul>
                    </div>
                    <div className="kitchen-main">
                        <div className="main-wrap">
                            <TableCell />
                            <TableCell />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default Kitchen;