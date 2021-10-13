import React, { useContext, useState } from 'react'
import { useParams,useHistory } from 'react-router-dom'
import gql from 'graphql-tag';
import { useQuery,useMutation } from '@apollo/client';
import moment from 'moment';
import { Button, Card, Grid, Image, Icon, Label, Form } from 'semantic-ui-react';
import LikeButton from '../components/LikeButton';
import { AuthContext } from '../context/auth';
import DeleteButton from '../components/DeleteButton';
import MyPopup from '../utils/MyPopup';
const{Row,Column}=Grid

const SinglePost = () => {

    const {user} = useContext(AuthContext)
    const history = useHistory();
    let {postId} = useParams();
    console.log(postId);

    const[comment,setComment]=useState('')

    const {data} = useQuery(FETCH_POST_QUERY, {
        variables: {
          postId
        }
    });

    const [submitComment] = useMutation(SUBMIT_COMMENT_MUTATION,{
        update(){
            setComment('')
        },
        variables:{
            postId,
            body:comment
        }
    })


    function deletePostCallback() {
        history.push('/');
    }

    console.log(data?.getPost);
    let postMarkup;

    if(!data){
        postMarkup = <p>Loading post..</p>;
    }else{
        const{
            id,
            body,
            createdAt,
            username,
            comments,
            likes,
            likeCount,
            commentCount
          } = data?.getPost;
   
    postMarkup = (
        <Grid>
            <Row>
                <Column width={2}>
                <Image
                src="https://react.semantic-ui.com/images/avatar/large/molly.png"
                size="small"
                float="right"
                />
                </Column>
                <Column width={10}>
                <Card fluid>
                    <Card.Content>
                        <Card.Header>{username}</Card.Header>
                        <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                        <Card.Description>{body}</Card.Description>
                    </Card.Content>
                    <hr/>
                    <Card.Content extra>
                <LikeButton user={user} post={{ id, likeCount, likes }} />

                <MyPopup content="Comment on Post">
                <Button
                  as="div"
                  labelPosition="right"
                  onClick={() => console.log('Comment on post')}
                >
                  <Button basic color="blue">
                    <Icon name="comments" />
                  </Button>
                  <Label basic color="blue" pointing="left">
                    {commentCount}
                  </Label>
                </Button>
                </MyPopup>
                
                {user && user.username === username && (
                  <DeleteButton postId={id} callback={deletePostCallback} />
                )}
              </Card.Content>
                </Card>
                {user && (
                    <Card fluid>
                        <Form>
                            <div className="ui action input fluid">
                                <input type="text" placeholder="comment..." value={comment} onChange={e=>setComment(e.target.value)}/>
                                <button className="ui button teal" 
                                disabled={comment.trim()===''}
                                onClick={submitComment}>
                                    Reply
                                </button>
                            </div>
                        </Form>
                    </Card>
                )}
                {comments.map(comment=>(
                    <Card fluid key={comment.id}>
                        <Card.Content>
                            {user && user.username === comment.username && (
                                <DeleteButton postId={id} commentId={comment.id} />
                            )}
                            <Card.Header>{comment.username}</Card.Header>
                            <Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
                            <Card.Description>{comment.body}</Card.Description>
                        </Card.Content>
                    </Card>
                ))}
                </Column>
            </Row>
        </Grid>
    )
    }

    return postMarkup
}

export default SinglePost


const FETCH_POST_QUERY = gql`
  query($postId: ID!) {
    getPost(postId: $postId) {
      id
      body
      createdAt
      username
      likeCount
      likes {
        username
      }
      commentCount
      comments {
        id
        username
        createdAt
        body
      }
    }
  }
`;

const SUBMIT_COMMENT_MUTATION = gql`
  mutation($postId: String!, $body: String!) {
    createComment(postId: $postId, body: $body) {
      id
      comments {
        id
        body
        createdAt
        username
      }
      commentCount
    }
  }
`;