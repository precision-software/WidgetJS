import React, { Component } from 'react'
import './Widget.css'
import axios from 'axios'

class Widget extends Component {

    constructor(props) {
        super(props);
        this.state = {}

        // Configure a "get" configuration to fetch json data from AdoptMeApp APIs
        this.feed = new StoryFeed(this.props.url);
        this.setFeed = feed => this.setState({feed:feed})

        // Stories as read from the server.  Empty means end of data.
        this.state.stories = []
        this.setStories =  stories => {
            console.error("Widget.setStories stories=%o this=%o\n", stories, this);
            if (stories.length > 0) this.setState({stories:stories})}

    }




    render() {
        console.error("Widget.render this=%o\n", this)
        return (
            <div>
                <StoryFeed url={this.props.url}
                              animalId={this.props.animalId}
                              shelterId={this.props.shelterId}
                              count={this.props.count}
                              callback={this.setFeed}>
                </StoryFeed>
                <FeedNavigator feed={this.state.feed} callback={this.setStories}> </FeedNavigator>
                <StoryList stories={this.state.stories}>  </StoryList>

            </div>
        )
    }
}


// TODO: deactivate buttons until data has been fetched.
const StoryNavigator = ({feed, callback, count}) =>
    <div>
        <button onClick={()=>feed.last(count).then(callback)}>        latest     </button>
        <button onClick={()=>feed.next(count).then(callback)}>  &nbsp;&lt;&nbsp; </button>
        <button onClick={()=>feed.prev(count).then(callback)}>  &nbsp;&gt;&nbsp; </button>
        <button onClick={()=>feed.first(count).then(callback)}>       oldest     </button>
    </div>;


/************************************************************************************
 * Configure the story feed for AdoptMeApp server.  Callback returns a navigatable source.
 * @param url
 * @param animalId
 * @param shelterCode
 * @param callback
 * @returns {null}
 * @constructor
 */
function StoryFeed ({url, animalId, shelterCode, callback})  {

    // Configure a feed for navigating through stories.
    let feed = new StoryFeed(url, animalId, shelterCode);
    callback(feed);

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