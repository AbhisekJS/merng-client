import React, { useEffect, useState } from 'react'
import {Button, Icon,Label} from 'semantic-ui-react'
import { useMutation } from '@apollo/client'
import gql from 'graphql-tag'
import { Link } from 'react-router-dom'
import MyPopup from '../utils/MyPopup'


const LikeButton = ({user ,post:{id,likes,likeCount}}) => {
    const [liked, setLiked] = useState(false)
    useEffect(()=>{
        if(user && likes.find(like => like.username === user.username)){
            setLiked(true)
        }else{
            setLiked(false)
        }
    },[user,likes])

    const [likePost] = useMutation(LIKE_POST_MUTATION, {
        variables: { postId: id }
      });

    const likeButton = user ? ( 
        liked ? (
        <Button color='red' basic>
         <Icon name='heart' />
        </Button>
        ):(
            <Button color='red' basic>
            <Icon name='heart' />
            </Button>
        )
    ):(
    <Button as={Link} to="/login" color='red' basic>
    <Icon name='heart' />
    </Button>)


    return (
        <Button as='div' labelPosition='right' onClick={likePost}>
        <MyPopup content={liked?'Unlike':'Like'}>{likeButton}</MyPopup>
        <Label as='a' basic color='red' pointing='left'>
        {likeCount}
        </Label>
        </Button>
    )
}

export default LikeButton


const LIKE_POST_MUTATION = gql`
  mutation likePost($postId: ID!) {
    likePost(postId: $postId) {
      id
      likes {
        id
        username
      }
      likeCount
    }
  }
`;
