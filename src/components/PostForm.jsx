import React from 'react'
import { useMutation } from '@apollo/client'
import gql from 'graphql-tag';
import { Button, Form } from 'semantic-ui-react'
import { useForm } from '../utils/hooks'
import {FETCH_POSTS_QUERY} from '../utils/graphql'

const{Field,Input} = Form

const PostForm = () => {
    const{onChange,onSubmit,values} = useForm(createPostCallback,{
        body:''
    });
    const[createPost,{error}]=useMutation(CREATE_POST_MUTATION,{
        variables: values,
        update(proxy, result) {
            let data = proxy.readQuery({
              query: FETCH_POSTS_QUERY
            });
            console.log(data.getPosts)
            console.log(result.data.createPost)
            proxy.writeQuery({ query: FETCH_POSTS_QUERY, data:{
                getPosts:[result.data.createPost,...data.getPosts],
            },
            });
            
            values.body = '';
          },
          onError(error) {
            console.warn(error.graphQLErrors[0].message);
           },
    })

    function createPostCallback() {
        createPost();
    }

    return (
        <div>
            <Form onSubmit={onSubmit}>
                <h2>Create A Post</h2>
                <Field>
                    <Input
                    placeholder="Hi World"
                    name="body"
                    onChange={onChange}
                    value={values.body}
                    error={error ? true : false}
                    />
                    <Button type="submit" color="teal">Submit</Button>
                </Field>

            </Form>
            {error && (
                <div className="ui error message" style={{ marginBottom: 20 }}>
                <ul className="list">
                    <li>{error.graphQLErrors[0].message}</li>
                </ul>
                </div>
            )}
        </div>
    )
}

export default PostForm


const CREATE_POST_MUTATION = gql`
  mutation createPost($body: String!) {
    createPost(body: $body) {
      id
      body
      createdAt
      username
      likes {
        id
        username
        createdAt
      }
      likeCount
      comments {
        id
        body
        username
        createdAt
      }
      commentCount
    }
  }
`;

