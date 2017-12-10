import React, { Component } from 'react'
import './Widget.css'
import axios from 'axios'
import {ScrollView, View, Text, Image, Button} from 'react-native';





class Widget extends Component {

    constructor(props) {
        super(props);


        // Stories as read from the server.  Empty means end of data.
        this.state = {stories: []};
        this.setStories =  stories => {
            //console.error("Widget.setStories stories=%o this=%o\n", stories, this);
            if (stories.length > 0) this.setState({stories: stories})
        }
    }


    render() {
        //console.error("Widget.render this=%o\n", this);
        const {animalId, shelterId, server, count} = this.props;

        // Set up initial urls.
        const firstUrl = ["/api/v2/widget.php", {animal_id:animalId, shelter_id:shelterId, count:count, dir:'asc'}];
        const lastUrl  = ["/api/v2/widget.php", {animal_id:animalId, shelter_id:shelterId, count:count, dir:'desc'}];

        return (
            <View style={{height:300}}>
                <PageNavigator server={server} first={firstUrl} last={lastUrl} callback={this.setStories}> </PageNavigator>
                <StoryList stories={this.state.stories}>  </StoryList>
            </View>
        );
    }
}


class PageNavigator extends Component {
    constructor(props) {
        super(props);

        // Set the initial state.
        this.state = {next: this.props.first, prev: this.props.last, isBusy: true};

        // Configure a "get" configuration to fetch json data from AdoptMeApp APIs
        this.http = axios.create({
            timeout: 30000,
            responseType: 'json'
        });

        // Request the latest page to get things started.
        //  Note: calls setState which will be ignored during creation.
        this.requestPage(this.props.last);

    }

    // Actions. These should be bound functions.

    /************************************************************
     *  ACTION: Request a page of data from the given URL
     */
    requestPage = (url) => {

        // Update our state to reflect we are now busy.
        this.setState({isBusy: true});

        // Request data from the server and process it when received.
        this.get(url)
            .then(this.receivePage)
            .catch(reason => console.error("ERROR in http.get", reason));
    };


    /*******************************************************************
     *  ACTION: We received a page of data.
     */
    receivePage = ({prev, next, data}) => {
        //console.error("receivePage: callback=%o prev=%s next=%s data=%o\n", this.props.callback, prev, next,  data);

        // If we received data, notify our caller
        if (data.length > 0)
            this.props.callback(data);

        // Update the state
        if (data.length > 0) this.setState({prev: prev, next: next, isBusy: false});
        else                 this.setState({isBusy: false});



        // Return data, so the "then" operator is a promise to the data.
        //   We aren't using it, but good practice?
        return data;
    };


    /**************************************************************************************
     * Do an http request
     * @param urlObject - either a string, or a pair consisting of url and query args.
     * @returns  - promise which gets invoked when request completes.
     */
    get(urlObject) {
        //console.error("get: server=%s  url=%o\n", this.props.server, urlObject);

        // Convert url object to a string and query args.
        const [url, params] = (typeof(urlObject) === 'string')
            ? [urlObject, {}]
            : urlObject;

        // Initiate the http get. When successful, promise to return the data portion of the response.
        return this.http.get(this.props.server + url, {params:params})
            .then(page=>page.data)
    };


    render() {

        // Get some shorthand actions.
        const firstPage = () => this.requestPage(this.props.first);
        const lastPage =  () => this.requestPage(this.props.last);
        const nextPage =  () => this.requestPage(this.state.next);
        const prevPage =  () => this.requestPage(this.state.prev);
        const isBusy = this.state.isBusy;

        return (
            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                <Button onPress={firstPage} disabled={isBusy} title="latest"> </Button>
                <Button onPress={nextPage} disabled={isBusy}  title=" > "> '  </Button>
                <Button onPress={prevPage} disabled={isBusy}  title=" < ">    </Button>
                <Button onPress={lastPage} disabled={isBusy}  title="oldest"> </Button>
            </View>
        );
    }
}


const StoryList = ({stories}) =>
    //<ScrollView contentContainerStyle={{alignItems:'flex-start'}}>
    <ScrollView style={{flex:1}}>
        {stories.map((story) =>
            <StoryItem key={story.story_id} story={story}> </StoryItem>)}
    </ScrollView>;


const StoryItem = ({story}) =>
    <View style={{flexDirection:'row'}}>
        <StoryPhoto story={story}></StoryPhoto>
        <Text style={{textAlign:'left'}}> {story.story} </Text>
    </View>;


const StoryPhoto = ({story}) =>
    story.photo_url?
        <Image style={{height:220, width:220}} source={{uri:"http://adoptmeapp.org/" + story.photo_url}}></Image>:
        <Text style={{height:220, width:220}} >No Photo</Text>;



export default Widget