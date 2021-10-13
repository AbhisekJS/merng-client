import React, { useContext, useState } from 'react'
import { Button, Form } from 'semantic-ui-react'
import {useMutation} from '@apollo/client'
import gql from 'graphql-tag'
import { useHistory } from 'react-router'
import {useForm} from '../utils/hooks'
import {AuthContext} from '../context/auth'

function Login({props}) {
    const context = useContext(AuthContext);

    const history = useHistory()
    const[errors,setErrors]=useState({})

    const {onChange,onSubmit,values} = useForm(loginUserCallback,{
        username:'',
        password:'',
    })
    
    const [loginUser,{loading},error] = useMutation(LOGIN_USER,{
        update(_,{
            data: { login: userData }
          }){
            console.log(userData);
            context.login(userData);
            history.push('/')
        },
        onError(error) {
            setErrors(error?.graphQLErrors[0]?.extensions?.errors);
        },
        variables: values   
    })

    function loginUserCallback(){
        loginUser()
    }

    return (
        <div className="form-container">
          <Form onSubmit={onSubmit} noValidate className={loading ? "loading":''}>
              <h1>Login</h1>
             <Form.Input 
             label="Username" 
             placeholder="UserName" 
             type="text" 
             name="username" 
             value={values.username} 
             error={errors.username ? true : false}
             onChange={onChange}>
            </Form.Input> 

             <Form.Input 
             label="Password" 
             placeholder="Password" 
             type="password" 
             name="password" 
             value={values.password} 
             error={errors.password ? true : false}
             onChange={onChange}>
            </Form.Input> 

            <Button type="submit" primary>
                Login
            </Button>

          </Form>
          {Object.keys(errors).length > 0 && (
            <div className="ui error message">
                <ul className="list">
                    {Object.values(errors).map((value,index) => (
                    <li key={index}>{value}</li>
                    ))}
                </ul>
            </div>
      )} 
        </div>
    )
}

const LOGIN_USER = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      id
      email
      username
      createdAt
      token
    }
  }
`;
export default Login
