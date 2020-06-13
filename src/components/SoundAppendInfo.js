import React, {Component} from 'react'
import axios from 'axios'

export default class SoundAppendInfo extends Component{
    constructor(props){
        super(props)
        this.state={
            MID:0,
            title:'',
            category:'',
            songCreator:'',
            lyricCreator:'',
            author:'',
            publisher:'',
            info:''
        }
    }
    componentDidMount(){
        return this.props.id ? this.getInfo(this.props.id) : null
    }
    handleChange = (field, value) => this.setState({ [field]: value })
    getInfo = async(id)=>{
        try{
            const response = await axios.get(`/api/media/music?id=${id}`)
            if(!response.data.success || !response.data.data || !response.data.length === 0)
                return;
            return this.setState(state=>({ ...state, ...response.data.data[0] }))
        }catch(e){
            console.log(e)
        }
    }
    render(){
        const {handleChange} = this
        const {title, category, songCreator, lyricCreator, author, publisher, info} = this.state
        return (
            <div className="MainContentContainer">
                <div className="MainSubtitle">
                    기본정보
                </div>
                <div className="SoundAppendTableRow SoundAppendTableOneRow">
                    <div className="SoundAppendTableHead">
                        사운드명
                    </div>
                    <div>
                        <input name="title" type="text"
                            value={title}
                            onChange={(e)=>handleChange('title',e.target.value)}
                        />
                    </div>
                    <div className="SoundAppendTableHead">
                        파일첨부
                    </div>
                    <div>
                        <input name="file" type="file" />
                    </div>
                    <div className="Clear" />
                </div>
                <div className="SoundAppendTableRow SoundAppendTableOneRow">
                    <div className="SoundAppendTableHead">
                        구분
                    </div>
                    <input name='category' type='radio' value='Music'
                        checked={category==='Music'}
                        onChange={(e)=>handleChange('category','Music')}/>음악
                    <input name='category' type='radio' value='Book'
                        checked={category==='Book'}
                        onChange={(e)=>handleChange('category','Book')} />책
                    <input name='category' type='radio' value='Other'
                        checked={category==='Other'}
                        onChange={(e)=>handleChange('category','Other')} />기타
                    
                    <div className="Clear" />
                </div>
                <div className="SoundAppendTableRow SoundAppendTableOneRow">
                    <div className="SoundAppendTableHead">
                        작곡
                    </div>
                    <div>
                        <input name="songCreator" type="text"
                            value={songCreator}
                            onChange={(e)=>handleChange('songCreator',e.target.value)}/>
                    </div>
                    <div className="SoundAppendTableHead">
                        작사
                    </div>
                    <div>
                        <input name="lyricCreator" type="text"
                            value={lyricCreator}
                            onChange={(e)=>handleChange('lyricCreator',e.target.value)} />
                    </div>
                    <div className="Clear" />
                </div>
                <div className="SoundAppendTableRow SoundAppendTableOneRow">
                    <div className="SoundAppendTableHead">
                        작가
                    </div>
                    <div>
                        <input name="author" type="text"
                            value={author}
                            onChange={(e)=>handleChange('author',e.target.value)} />
                    </div>
                    <div className="SoundAppendTableHead">
                        제작사/출판사
                    </div>
                    <div>
                        <input name="publisher" type="text"
                            value={publisher}
                            onChange={(e)=>handleChange('publisher',e.target.value)} />
                    </div>
                    <div className="Clear" />
                </div>
                <div className="SoundAppendTableRow SoundAppendTableMultiRow">
                    <div className="SoundAppendTableHead">
                        사운드정보
                    </div>
                    <div>
                        <textarea name="info" cols="40" rows="3"
                            value={info}
                            onChange={(e)=>handleChange('info',e.target.value)} />
                    </div>
                    <div className="Clear" />
                </div>
                <div className="SoundAppendTableRow" />

            </div>
        )
    }
}