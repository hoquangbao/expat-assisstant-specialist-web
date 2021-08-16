import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { Layout, Menu, Button, Typography, Modal, Input, Form, Upload, message, Row, Select, Space, Spin } from 'antd';
import { Redirect } from 'react-router';
import { history } from '../history';
import logo from '../images/Untitled 2.png'
import jwt_decode from "jwt-decode";
import TextArea from 'antd/lib/input/TextArea';

const { Text } = Typography
const { Option } = Select

function Register({ props }) {
  const [user, setUser] = useState({ email: "", password: "" });
  const [languages, setLanguages] = useState([])
  const [majors, setMajors] = useState([])
  const [loading, setLoading] = useState(false)
  const [redirect, setRedirect] = useState(false);
  const [error, setError] = useState("");

  const [loginForm] = Form.useForm()

  function submitHandler(values) {
    setLoading(true);
    var languages = [];
    values.language.forEach(languageId => {
      var el = { languageId }
      languages.push(el);
    });
    const data = {
      "biography": values.biography,
      "email": values.email,
      "fullname": values.fullname,
      "languages": languages,
      "majors": [
        {
          "majorId": values.major
        }
      ],
      "password": values.password
    }
    console.log(data)
    async function register() {
      try {
        await axios.post('https://hcmc.herokuapp.com/api/spec/signup', data
        ).then(res => {
          console.log(res)
          if (res.status === 200) {
            if (res.data.token === "Fail") {
              message.error({
                content: 'Something went wrong',
                style: {
                  position: 'fixed',
                  bottom: '10px',
                  left: '50%'
                }
              })
            } else {
              history.push('/')
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
    register();
  }

  useEffect(() => {
    async function fetchLanguage() {
      try {
        await axios.get(`https://hcmc.herokuapp.com/api/lang/all`,
        ).then(res => {
          const tableData = res.data.map(language => ({
            ...language
          }))
          setLanguages(tableData)
        }).catch(error => {
          console.log(error)
        })
      } catch (e) {
        console.log(e)
      }
    }
    fetchLanguage();
    async function fetchMajor() {
      try {
        await axios.get(`https://hcmc.herokuapp.com/api/majors?page=0&size=200&sortBy=majorId`,
        ).then(res => {
          const tableData = res.data.content.map(major => ({
            ...major
          }))
          setMajors(tableData)
        }).catch(error => {
          console.log(error)
        })
      } catch (e) {
        console.log(e)
      }
    }
    fetchMajor();
  }, [])


  const language = [];
  languages.forEach(element => {
    language.push(<Option key={element.languageId}>{element.languageName}</Option>);
  });

  const major = [];
  majors.forEach(element => {
    major.push(<Option key={element.majorId}>{element.name}</Option>);
  });

  if (loading == true) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Space size="middle">
          <Spin size="large" />
        </Space>
      </div>
    )
  } else {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <div style={{ width: 800 }}>
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
              <img width={300} src={logo} alt="Logo" />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: 'Please input your Email!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Full Name"
              name="fullname"
              rules={[{ required: true, message: 'Please input your Full Name!' }]}
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

            <Form.Item
              label="Biography"
              name="biography"
              rules={[{ required: true, message: 'Please input your Full Name!' }]}
            >
              <TextArea
                style={{ width: '100%' }}
                rows={6}>
              </TextArea>
            </Form.Item>

            <Form.Item
              label="Language"
              name="language"
            >
              <Select
                mode="multiple"
                placeholder="Please select"
                style={{ width: '100%' }}
              >
                {language}
              </Select>
            </Form.Item>

            <Form.Item
              label="Major"
              name="major"
            >
              <Select
                placeholder="Please select"
                style={{ width: '100%' }}
              >
                {major}
              </Select>
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
            </Form.Item>
          </Form>
        </div>
      </div>
    )
  }
}

export default Register
