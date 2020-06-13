import React, {Component} from 'react'
export default class Sidebar extends Component{
    render(){
        const {menu, page, onClick} = this.props

        const list = menu.subPage.map((item,index)=>{
            return typeof item === 'object' ? (
                <div className={page===item.page ? "navigatorItem SelectedItem":"navigatorItem"}
                    key={index}
                    onClick={()=>onClick(item.page)}>
                    {item.title}
                </div> 
            ) : (<div className="navigatorMenu"
                    key={index}>
                    {item}
                </div>) 
        })
        return(
            <div className="navigatorContainer">
                <div className="navigatorTitle">
                    {menu.title}
                </div>
                {list}
            </div>
        )
    }
}