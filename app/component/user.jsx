
import React from "react";

class User extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            types:['主食','小吃','饮料']
        }
    }

    render(){
        return (
            <div>
                <ul>
                    {this.state.types.map(function(item,index){
                        return <li key={index}>{item}</li>;
                    })}
                </ul>


            </div>
            )
    }
}


export default User;