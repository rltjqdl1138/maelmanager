import React,{Component} from 'react';
import Header from './containers/Header'
import Main from './containers/Main'
import './containers/style.css'

class App extends Component{
    constructor(props){
        super(props)
        this.state = { page: 0, subPage:0 }
    }
    onClick = (page, subPage)=>{
        this.setState( {page, subPage} )
    }
    render(){
        const {page, subPage} = this.state
        return (
            <div className="App">
                <Header page={page} subPage={subPage} onClick={this.onClick} menu={menu}/>
                <Main page={page} subPage={subPage} onClick={this.onClick} menu={menu}/>
            </div>
        )
    }
}


export default App;


const menu=[
    {title:'사운드', subPage:[
        '사운드 관리',
        {title:'사운드 리스트', page:0},
        {title:'사운드 등록', page:1},
        '진열 관리',
        {title:'메인 진열 관리', page:2},
        {title:'메뉴바 진열 관리', page:3},
        '분류 관리',
        {title:'카테고리 관리', page:4},
    ]},
    {title:'음원', subPage:[
        {title:'사운드 리스트', page:0},
        
    ]},
    {title:'회원', subPage:[
        {title:'사운드 리스트', page:0},
        
    ]},
    {title:'프로모션', subPage:[
        {title:'사운드 리스트', page:0},
        
    ]},
    {title:'통계', subPage:[
        {title:'사운드 리스트', page:1},
        
    ]},
    {title:'정산', subPage:[
        {title:'사운드 리스트', page:1},
        
    ]}
]