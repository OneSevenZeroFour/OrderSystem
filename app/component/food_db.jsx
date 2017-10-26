import React from "react";
import "../../css/food_db.css";
export default class database extends React.Component{
	constructor(props){
		super(props);
		this.state={
			data_list:[]
		};
		this.loading_data = ()=>{
			var self = this;
			window.$.ajax({
				url:"http://10.3.132.65:10002/FoodDB",
				type:"GET",
				success(datas){
					var res = datas;
					try{
						res = JSON.parse(datas)
					}catch(err){
						console.log(err)
					}
					self.setState(Object.assign({},self.state,{
							data_list:res
					}))
				}
			})			
		}
	}
	componentWillMount(){
		this.loading_data();
	}
	render(){
		var self = this;
		return(
			<section>
				<header className="admin_header">
				  <div className="am_topbar">
				    <strong>遇见湘味馆</strong> <small>后台管理</small>
				  </div>
				  <div className="am_collapse">
				    <ul className="info_list">
				    	<li><a href="#">收件箱</a></li>
				    	<li><a href="#">管理员</a></li>
				    	<li><a href="#">资料</a></li>
				    	<li><a href="#">设置</a></li>
				    	<li><a href="#">退出</a></li>
				    </ul>
				  </div>
				</header>

				<div className="controlled">
					<div className="am-g">
					        <div className="control_skill">
					              <button type="button" id="add_user"> 新增</button>
					              <button type="button"> 保存</button>
					              <button type="button"> 审核</button>
					              <button type="button"> 删除</button>
					        </div>

					        <div className="control_type">
					            <select id="type_className">
					            {
					            	(function(){
					            		let datas = self.state.data_list;
											var hash = {};
											//归并方法 ES5
											datas = datas.reduce(function(item, next) {
												// console.log(item.push(next.type))
											    hash[next.type] ? '' : hash[next.type] = true && item.push(next.type);
											    // console.log(next)
											    return item
											}, [])						            		
					            		// console.log(hash)
					            		return datas.map((item,idx)=>{
					            			return <option value={idx} key={idx}>{item}</option>
					            		})
					            	}())
					            }
					            </select>
					        </div>

					        <div className="control_search">
					            <input type="text" className="am-form-field" />
						        <span className="am-input-group-btn">
						            <button className="am-btn am-btn-default" type="button">搜索</button>
						        </span>
					        </div>
					</div>					
				</div>

				<div className="dom_tilte">
					<div className="dom_tilte_box">
						<table className="am-table am-table-striped am-table-hover table-main">
				              <thead>
				                <tr className="table-title-head">
					                  <th><input type="checkbox" id="select-all" /></th>
					                  <th>ID</th>
					                  <th>菜品类型</th>
					                  <th>菜品名</th>
					                  <th>价格</th>
					                  <th>库存</th>
					                  <th>菜单图片路径</th>
					                  <th>操作人员</th>
					                  <th>修改日期</th>
					                  <th>操作</th>
				                </tr>
				              </thead>
				              <tbody className="all_list">
					              {
					              	this.state.data_list.map((item,idx)=>{
					              		return <tr key={idx}>
									              <td><input type="checkbox" className="chk"/></td>
									              <td>{item.id}</td>
									              <td>{item.type}</td>
									              <td>{item.dish_name}</td>
									              <td>{item.price}</td>
									              <td>{item.inventory}</td>
									              <td>{item.imgurl}</td>
									              <td className="am-hide-sm-only"><input type="text" className="editer"/></td>
									              <td className="am-hide-sm-only"><input type="text" className="times"/></td>
									              <td>
									                <div className="am-btn-toolbar">
									                  <div className="am-btn-group">
									                    <button className="am-btn edit_item"><span className=""></span> 编辑</button>
									                    <button className="am-btn copy_item"><span className=""></span> 复制</button>
									                    <button className="am-btn del_item"><span className=""></span> 删除</button>
									                  </div>
									                </div>
									              </td>
									        </tr> 
					              	})
					              }
				              </tbody>
			            </table>
		            </div>					
				</div>

			    <footer className="admin_content_footer">
			      <hr/>
			      <p className="am_padding_left">© 2017 AllMobilize, Inc. Licensed under MIT license</p>
			    </footer>
			</section>
		)
	}
}