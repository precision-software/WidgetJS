import React, { Component } from 'react'
import './Widget.css'
import axios from 'axios'
import {ScrollView, View, Text, Image, Button} from 'react-native';

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
            console.error("setNavigation dir=%s  id=%d  stories=%o", dir, id, stories);
            this.setState({navigate:{id:id, dir:dir}})
        }
    }




    render() {
        console.error("Widget.render this=%o\n", this)
        return (
            <View>
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

            </View>
        )
    }
}



const StoryNavigator = ({stories, callback}) =>
    <View style={{flexDirection:'row', justifyContent:'center'}}>
        <Button onPress={()=>callback('desc', [])}       title="latest" >   </Button>
        <Button onPress={()=>callback('desc',  stories)}  title=" > " > '    </Button>
        <Button onPress={()=>callback('asc', stories)}  title=" < " >      </Button>
        <Button onPress={()=>callback('asc', [])}        title="oldest">    </Button>
    </View>


/******************************************************************************************
 * FetchStories fetches a new set of stories when its props change.
 *   It doesn't render anything, so render simply returns null.
 *   However, it must do http requests, which is done at componentDidMount().
 *   Doing it at render() causes an update loop between FetchStories and its container.
 *
 * Question: could this.props.callback change by the time the future executes?
 *    Maybe we should bind it to a local variable so it is part of the closure and is unmodified.
 */
class FetchStories extends Component {
    constructor(props) {
        super(props);
        console.error("new FetchStories: %o\n", this);
    }

    render() {
        console.error("FetchStories.render: %o\n", this);

        // Get the stories and invoke the callback function when they arrive.
        //const callback = this.props.callback;
        this.props.http.get('Widget.php', {
            params: {
                animal_id: this.props.animalId,
                shelter_code: this.props.shelterCode,
                id: this.props.id,
                dir: this.props.dir,
                count: this.props.count
            }
        })
            .then(result => this.props.callback(result.data.stories))
            .catch(reason => console.log("ERROR in http.get", reason));
        return null;
    }




    shouldComponentUpdate(newProps, newState) {

        let same = this.props.animalId === newProps.animalId &&
            this.props.count === newProps.count &&
            this.props.dir === newProps.dir;

        console.error("componentShouldUpdate %o: newProps=%o newState=%o same=%o\n", this, newProps, newState, same);
        return !same;
    }

    willReceiveProps(newProps) {
        console.error("willReceiveProps %o: newProps=%o\n", this, newProps)
    }

    componentDidMount(){
        console.error("FetchStories.componentDidMount %o\n", this);
    }
    componentDidUpdate() {
        console.error("FetchStories.componentDidMount: %o\n", this);

    }
}




const StoryList = ({stories}) =>
    <ScrollView contentContainerStyle={{alignItems:'flex-start'}}>
        {stories.map((story) =>
            <StoryItem key={story.story_id} story={story}> </StoryItem>)}
    </ScrollView>


const StoryItem = ({story}) =>
    <View style={{flexDirection:'row'}}>
        <StoryPhoto story={story}/>
        <Text style={{textAlign:'left'}}> {story.story} </Text>
    </View>


const StoryPhoto = ({story}) =>
    story.photo_url?
        <Image style={{height:220, width:220}} source={{uri:"http://adoptmeapp.org/" + story.photo_url}}></Image>:
        <Text style={{height:220, width:220}} >No Photo</Text>



export default Widget