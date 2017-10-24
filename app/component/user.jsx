
import React from "react";
import '../../css/user.css';
import '../../css/footer.css';
import io from "socket.io-client";
var socket = io("http://10.3.132.65:10002");

class User extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            types:[],
            menus:[],
            pay:"0.00",
            txt:[],
            sum:[],
            onWhich:0,
            showOrder:false,
            list:[
                {
                    title:"菜单",
                    herfs:"javascript:;",
                    clas:"icon-shop_fill"
                },{
                    title:"服务铃",
                    herfs:"javascript:;",
                    clas:"icon-remind_fill"
                },{
                    title:"我的订单",
                    herfs:"javascript:;",
                    clas:"icon-activity_fill"
                },{
                    title:"呼叫结账",
                    herfs:"javascript:;",
                    clas:"icon-financial_fill"
                }
            ],
            bg_num:0,
            desk:window.localStorage.getItem("desk_num")?window.localStorage.getItem("desk_num"):1
        },
        // this.change_bg = (event)=>{
        //     var idx = event.target.dataset.idx;
        //     console.log(idx)
        //     if(!(idx==2&&this.state.pay<=0)){
        //         this.setState(Object.assign({},this.state,{
        //             bg_num:idx
        //         }));
        //         console.log(this.state.bg_num,idx)
        //     }
        //     if(idx==1){
        //         this.callServer()
        //     };
        //     if(idx==2){
        //         this.sureOrder()
        //     };
        // },
        this.changeList = (e)=>{
            this.setState(Object.assign({},this.state,{
                onWhich:$(e.target).closest('li').index()
            }));
            this.getList($(e.target).html());
        }
        this.getList = (arg)=>{
            var self = this;
            $.ajax({
                url: 'http://10.3.132.65:10002/getMenu',
                type: 'POST',
                data: {type: arg}
            }).done(function(data) {
                data = JSON.parse(data);
                self.setMenus(data);
            });
            
        }
        this.getType = () => {
            console.log('getType');
            var self = this;
            $.ajax({
                url: 'http://10.3.132.65:10002/getType',
                type: 'POST',
                success:function(data){
                    data = JSON.parse(data);
                    self.setTypes(data);
                    self.getList(data[0].name);
                }
            });
            
        }
        this.setTypes = (data) => {
            // assign里一定要加一个{}  否则报错
            this.setState(Object.assign({},this.state,{
                types:data
            }));
        }
        this.setMenus = (data) => {
            this.setState(Object.assign({},this.state,{
                menus:data
            }));
        }
        this.setPay = (sum) => {
            this.setState(Object.assign({},this.state,{
                pay: sum
            }));
        }

        this.addFun = (e) =>{
            var ele = e.target;
            var parent = $(ele).closest('.txt');
            var numEle = $(ele).siblings('.quan');
            var food = $(ele).closest('.food');

            var num_ = numEle.html();
            numEle.html(++num_);   

            var price = parent.find('.price span').html(); 
            var sum = (this.state.pay*1+price*1).toFixed(2);
            var onWhich = this.state.onWhich;

            this.setPay(sum);   
            
            this.saveList(food.index(),{name:parent.find('.name').html(),num:num_,img:food.find('img').attr("src"),price:price});

            this.state.sum[onWhich] = this.state.sum[onWhich]?++this.state.sum[onWhich]:1;
        }
        this.subFun = (e) =>{
            var ele = e.target;
            var numEle = $(ele).siblings('.quan')
            var parent = $(ele).closest('.txt');
            var food = $(ele).closest('.food');

            var num_ = numEle.html();
            numEle.html(--num_);  

            var price = parent.find('.price span').html();  
            var sum = (this.state.pay*1-price*1).toFixed(2);
            var onWhich = this.state.onWhich?this.state.onWhich:0;
            
            this.setPay(sum);  
            
            this.saveList(food.index(),{name:parent.find('.name').html(),num:num_,img:food.find('img').attr("src"),price:price});
            if(num_<=0){
                this.saveList($(ele).closest('.food').index(),{name:parent.find('.name').html(),num:-1,img:food.find('img').attr("src"),price:price});
            }

            this.state.sum[onWhich] = this.state.sum[onWhich]>0?--this.state.sum[onWhich]:undefined;     
        }
        this.saveList = (son_idx,e) => {
            var idx = $(".type .on").index();
            this.state.txt[idx] = this.state.txt[idx]?this.state.txt[idx]:[];
            this.state.txt[idx][son_idx] = Object.assign({},this.state.txt[idx][son_idx],{name:e.name,num:e.num,img:e.img,price:e.price});
            if(e.num===-1){
                this.state.txt[idx][son_idx] = undefined;
            }
            // console.log(this.state.txt);
        }
        this.callServer = (e) => {
            //呼叫服务员
            console.log('callServer');
        }

        this.sureOrder = () => {
            if(this.state.pay*1>0)
                this.setState(Object.assign({},this.state,{
                    showOrder:true
                }));
        }
        this.closeFun = () => {
            this.setState(Object.assign({},this.state,{
                showOrder:false
            }));
        }
        this.orderFun = (e) => {
            //时间
            var day = new Date();
            var month = day.getMonth()*1+1;
            var d = day.getDate();
            var hour = day.getHours()>9?day.getHours():'0'+day.getHours();
            var min = day.getMinutes()>9?day.getMinutes():'0'+day.getMinutes();
            var sec = day.getSeconds()>9?day.getSeconds():'0'+day.getSeconds();
            var str = day.getFullYear()+"-"+(month>9?month:'0'+month)+"-"+(d>9?d:'0'+d)+" "+hour+":"+min+":"+sec;

            var arr = [];
            var arr_init = this.state.txt;
            for(var i=0;i<arr_init.length;i++){
                if(arr_init[i]){
                    for(var j=0;j<arr_init[i].length;j++){
                        if(arr_init[i][j]){
                            arr_init[i][j].state = 0;
                            arr.push(arr_init[i][j]);
                        }
                    }
                }
            }
            var obj = {
                desk:this.state.desk,
                txt:JSON.stringify(arr),
                pay:this.state.pay,
                time:str
            }
            var self = this;
            //确定并下单
            $.ajax({
                url: 'http://10.3.132.65:10002/saveOrder',
                type: 'POST',
                data: obj,
                success:function(data){
                    console.log('id',data);
                    // 不能再点
                    
                    //发送socket
                    var send_obj = {id:data,desk:self.state.desk};
                    socket.emit('send_order_id_toback',send_obj);
                }
            });
            
        }

    }

    render(){
        var self = this;
        return (
            <div className='user'>              
                <div className="top">
                    <ul className="type">
                        {this.state.types.map(function(item,index){
                            return <li className={index==self.state.onWhich?"on":"li"} key={index}><p onClick={self.changeList}>{item.name}</p>
                                {self.state.sum[index]?<span>{self.state.sum[index]}</span>:""}
                            </li>;
                        })}
                    </ul>
                    
                   {   this.state.showOrder?
                    <div className="order_shell">
                        <div className="order_laying"></div>
                       <div className="order">
                           <span className="close" onClick={this.closeFun}>&times;</span>
                           {this.state.txt.map(function(item,idx){
                               return item?item.map(function(im,ix){
                                   return im?
                                       <div className="li" key={'li'+ix}>
                                       <img src={im.img} />
                                       <div className="txt">
                                           <p className="name">{im.name}</p>
                                           <p className="price">￥<span>{im.price}</span> &times; {im.num}</p>
                                       </div>
                                   </div>
                                   :""
                               }):""
                              
                           })}
                           <a href="javascript:;" onClick={this.orderFun} className="send_btn">确认下单</a>
                       </div>
                       </div>
                       :
                       <div className='menu' index={this.state.onWhich}>
                           {this.state.menus.map(function(item,idx){
                               var type_idx = self.state.onWhich;
                               var bool = self.state.txt[type_idx]&&self.state.txt[type_idx][idx];
                               return <div className="food" key={item.id} index={idx}>
                                       <img src={item.imgurl} />
                                       <div className="txt">
                                           <p className="name">{item.dish_name}</p>
                                           <p className="price">￥<span>{item.price}</span>/份</p>
                                           <p className="num">
                                               <span onClick={self.subFun} className={bool?"sub click":"sub click hidefirst"}>-</span>
                                                   <span className={bool?"quan":"quan hidefirst"}>
                                                   {bool?self.state.txt[type_idx][idx].num:0}</span>
                                               <span onClick={self.addFun} className="add click">+</span>
                                           </p>
                                       </div>
                                   </div>
                           })}
                       </div> }
                </div>

                <footer>
                    <ul className="foot_menu">
                    {
                        this.state.list.map(function(item,idx){
                            return <li key={idx}>
                                    <a href={item.herfs} data-idx={idx} onClick={this.change_bg} className={this.state.bg_num == idx?"active_bg":""}><i className={'iconfont '+item.clas}></i>{item.title}</a>
                                </li>
                            }.bind(this))
                        }
                    </ul>
                </footer>   
            </div>
            )
    }

    componentWillMount(){
        this.getType();
        socket.emit('send_desk_id_toback',this.state.desk);
    }
    componentDidUpdate(){
        this.change_bg = (event)=>{
            var idx = event.target.dataset.idx;
            console.log(idx)
            // if(!(idx==2&&this.state.pay<=0)){
                this.setState(Object.assign({},this.state,{
                    bg_num:idx
                }));
                console.log(this.state.bg_num,idx)
            // }
            if(idx==1){
                this.callServer()
            };
            if(idx==2){
                this.sureOrder()
            };
        }      
    }
}


export default User;