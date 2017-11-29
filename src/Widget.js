import React, { Component } from 'react'
import './Widget.css'
import axios from 'axios'

class Widget extends Component {

    constructor(props) {
        super(props);
        this.state = {}

        // Configure a "get" configuration to fetch json data from AdoptMeApp APIs
        this.http = axios.create({
            baseURL: this.props.baseURL,
            timeout: 30000,
            responseType: 'json'
        });

        // Stories as read from the server.  Empty means end of data.
        this.state.stories = []
        this.setStories =  stories => {
            console.error("Widget.setStories stories=%o this=%o\n", stories, this);
            if (stories.length > 0) this.setState({stories:stories})}

        // Define the subset of stories we want to display. Start reading most recent stories.
        this.state.navigate = {id: null, dir: 'desc'}
        this.setNavigation = (dir, stories) => {
            let id;
            if (stories.length === 0)   id = null
            else if (dir === 'desc')    id = stories[0].story_id
            else                        id = stories[stories.length - 1].story_id

            this.setState({navigate:{id:id, dir:dir}})
        }
    }




    render() {
        console.error("Widget.render this=%o\n", this)
        return (
            <div>
                <FetchStories http={this.http}
                              animalId={this.props.animalId}
                              shelterId={this.props.shelterId}
                              dir={this.state.navigate.dir}
                              id={this.state.navigate.id}
                              count={this.props.count}
                              callback={this.setStories}>
                </FetchStories>
                <StoryNavigator stories={this.state.stories} callback={this.setNavigation}> </StoryNavigator>
                <StoryList stories={this.state.stories}>  animalId=this.props.animalId  shelterId=this.props.shelterId </StoryList>

            </div>
        )
    }
}



const StoryNavigator = ({stories, callback}) =>
    <div>
        <button onClick={()=>callback('desc', [])}>        latest     </button>
        <button onClick={()=>callback('desc',  stories)}>  &nbsp;&lt;&nbsp; </button>
        <button onClick={()=>callback('asc', stories)}>  &nbsp;&gt;&nbsp; </button>
        <button onClick={()=>callback('asc', [])}>       oldest     </button>
    </div>




function FetchStories ({http, animalId, shelterCode, id, dir, count, callback})  {

    // Get the stories and invoke the callback function when they arrive.
    http.get('Widget.php', {
        params: {
            animal_id: animalId,
            shelter_code: shelterCode,
            id: id,
            dir: dir,
            count: count
        }
    })
        .then(result => callback(result.data.stories))
        .catch(reason => console.log("ERROR in http.get", reason));

    return null
}




const StoryList = ({stories}) =>
    <ul>
        {stories.map((story) => <StoryItem key={story.story_id} story={story}> </StoryItem>)}
    </ul>


const StoryItem = ({story}) =>
    <li> {story.story_id} <StoryPhoto story={story}/> {story.story} </li>


const StoryPhoto = ({story}) =>
    story.photo_url?
        <img height="42" width="42" src={"http://adoptmeapp.org/" + story.photo_url} alt="Missing"></img>:
        <span height="42" width="42"> No Photo </span>



export default Widget