import React, { useState, useEffect } from 'react'
import { Affix, Dropdown, Layout, Menu } from 'antd';
import { Table, Row, Tag, Space, Image, Button, Calendar, Collapse, Modal, Input, Typography } from 'antd';
import padLeft from 'pad-left';
import { UploadOutlined, UserOutlined, VideoCameraOutlined, PlusOutlined, LogoutOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom'
import axios from 'axios';
import '../dist/css/homepage.css'
import logo from '../images/SaigonExpat.png'

const { Header, Content, Footer, Sider } = Layout;
const { Panel } = Collapse;
const { SubMenu } = Menu;
const { Search } = Input;
const { Text, Title } = Typography

export default function Appointment() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [top, setTop] = useState(0);
  const [appointmentData, setAppointmentData] = useState([]);
  const [appoinmentId, setAppointmentId] = useState();
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
      title: '',
      key: '',
      render: (record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => onClick(record)} >Start appointment</Button>
        </Space>
      ),
    },
  ];


  useEffect(() => {
    async function fetchSession() {
      try {
        await axios.get(`https://hcmc.herokuapp.com/api/appointment/specialist?specId=${id}`,
          { headers: { "content-type": "application/json", "Authorization": `Bearer ${token}` } },
        ).then(res => {
          // const tableData = res.data.map(appointment => ({
          //   ...appointment
          // }))
          // const tableData1 = []
          var m = new Date();
          const getMonth = padLeft((m.getMonth() + 1), 2, '0')
          const getUTCDate = padLeft(m.getDate(), 2, '0')
          const hour = padLeft(m.getHours(), 2, 0)
          const minute = padLeft(m.getMinutes(), 2, 0)
          var dateString = m.getFullYear() + "" + getMonth + "" + getUTCDate + "" + hour + "" + minute
          console.log("current date", dateString)
          res.data.forEach(element => {
            const endDate = element.session.endTime
            const date1 = padLeft(endDate[1], 2, '0')
            const date2 = padLeft(endDate[2], 2, '0')
            const date3 = padLeft(endDate[3], 2, '0')
            const date4 = padLeft(endDate[4], 2, '0')
            var endDate1 = endDate[0] + "" + date1 + "" + date2 + "" + date3 + "" + date4
            console.log("end date:", endDate1)
            //202108212235  -  202108212216
            if (element.channelName != null || element.channelName != undefined) {
              if (element.status == 1 && endDate1 > dateString) {
                const channelName = element.channelName
                const comment = element.comment
                const conAppId = element.conAppId
                const createDate = element.createDate
                const expatId = element.expat.id
                const language = element.language
                const majorId = element.major.majorId
                const rating = element.rating
                const endTime = element.session.endTime
                const startTime = element.session.startTime
                const price = element.session.price
                const status = element.status
                var data1 = {
                  channelName,
                  comment,
                  conAppId,
                  createDate,
                  expatId,
                  language,
                  majorId,
                  rating,
                  startTime,
                  endTime,
                  price,
                  status,
                }
                setAppointmentData(appointmentData => [...appointmentData, data1])
              }
            }
          });

          // setAppointmentData(tableData)
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

  console.log(appointmentData)

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  function onClick(record) {
    window.open(`http://localhost:3000/startappointment/${record.conAppId}`,)
  }


  const menu = (
    <Menu>
      <Menu.Item key="1" icon={<UserOutlined />}>
        <Link to="/profile">Profile</Link>
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
            <Title level={3}>Upcomming Appointment</Title>
            <Table columns={columns} dataSource={appointmentData} />
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>HCMC Expat Assitant ©2021</Footer>
      </Layout>
    </Layout>
  )
}
