import React, { useState,useContext } from 'react'
import { Button, Form } from 'semantic-ui-react'
import {useMutation} from '@apollo/client'
import gql from 'graphql-tag'
import { useHistory } from 'react-router'

import { AuthContext } from '../context/auth';
import {useForm} from '../utils/hooks'

function Register(props) {
    const history = useHistory();
    const context = useContext(AuthContext);
    const[errors,setErrors]=useState({})
  
    const registerUser=()=>{ 
        addUser()
    }
    const {onChange,onSubmit,values} = useForm(registerUser,{
        username:'',
        email:'',
        password:'',
        confirmPassword:''
    })

    const [addUser,{loading},error] = useMutation(REGISTER_USER,{
     update(_,
        {
          data: { register: userData }
        }
        ){
         console.log(userData);
         context.login(userData);
         history.push('/')
     },
     onError(error) {
       setErrors(error?.graphQLErrors[0]?.extensions?.errors);
      },
     variables: values   
    }) 
    

    return (
        <div className="form-container">
          <Form onSubmit={onSubmit} noValidate className={loading ? "loading":''}>
              <h1>Register</h1>
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
             label="Email" 
             placeholder="Email.." 
             type="email" 
             name="email" 
             value={values.email} 
             error={errors.email ? true : false}
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

             <Form.Input 
             label="Confirm Password" 
             placeholder="Confirm Password" 
             type="password" 
             name="confirmPassword" 
             value={values.confirmPassword} 
             error={errors.confirmPassword ? true : false}
             onChange={onChange}>
            </Form.Input> 

            <Button type="submit" primary>
                Register
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

const REGISTER_USER = gql`
mutation register(
  $username: String!
  $email: String!
  $password: String!
  $confirmPassword: String!
) {
  register(
    registerInput: {
      username: $username
      email: $email
      password: $password
      confirmPassword: $confirmPassword
    }
  ) {
    id
    email
    username
    createdAt
    token
  }
}
`;
export default Register
