import React, {Component} from 'react'

export default class Header extends Component{
    render(){
        const {menu, page} = this.props
        const headers = menu.map((item, index)=>{
            return (
                <div className='HeaderItemContainer' key={index}>
                    <HeaderItem
                        nowpage={page}
                        key={index}
                        title={item.title}
                        state={index}
                        onClick={this.props.onClick}
                    />
                </div>
            )
        })
        return(
            <div className='Header'>
                {headers}
            </div>
        )

    }
}

class HeaderItem extends Component{
    render(){
        const {nowpage, title, state, onClick} = this.props
        return(
            <div
                className={nowpage === state ? "SelectedItem" : ""}
                onClick={()=>onClick(state, 0)}>   
                    {title}
                    
            </div>
        )
    }
}