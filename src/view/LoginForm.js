import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { Layout, Menu, Button, Typography, Modal, Input, Form, Upload, message, Row } from 'antd';
import { Link } from 'react-router-dom'
import { Redirect } from 'react-router';
import { history } from '../history';
import logo from '../images/Untitled 2.png'
import jwt_decode from "jwt-decode";
import { login } from "../firebase/auth"

const { Text } = Typography

function LoginForm({ props }) {
  const [user, setUser] = useState({ email: "", password: "" });
  const [redirect, setRedirect] = useState(false);
  const [error, setError] = useState("");

  const [loginForm] = Form.useForm()


  const Logout = () => {
    setUser({ name: "", email: "" })
    console.log("Logout")
  }

  function submitHandler(values) {

    const data = {
      email: values.email,
      password: values.password
    }

    async function loginAccount() {
      try {
        await axios.post('https://hcmc.herokuapp.com/api/spec/login', data).then(res => {
          localStorage.setItem('token', res.data.token)
          console.log(props)
          if (res.status === 200) {
            if (res.data.token === "Fail") {
              message.error({
                content: 'Invalid Email or Password!',
                style: {
                  position: 'fixed',
                  bottom: '10px',
                  left: '50%'
                }
              })
            } else {
              localStorage.setItem('token', res.data.token)
              setRedirect(true);
              var token = res.data.token;
              var decode = jwt_decode(token);
              var id = decode['spec-id']
              localStorage.setItem('id', id)
              login(values.email, values.password)
              history.push('/appointment')
            }
          } else {
            message.error({
              content: 'Something went wrong!',
              style: {
                position: 'fixed',
                bottom: '10px',
                left: '50%'
              }
            })
          }
        })

      } catch (e) {
        console.log(e)
      }
    }
    loginAccount();

  }


  // useEffect(() => {
  //   const token = localStorage.getItem('token')
  //   if (token !== 'fail' || token !== "" || token !== undefined) {
  //     history.push('/appointment')
  //   };
  // })

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
      <Form
        id="loginForm"
        name="loginForm"
        form={loginForm}
        onFinish={submitHandler}
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 20,
        }}

      >
        <Form.Item>
          <img src={logo} alt="Logo" />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: 'Please input your Email!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }} >
          <Row style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Button
              key="submit"
              form="loginForm"
              style={{ width: 200 }}
              type="primary"
              htmlType="submit">
              Submit
            </Button>
          </Row>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: 40 }}>
            <Text>
              Or
            </Text>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: 40 }}>
            <Text>
              Don't havve an account?
            </Text>
            <Link to="/register"> Register</Link>
          </div>
        </Form.Item>
      </Form>
    </div>
  )
}

export default LoginForm
