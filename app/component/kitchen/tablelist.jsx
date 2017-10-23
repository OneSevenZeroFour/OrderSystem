import React from "react";

class TableList extends React.Component{
    constructor(props){
        super(props)
    }
    render(){
        return (
            <ul className="tablelist">
                <li className="tableItem">1桌</li>
                <li className="tableItem">2桌</li>
            </ul>
        )
    }
}
export default TableList;