import React, { useState, useEffect } from 'react'
import { Affix, Dropdown, Layout, Menu, Rate, Spin } from 'antd';
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

export default function MyAppointment() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [top, setTop] = useState(0);
  const [appointmentData, setAppointmentData] = useState([]);
  const [loading, setLoading] = useState(false)
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
      title: 'Expat Name',
      dataIndex: 'expatName',
      key: 'expatName',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text) => {
        switch (text) {
          case 1:
            return (<Tag color="red" >
              NOT COMPLETE
            </Tag>);
          case 2:
            return (<Tag color="green" >
              COMPLETED
            </Tag>)
        }
      }
    },
    {
      title: 'Comment',
      dataIndex: 'comment',
      key: 'comment',
      render: (text) => {

        switch (text) {
          case null:
          case "":
          case undefined:
            return (
              <Text type="secondary" style={{ fontStyle: "italic" }} >No Comment</Text>
            );
          case text:
            return (
              <Text>{text}</Text>
            )
        }
      }
    },
    {
      title: 'Rating',
      dataIndex: 'star',
      key: 'star',
      render: (text) => {
        return (
          <Text>{text}</Text>
        );
      }
    },
  ];


  useEffect(() => {
    async function fetchSession() {
      setLoading(false)
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
          var datatable = []
          res.data.forEach(element => {
            const endDate = element.session.endTime
            const date1 = padLeft(endDate[1], 2, '0')
            const date2 = padLeft(endDate[2], 2, '0')
            const date3 = padLeft(endDate[3], 2, '0')
            const date4 = padLeft(endDate[4], 2, '0')
            var endDate1 = endDate[0] + "" + date1 + "" + date2 + "" + date3 + "" + date4
            if (endDate1 < dateString || element.status === 2) {
              const channelName = element.channelName
              const comment = element.comment
              const conAppId = element.conAppId
              const createDate = element.createDate
              const expatId = element.expat.id
              const language = element.language
              const majorId = element.major.majorId
              const star = element.rating
              const endTime = element.session.endTime
              const startTime = element.session.startTime
              const price = element.session.price
              const status = element.status
              const expatName = element.expat.fullname
              var data1 = {
                channelName,
                comment,
                conAppId,
                createDate,
                expatId,
                language,
                majorId,
                star,
                startTime,
                endTime,
                price,
                status,
                expatName
              }
              datatable = [...datatable, data1]
            }
            console.log("end date", endDate1)
          });
          setAppointmentData(datatable)


          // setAppointmentData(tableData)
          console.log(res)
          console.log("current Date: ", dateString)
        }).catch(error => {
          console.log(error)
        })
        setLoading(true)

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

  function onClick() {
    window.open('http://localhost:3000/startappointment/31')
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
        {loading == false ?
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
            <Space size="middle">
              <Spin size="large" />
            </Space>
          </div> : <Content style={{ margin: '24px 16px 0' }}>
            <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
              <Title level={3}>Appointment History</Title>
              <Table columns={columns} dataSource={appointmentData} />
            </div>
          </Content>}

        <Footer style={{ textAlign: 'center' }}>HCMC Expat Assitant ©2021</Footer>
      </Layout>
    </Layout>
  )
}
