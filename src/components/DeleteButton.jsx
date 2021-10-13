import React, {useState} from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import { Button, Confirm, Icon } from 'semantic-ui-react';
import { FETCH_POSTS_QUERY } from '../utils/graphql';
import MyPopup from '../utils/MyPopup';

const DeleteButton = ({postId,commentId, callback}) => {
    const [confrimOpen, setConfrimOpen] = useState(false);

    const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION;

    const[deletePostOrMutation] = useMutation(mutation,{
        update(proxy){
            setConfrimOpen(false);
            if(!commentId){
                const data = proxy.readQuery({
                    query: FETCH_POSTS_QUERY
                });
                proxy.writeQuery({query:FETCH_POSTS_QUERY, data:{
                    getPosts: data.getPosts.filter(p=>p.id !== postId),
                }})
            }
        if(callback) callback()
        },
        variables:{
            postId,
            commentId
        }
    });

    return (
        <>
        <MyPopup
        content= {commentId ? "Delete Comment" : "Delete Post"}    
        >
        <Button as="div" color="red" floated="right" onClick={()=> setConfrimOpen(true)}>
            <Icon name="trash" style={{margin:0}}/>
        </Button>
        </MyPopup>
        
        <Confirm
        open={confrimOpen}
        onCancel={()=>setConfrimOpen(false)}
        onConfirm={deletePostOrMutation}
        />
        </>
    )
}

export default DeleteButton

const DELETE_POST_MUTATION = gql`
  mutation deletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`;
const DELETE_COMMENT_MUTATION = gql`
  mutation deleteComment($postId: ID!,$commentId: ID!) {
    deleteComment(postId: $postId,commentId:$commentId){
        id
        comments{
            id 
            username
            createdAt
            body
        }
        commentCount
    }
  }
`;
