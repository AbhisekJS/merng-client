import React, { useContext } from 'react'
import {useQuery} from '@apollo/client'
import { AuthContext } from '../context/auth'
import {Grid,Transition} from 'semantic-ui-react'
import PostCard from '../components/PostCard'
import PostForm from '../components/PostForm'
import {FETCH_POSTS_QUERY} from '../utils/graphql'

const{Row,Column}=Grid

function Home() {


    const {user} = useContext(AuthContext)
    const {loading,data}=useQuery(FETCH_POSTS_QUERY)

    if(data){
        console.log(data.getPosts)
    }
    
    return (
    <Grid columns={3} divided>
    <Row className="pageTitle"><h1>Recent Posts</h1></Row>
    <Row>
        {user && (
        <Column>
            <PostForm/>
        </Column>
        )}
    </Row>
    <Row>
        {loading ? <h2>Loading Posts</h2>
        :<Transition.Group>
            {data && data?.getPosts.map(post=>(
        <Column key={post.id} style={{marginBottom: 16}}>
            <PostCard post={post}/>
        </Column>))}
            </Transition.Group>}
    </Row>
    </Grid>
    )
}


export default Home
