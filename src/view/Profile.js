import React, { useState, useEffect } from 'react'
import { Affix, Dropdown, Layout, Menu, Select, Spin, Upload } from 'antd';
import { Table, Row, Tag, Space, Image, Button, Calendar, Collapse, Modal, Input, Typography, Form, message } from 'antd';
import padLeft from 'pad-left';
import { UploadOutlined, UserOutlined, VideoCameraOutlined, PlusOutlined, LogoutOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom'
import axios from 'axios';
import '../dist/css/homepage.css'
import logo from '../images/SaigonExpat.png'
import TextArea from 'antd/lib/input/TextArea';
import { storage } from '../firebase/FirebaseUtil';
import Avatar from 'antd/lib/avatar/avatar';

const { Header, Content, Footer, Sider } = Layout;
const { Panel } = Collapse;
const { SubMenu } = Menu;
const { Search } = Input;
const { Text, Title } = Typography

const { Option } = Select


const token = localStorage.getItem('token')
const id = localStorage.getItem('id')

export default function Profile() {
  const [user, setUser] = useState({ email: "", password: "" });
  const [top, setTop] = useState(0);
  const [languages, setLanguages] = useState([])
  const [vocabularyCreateModalContent, setVocabularyCreateModalContent] = useState({})
  const [majors, setMajors] = useState([])
  const [loading, setLoading] = useState(false)
  const [redirect, setRedirect] = useState(false);
  const [error, setError] = useState("");

  const [loginForm] = Form.useForm()


  useEffect(() => {
    async function fetchSession() {
      try {
        await axios.get(`https://hcmc.herokuapp.com/api/spec/${id}`,
          { headers: { "content-type": "application/json", "Authorization": `Bearer ${token}` } },
        ).then(res => {
          var tableData = {}
          const specialist = res.data.Specialist
          const language = res.data.language
          const major = res.data.majors
          tableData = {
            ...{ specialist },
          }
          loginForm.setFieldsValue(tableData)
          setVocabularyCreateModalContent(tableData)
          setLoading(true)
        }).catch(error => {
          console.log(error)
        })
      } catch (e) {
        console.log(e)
      }
    }
    fetchSession();
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

  function submitHandler(values) {
    setLoading(true);
  }

  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';

    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt1M = file.size / 1024 / 1024 < 1;
    if (!isLt1M) {
      message.error('Image must smaller than 1MB!');
    }
    return isJpgOrPng && isLt1M;
  }

  const uploadVocabularyImg = async (file) => {
    let identify = file.name + '__' + Date.now();
    let conversationImg;
    await storage.ref(`image/Vocabulary/${identify}`).put(file);
    await storage.ref(`image/Vocabulary`).child(identify).getDownloadURL().then(url => {
      conversationImg = url;
    })
    setVocabularyCreateModalContent({
      ...vocabularyCreateModalContent,
      image_link: conversationImg
    })
    return conversationImg
  }

  const handleVocabularyImageChange = info => {
    if (info.file.status === 'uploading') {
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl => {
        setVocabularyCreateModalContent({
          ...vocabularyCreateModalContent,
          image_link: imageUrl
        })
      }
      );
    }
  }


  const menu = (
    <Menu>
      <Menu.Item key="1" icon={<UserOutlined />}>
        Profile
      </Menu.Item>
      <Menu.Item key="2" icon={<LogoutOutlined />} onClick={() => onClickLogout()}>
        <Link to="/">Logout</Link>
      </Menu.Item>
    </Menu>
  );

  function onClickLogout() {
    localStorage.setItem('token', "");
    localStorage.setItem('id', "");
  }

  const language = [];
  languages.forEach(element => {
    language.push(<Option key={element.languageId}>{element.languageName}</Option>);
  });

  const major = [];
  majors.forEach(element => {
    major.push(<Option key={element.majorId}>{element.name}</Option>);
  });

  console.log(vocabularyCreateModalContent)

  if (loading == false) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Space size="middle">
          <Spin size="large" />
        </Space>
      </div>
    )
  } else {
    return (
      <Layout className="ant-layout">
        <Sider
          breakpoint="lg"
          collapsedWidth="0"
          onBreakpoint={broken => {
            console.log(broken);
          }}
          onCollapse={(collapsed, type) => {
            console.log(collapsed, type);
          }}
        >
          <div>
            <img src={logo} alt="Logo" />
          </div>
          <Menu theme="dark" mode="inline" defaultSelectedKeys={['4']}>
            <Menu.Item key="1" icon={<VideoCameraOutlined />}>
              <Link to="/appointment">Appointment</Link>
            </Menu.Item>
            <Menu.Item key="2" icon={<VideoCameraOutlined />}>
              <Link to="/myappointment">Appointment History</Link>
            </Menu.Item>
            <Menu.Item key="3" icon={<VideoCameraOutlined />}>
              <Link to="/mysession">My Session</Link>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Affix offsetTop={top}>
            <Header className="site-layout-sub-header-background" style={{ padding: 0 }} >
              <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', padding: 10, paddingRight: 20 }}>
                <Dropdown overlay={menu} trigger={['click']}>
                  <Button shape="circle" size="large">
                    <UserOutlined />
                  </Button>
                </Dropdown>
              </div>
            </Header>
          </Affix>
          <Content style={{ margin: '24px 16px 0' }}>
            <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
                <div style={{ width: 600 }}>
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
                    <Form.Item
                      style={{ display: 'grid', justifyContent: 'space-evenly', alignItems: 'center' }}
                      name="image">
                      <Avatar shape="circle" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} size={100} icon={<Image src={vocabularyCreateModalContent.specialist.avatar} />} />
                    </Form.Item>
                    <Form.Item
                      label="Email"
                      rules={[{ required: true, message: 'Please input your Email!' }]}
                    >
                      <Input value={vocabularyCreateModalContent.specialist.email} />
                    </Form.Item>
                    <Form.Item
                      label="Full Name"
                      rules={[{ required: true, message: 'Please input your Full Name!' }]}
                    >
                      <Input value={vocabularyCreateModalContent.specialist.fullname} />
                    </Form.Item>

                    <Form.Item
                      label="Biography"
                      rules={[{ required: true, message: 'Please input your Full Name!' }]}
                    >
                      <TextArea
                        style={{ width: '100%' }}
                        value={vocabularyCreateModalContent.specialist.biography}
                        rows={6}>
                      </TextArea>
                    </Form.Item>
                    <Form.Item
                      label="Certificate"
                      rules={[{ required: true, message: 'Please input your Full Name!' }]}
                    >
                      <Input value={vocabularyCreateModalContent.specialist.certificate} />
                    </Form.Item>

                    <Form.Item
                      label="Language"
                    >
                      <Select
                        mode="multiple"
                        defaultValue={['1', '2']}
                        placeholder="Please select"
                        style={{ width: '100%' }}
                      >
                        {language}
                      </Select>
                    </Form.Item>

                    <Form.Item
                      label="Major"
                    >
                      <Select
                        placeholder="Please select"
                        defaultValue={['2']}
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
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>HCMC Expat Assitant ©2021</Footer>
        </Layout>
      </Layout>
    );
  }
}
