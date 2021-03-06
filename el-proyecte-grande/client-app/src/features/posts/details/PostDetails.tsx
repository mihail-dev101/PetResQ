import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Grid } from "semantic-ui-react";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { useStore } from "../../../app/stores/store";
import PostDetailedChat from "./PostDetailedChat";
import PostDetailedHeader from "./PostDetailedHeader";
import PostDetailedInfo from "./PostDetailedInfo";
import PostDetailedSidebar from "./PostDetailedSidebar";


export default observer(function PostDetails () {

    const {postStore} = useStore();
    const { selectedPost: post, loadPost, loadingInitial} = postStore;
    const {id} = useParams<{id: string}>();

    useEffect(() => {
        if (id) loadPost(id);
    }, [id, loadPost]);

    if(loadingInitial || !post) return <LoadingComponent />;

    return (
        <Grid>
            <Grid.Column width={10}>
                <PostDetailedHeader post={post}/>
                <PostDetailedInfo post={post}/>
                <PostDetailedChat post={post}/>
            </Grid.Column>
            <Grid.Column width={6}>
                <PostDetailedSidebar post={post} />
            </Grid.Column>
        </Grid>
    )
})