import React, { useState, useEffect } from 'react'
import { Layout, Menu } from 'antd';
import { Table, Row, Tag, Space, Image, Button, Calendar, Collapse, Modal, Input, Typography } from 'antd';
import padLeft from 'pad-left';
import { UploadOutlined, UserOutlined, VideoCameraOutlined, PlusOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom'
import axios from 'axios';
import '../dist/css/homepage.css'
import logo from '../images/SaigonExpat.png'

const { Header, Content, Footer, Sider } = Layout;
const { Panel } = Collapse;
const { SubMenu } = Menu;
const { Search } = Input;
const { Text } = Typography

export default function Appointment() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [appointmentData, setAppointmentData] = useState([]);
  const [startTime, setStartTime] = useState([]);
  const [endDate, setEndDate] = useState();

  const token = localStorage.getItem('token')
  const id = localStorage.getItem('id')

  const columns = [
    {
      title: 'Date',
      dataIndex: 'startTime',
      key: 'startTime',
      render: (text) => {
        const date1 = padLeft(text[1], 2, '0')
        const date2 = padLeft(text[2], 2, '0')
        const date = date2 + "/" + date1 + "/" + text[0]
        return (
          <Text>{date}</Text>
        );
      },
    },
    {
      title: 'Start Time',
      dataIndex: 'startTime',
      key: 'startTime',
      render: (text) => {
        const pad3 = padLeft(text[3], 2, '0')
        const pad4 = padLeft(text[4], 2, '0')
        return (
          <Text>{pad3}:{pad4}</Text>
        );
      },
    },
    {
      title: 'End Time',
      dataIndex: 'endTime',
      key: 'endTime',
      render: (text) => {
        const pad3 = padLeft(text[3], 2, '0')
        const pad4 = padLeft(text[4], 2, '0')
        return (
          <Text>{pad3}:{pad4}</Text>
        );
      },
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Action',
      key: 'action',
      render: () => (
        <Space size="middle">
          <a>Update</a>
          <a>Cancel</a>
        </Space>
      ),
    },
    {
      title: '',
      key: '',
      render: () => (
        <Space size="middle">
          <Button type="primary" onClick={onClick} >Start appointment</Button>
        </Space>
      ),
    },
  ];


  useEffect(() => {
    async function fetchSession() {
      try {
        await axios.get(`https://hcmc.herokuapp.com/api/session/${id}`,
          { headers: { "content-type": "application/json", "Authorization": `Bearer ${token}` } },
        ).then(res => {
          const tableData = res.data.map(appointment => ({
            ...appointment
          }))
          setAppointmentData(tableData)
          console.log(res)
        }).catch(error => {
          console.log(error)
        })
      } catch (e) {
        console.log(e)
      }
    }
    fetchSession();
  }, [])

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  function onClick() {
    window.open('http://localhost:3000/startappointment')
  }

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
        </Menu>
      </Sider>
      <Layout>
        <Header className="site-layout-sub-header-background" style={{ padding: 0 }} />
        <Content style={{ margin: '24px 16px 0' }}>
          <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
            <Row style={{ paddingBottom: 20 }}>
              <Button type="primary" style={{ color: 'blue', marginBottom: '20px', marginLeft: '0', paddingRight: 30 }} size={"large"}>
                <PlusOutlined style={{ color: 'white' }} /><Link style={{ color: 'white' }} to="/newsession">Create new session</Link>
              </Button>

            </Row>
            <Table columns={columns} dataSource={appointmentData} />
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>HCMC Expat Assitant ©2021</Footer>
      </Layout>
    </Layout>
  )
}
