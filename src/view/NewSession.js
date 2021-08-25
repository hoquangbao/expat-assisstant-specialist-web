import React, { useState, useEffect } from 'react'
import { Affix, Dropdown, Layout, Menu, notification } from 'antd';
import { Table, Row, Tag, Space, Image, Button, Form, Calendar, Collapse, Modal, Input, Badge, Select, TimePicker, Typography, message } from 'antd';
import { UploadOutlined, UserOutlined, VideoCameraOutlined, PlusOutlined, LogoutOutlined } from '@ant-design/icons';
import padLeft from 'pad-left';
import moment from 'moment';
import { Link } from 'react-router-dom'
import axios from 'axios';
import '../dist/css/homepage.css'
import logo from '../images/SaigonExpat.png'


const { Header, Content, Footer, Sider } = Layout;
const { Text, Title } = Typography
const { Panel } = Collapse;
const { SubMenu } = Menu;
const { Search } = Input;

export default function NewSession() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [appointmentData, setAppointmentData] = useState([])
  const [appointmentModalData, setAppointmentModalData] = useState({})
  const [appointmentModalData1, setAppointmentModalData1] = useState([])
  const [startTime, setStartTime] = useState();
  const [appointmentStartDate, setAppointmentStartDate] = useState();
  const [appointmentEndDate, setAppointmentEndDate] = useState();
  const [sessionTime, setSessionTime] = useState();
  const [endTime, setEndTime] = useState();
  const [endTime1, setEndTime1] = useState();
  const [currentDate, setCurrentDate] = useState();
  const [currentDate1, setCurrentDate1] = useState();
  const [calendar, setCalendar] = useState();
  const [loading, setLoading] = useState(false);
  const [submitFlag, setSubmitFlag] = useState(false)
  const [prepareStartTime, setPrepareStartTime] = useState()
  const [chooseStartDate, setChooseStartDate] = useState();
  const [top, setTop] = useState(0);


  const [sessionForm] = Form.useForm()



  const token = localStorage.getItem('token')
  const id = localStorage.getItem('id')

  const columns = [
    {
      title: 'Date',
      dataIndex: 'startTime',
      key: 'startTime',
      render: (text) => {
        if (text != null) {
          const date1 = padLeft(text[1], 2, '0')
          const date2 = padLeft(text[2], 2, '0')
          const date = date2 + "/" + date1 + "/" + text[0]
          return (
            <Text>{date}</Text>
          );
        } else {
          return (<Text></Text>)
        }
      },
    },
    {
      title: 'Start Time',
      dataIndex: 'startTime',
      key: 'startTime',
      render: (text) => {
        if (text != null) {
          const pad3 = padLeft(text[3], 2, '0')
          const pad4 = padLeft(text[4], 2, '0')
          return (
            <Text>{pad3}:{pad4}</Text>
          );
        } else {
          return (<Text></Text>)
        }
      },
    },
    {
      title: 'End Time',
      dataIndex: 'endTime',
      key: 'endTime',
      render: (text) => {
        if (text != null) {
          const pad3 = padLeft(text[3], 2, '0')
          const pad4 = padLeft(text[4], 2, '0')
          return (
            <Text>{pad3}:{pad4}</Text>
          );
        } else {
          return (<Text></Text>)
        }
      },
    },
  ];


  function getListData(value) {
    const data = value.format('YYYY/MM/DD')
    let listData;
    if (loading == false && appointmentData !== undefined) {
      for (let index = 0; index < appointmentData.length; index++) {
        const element = appointmentData[index];
        const startDate = element.startTime;
        const date1 = padLeft(startDate[1], 2, '0')
        const date2 = padLeft(startDate[2], 2, '0')
        const formatedDate = startDate[0] + "/" + date1 + "/" + date2;
        if (data == formatedDate) {
          listData = [
            { type: 'warning', content: 'You have session on this day', },
          ];
        }
      }
    }
    // switch (data) {
    //   case '2021/06/15':
    //     listData = [
    //       { type: 'warning', content: '1 Appoinment' },
    //     ];
    //     break;
    //   case 10:
    //     listData = [
    //       { type: 'warning', content: 'No Appointment' },
    //     ];
    //     break;
    //   case 15:
    //     listData = [
    //       { type: 'warning', content: '2 Appointments' },
    //     ];
    //     break;
    //   default:
    // }
    return listData || [];
  }

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
          setEndTime('00:00')
        }).catch(error => {
          console.log(error)
        })
      } catch (e) {
        console.log(e)
      }
    }
    fetchSession();
  }, [])

  function dateCellRender(value) {
    const listData = getListData(value);
    return (
      <ul className="events">
        {listData.map(item => (
          <li key={item.content}>
            <Badge status={item.type} text={item.content} />
          </li>
        ))}
      </ul>
    );
  }

  function getMonthData(value) {
    if (value.month() === 8) {
      return 1394;
    }
  }

  function monthCellRender(value) {
    const num = getMonthData(value);
    return num ? (
      <div className="notes-month">
        <section>{num}</section>
        <span>Backlog number</span>
      </div>
    ) : null;
  }

  function onOkStartTime(values) {
    const startTime = values.format('HH:mm:ss');
    const prepareStartTime = values.format("YYYYMMDDHHmm")
    const current = moment().format("YYYYMMDD")
    const chooseDate = values.format("HHmm")
    const chooseDate1 = currentDate1 + chooseDate
    setPrepareStartTime(prepareStartTime)
    setChooseStartDate(chooseDate1)
    const adding = moment(values).add(sessionTime, 'm').toArray();
    const hour = padLeft(adding[3], 2, '0')
    const minute = padLeft(adding[4], 2, '0')
    const second = padLeft(adding[5], 2, '0')
    const endTime = hour + ":" + minute + ":" + second
    setStartTime(startTime);
    setEndTime1(endTime)
    setAppointmentStartDate(currentDate + startTime)
    setAppointmentEndDate(currentDate + endTime)
  }

  function onOkEndTime(values) {
    const endTime = values.format('HH:mm:ss');
    setEndTime(endTime);
    setAppointmentEndDate(currentDate + endTime)
  }

  const showModal = (value) => {
    console.log(value)
    setCalendar(value.format("YYYYMMDD"))
    const date = value.format('YYYY-MM-DDT')
    const date1 = value.format('YYYYMMDD')
    const year = value.format('YYYY')
    const yearint = parseInt(year, 10);
    const month = value.format('MM')
    const monthint = parseInt(month, 10);
    const day = value.format('DD')
    const dayint = parseInt(day, 10);
    const hour = value.format('HH')
    const hourint = parseInt(hour, 10);
    const munite = value.format('MM')
    const minuteint = parseInt(munite, 10);
    const arr = [yearint, monthint, dayint]
    // for (let index = 0; index < appointmentData.length; index++) {
    //   const element = appointmentData[index];
    //   Object.values(element).map((value, key) => {
    //     if (JSON.stringify(arr1) == JSON.stringify(value)) {
    //       setAppointmentModalData1(...element)
    //     }
    //   })
    // }

    if (appointmentData.length != 0) {
      setAppointmentModalData1([])
      appointmentData.map(appointmentData => {
        const date = [appointmentData.startTime[0], appointmentData.startTime[1], appointmentData.startTime[2]]
        if (JSON.stringify(date) === JSON.stringify(arr)) {
          // tableData = [...appointmentData]
          console.log("you in")
          // appointmentModalData1.push(appointmentData)
          setAppointmentModalData1(appointmentModalData1 => [...appointmentModalData1, appointmentData])
        }
      })
    } else {
      setAppointmentModalData1([])
    }
    setCurrentDate(date);
    setCurrentDate1(date1)
    setIsModalVisible(true);
  };

  function onSelectSession(value) {
    setSessionTime(value)
  }

  const openNotification = () => {
    notification.open({
      message: 'Error while create session',
      description:
        'Session must be present or future',
    });
  };

  const openNotification1 = () => {
    notification.open({
      message: 'Error while create session',
      description:
        'Session has been duplicated',
    });
  };

  function onSessionFormFinish(values) {
    var flag1 = false;
    var flag2 = false;
    const currentDate = moment().format("YYYYMMDDHHmm")

    const lessonModalDatapreparedData = {
      ...values,
      ...appointmentModalData,
      ...{ appointmentEndDate },
      ...{ appointmentStartDate },
    }

    if (appointmentModalData1.length == 0) {
      flag1 = true
    } else {
      console.log(chooseStartDate)
      appointmentModalData1.map(element => {
        const endDate = element.endTime
        const date1 = padLeft(endDate[1], 2, '0')
        const date2 = padLeft(endDate[2], 2, '0')
        const date3 = padLeft(endDate[3], 2, '0')
        const date4 = padLeft(endDate[4], 2, '0')
        var endDate1 = endDate[0] + "" + date1 + "" + date2 + "" + date3 + "" + date4
        const startDate = element.startTime
        const startdate1 = padLeft(startDate[1], 2, '0')
        const startdate2 = padLeft(startDate[2], 2, '0')
        const startdate3 = padLeft(startDate[3], 2, '0')
        const startdate4 = padLeft(startDate[4], 2, '0')
        var startDate5 = startDate[0] + "" + startdate1 + "" + startdate2 + "" + startdate3 + "" + startdate4
        console.log("end date", endDate1)
        console.log("start date", startDate5)
        if (chooseStartDate >= startDate5 && chooseStartDate <= endDate1) {
          flag1 = false
          openNotification1()
        } else {
          flag1 = true
        }
      })

    }
    console.log("choose Start date", chooseStartDate)
    console.log("current date", currentDate)
    if (chooseStartDate - currentDate < 0) {
      flag2 = false
      openNotification()
    } else {
      flag2 = true
    }

    if (flag1 == true && flag2 == true) {
      async function createSession() {
        setLoading(true);
        try {
          const result = await axios.post('https://hcmc.herokuapp.com/api/session/create', {
            "endTime": appointmentEndDate,
            "price": values.price,
            "specialistId": id,
            "startTime": appointmentStartDate,
            "status": 1
          },
            { headers: { "content-type": "application/json", "Authorization": `Bearer ${token}` } }
          )
          if (result.status === 200) {
            console.log("success")
            await axios.get(`https://hcmc.herokuapp.com/api/session/${id}`,
              { headers: { "content-type": "application/json", "Authorization": `Bearer ${token}` } },
            ).then(res => {
              const tableData = res.data.map(appointment => ({
                ...appointment
              }))
              setAppointmentData(tableData)
              setEndTime('00:00')
            }).catch(error => {
              console.log(error)
            })
            setLoading(false);
            setIsModalVisible(false)
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
        } catch (e) {
          console.log(e)
        }
      }
      createSession();
    }
  }

  const handleCancel = () => {
    setIsModalVisible(false);
  };


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

  const format = 'HH:mm';

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

            <Modal title="Create New Session"
              tyle={{ width: 700 }}
              visible={isModalVisible}
              footer={[
                <Button
                  default
                  onClick={handleCancel}
                >
                  Cancel
                </Button>,
                <Button
                  key="submit"
                  form="sessionForm"
                  type="primary"
                  htmlType="submit"
                >
                  Submit
                </Button>,
              ]}>
              <Form
                id="sessionForm"
                name="sessionForm"
                form={sessionForm}
                onFinish={onSessionFormFinish}
                onFinishFailed={(e) => console.log(e)}>
                <Form.Item
                  name="session">
                  <div style={{ width: "100%", paddingBottom: 20 }}>
                    <Select
                      placeholder="Choose Session Time"
                      style={{ width: "100%", }}
                      onChange={onSelectSession} >
                      <Select.Option value="3">3 Minutes</Select.Option>
                      <Select.Option value="15">15 Minutes</Select.Option>
                      <Select.Option value="30">30 Minutes</Select.Option>
                      <Select.Option value="60">1 Hour</Select.Option>
                    </Select>
                  </div>
                </Form.Item>
                <Form.Item
                  name="startTime">
                  <TimePicker style={{ width: "100%", }} format={format} onOk={onOkStartTime} />
                </Form.Item>
                <Form.Item
                  name="endTime">
                  <div style={{ width: "100%", paddingBottom: 20 }}>
                    <Input value={endTime1} disabled />
                  </div>
                </Form.Item>
                <Form.Item
                  name="price"
                  rules={[{ required: true, message: 'This field is required!' }]}>
                  <div style={{ width: "100%", paddingBottom: 20 }}>
                    <Input placeholder="Price" />
                  </div>
                </Form.Item>
                <div style={{ width: "100%", paddingBottom: 20 }}>
                  <Table columns={columns} dataSource={appointmentModalData1} />
                </div>
              </Form>
            </Modal>
            <Title level={3}>My Session</Title>
            <Calendar dateCellRender={dateCellRender} monthCellRender={monthCellRender} onSelect={showModal} />
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>HCMC Expat Assitant ©2021</Footer>
      </Layout>
    </Layout >
  )
}
