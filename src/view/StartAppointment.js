import React, { useEffect, useState } from 'react';
import AgoraRTC from "agora-rtc-sdk";
import { Button, Avatar, Typography, Space, Spin, Image, Badge, message, notification } from 'antd';
import { PhoneOutlined, SoundOutlined, AudioOutlined, UserOutlined } from '@ant-design/icons';
import axios from 'axios';
import Countdown from 'react-countdown';
import moment from 'moment';
import padLeft from 'pad-left';


function StartAppointment(props) {
  const [randomNumber, setRandomNumber] = useState()
  const [appointment, setAppointment] = useState({});
  const [loading, setLoading] = useState(false);
  const [callToken, setCallToken] = useState();
  const [userJoin, setUserJoin] = useState(false);
  const [isOnline, setOnline] = useState(false);
  const [milSecond, setMilSecond] = useState(100000);
  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();
  const [callTime, setCallTime] = useState();

  var rtc = {
    client: null,
    joined: false,
    published: false,
    localStream: null,
    remoteStreams: [],
    params: {}
  };

  const tokeId = window.location.pathname.split('/').reverse()[0]

  // Options for joining a channel


  rtc.client = AgoraRTC.createClient({ mode: "rtc", codec: "h264" });

  const { Text } = Typography;
  const role = 'host'

  const token = localStorage.getItem('token')


  function leaveEventHost(params) {
    rtc.client.unpublish(rtc.remoteStreams, function (err) {
      console.log("publish failed");
      console.error(err);
    })
    rtc.client.leave(function (ev) {
      console.log(ev)
    })
  }

  function onClick() {
    if (userJoin == false) {
      rtc.client.unpublish(rtc.remoteStreams, function (err) {
        console.log("publish failed");
        console.error(err);
      })
      rtc.client.leave(function (ev) {
        console.log(ev)
      })
      var endTime1 = moment()
      if (endTime1 !== undefined) {
        var duration = moment.duration(endTime1.diff(startTime));
        var miliminutes = (parseInt(duration.asMilliseconds()))
        console.log(miliminutes)
        setCallTime(miliminutes)
      }
      window.close()
    } else {
      message.error('Expat still in the room, you cannot quit now');
    }
  }

  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      // Render a completed state
      return window.close();
    } else {
      // Render a countdown
      const minute = padLeft(minutes, 2, '0')
      const second = padLeft(seconds, 2, '0')
      return (
        <span>
          {hours}:{minute}:{second}
        </span>
      );
    }
  };

  async function calculateTime(appointmetData) {
    setLoading(false);
    // var startTime = moment();
    // var endTime = mo
    // var startTime1 = moment(startTime, "YYYY/MM/DDHH:MM")
    // var endDate = [2021, 8, 13, 20, 30]
    // var endDate1 = endDate[0] + "/" + endDate[1] + "/" + endDate[2] + endDate[3] + ":" + endDate[4]
    // const differentTime = moment(startTime).format('h:mm:ss a')
    // const differentTime1 = moment(endTime).format('h:mm:ss a')
    // var mins = endTime.diff(startTime)
    // console.log(mins)

    var m = new Date();
    const getMonth = padLeft((m.getMonth() + 1), 2, '0')
    const getUTCDate = padLeft(m.getDate(), 2, '0')
    const getHours = padLeft(m.getHours(), 2, '0')
    const getMinutes = padLeft(m.getMinutes(), 2, '0')
    const getSecond = padLeft(m.getSeconds(), 2, 0)
    var dateString = m.getFullYear() + "" + getMonth + "" + getUTCDate + "" + getHours + "" + getMinutes + getSecond;
    var startTime = moment(dateString, "YYYYMMDDhhmmss");
    // var endDate = [2021, 8, 13, 21, 45]
    console.log("innnnnnnnnnnnnnnn")
    const endDate = appointmetData.session.endTime
    const date1 = padLeft(endDate[1], 2, '0')
    const date2 = padLeft(endDate[2], 2, '0')
    const date3 = padLeft(endDate[3], 2, '0')
    const date4 = padLeft(endDate[4], 2, '0')
    var endDate1 = endDate[0] + "" + date1 + "" + date2 + "" + date3 + "" + date4 + "00"
    var endTime = moment(endDate1, "YYYYMMDDhhmmss");
    var duration = moment.duration(endTime.diff(startTime));
    // var day = parseInt(duration.asDays()) * 24 * 60 * 60 * 1000;
    // var hours = parseInt(duration.asHours()) * 60 * 60 * 1000;
    // var miliminutes = (parseInt(duration.asMinutes())) * 60 * 1000;
    var total = parseInt(duration.asMilliseconds())
    setMilSecond(total)
    console.log(endDate1)
    console.log('time', total)
    localStorage.setItem("timtime,", total)
    joinChannel(role, appointmetData.channelName)
    setLoading(true)
  }

  console.log(milSecond)


  const diffTime = localStorage.getItem('time')

  const beforeRender = ({ hours, minutes, seconds, completed }) => {

    if (userJoin == true) {
      return renderer({ hours, minutes, seconds, completed })
    } else {
      return <span>00:00</span>
    }
  }


  async function joinChannel(role, appointment) {
    console.log(localStorage.getItem('callToken'))
    console.log("local uid", localStorage.getItem('uid'))
    var option = {
      appID: "9aff35de497443c9be8469665d87176b",
      channel: appointment,
      uid: localStorage.getItem('uid'),
      token: localStorage.getItem('callToken'),
    }
    console.log("option", option)
    var startTime = moment();
    // Create a client

    // Initialize the client
    rtc.client.init(option.appID, function () {
      console.log("init success");

      // Join a channel
      rtc.client.join(option.token ?
        option.token : null,
        option.channel, option.uid ? +option.uid : null, function (uid) {
          console.log("join channel: " + option.channel + " success, uid: " + uid);
          rtc.params.uid = uid;
          rtc.remoteStreams = AgoraRTC.createStream({
            streamID: rtc.params.uid,
            audio: true,
            video: false,
            screen: false,
          })

          if (role === "host") {
            rtc.client.setClientRole("host");
            // Create a local stream

            // Initialize the local stream
            rtc.remoteStreams.init(function () {
              console.log("init local stream success");
              rtc.remoteStreams.play("local_stream");
              rtc.client.publish(rtc.remoteStreams, function (err) {
                console.log("publish failed");
                console.error(err);
              })
            }, function (err) {
              console.error("init local stream failed ", err);
            });

            rtc.client.on("connection-state-change", function (evt) {
              console.log("audience", evt)
            });

            rtc.client.on("stream-subscribed", function (evt) {
              var stream = evt.stream;
              // Sets the volume of the remote stream to 50.
              stream.setAudioVolume(400);
            });

            rtc.client.on("connection-state-change", function (evt) {
              console.log("audience", evt)
            })

            rtc.client.on("stream-added", function (evt) {
              var remoteStream = evt.stream;
              var id = remoteStream.getId();
              setUserJoin(true);
              setOnline(true)
              message.success('Expat has joined');
              startTime = moment()
              setStartTime(startTime)
              if (id !== rtc.params.uid) {
                rtc.client.subscribe(remoteStream, function (err) {
                  console.log("stream subscribe failed", err);
                })
              }
              console.log('stream-added remote-uid: ', id);
            });

            rtc.client.on("stream-removed", function (evt) {
              var remoteStream = evt.stream;
              var id = remoteStream.getId();
              console.log('stream-removed remote-uid: ', id);
            });

            rtc.client.on("stream-subscribed", function (evt) {
              var remoteStream = evt.stream;
              var id = remoteStream.getId();

              remoteStream.play("remote_video_");
              console.log('stream-subscribed remote-uid: ', id);
            })

            rtc.client.on("stream-unsubscribed", function (evt) {
              var remoteStream = evt.stream;
              var id = remoteStream.getId();
              remoteStream.pause("remote_video_");
              console.log('stream-unsubscribed remote-uid: ', id);
            })

            rtc.client.on('peer-online', function (evt) {
              console.log('peer-online', evt.uid);
              setUserJoin(true);
              setOnline(true)
              message.success('Expat has joined');
              startTime = moment()
              setStartTime(startTime)
            });

            rtc.client.on("peer-leave", function (evt) {
              var remoteStream = evt.stream;
              setOnline(false)
              setUserJoin(false);
              var endTime1 = moment()
              if (endTime1 !== undefined) {
                var duration = moment.duration(endTime1.diff(startTime));
                var miliminutes = (parseInt(duration.asMilliseconds()))
                console.log("Start Time: ", startTime)
                console.log("End Time", endTime1)
                console.log("Diff: ", miliminutes)
                setCallTime(miliminutes)
              }
              message.error('Expat has quit');
            })

          }

        }, function (err) {
          console.error("client join failed", err)
        })

      rtc.client.on('user-joined', async (user, reason) => {
        await rtc.client.subscribe(user, reason)
        console.log("Joined user: ", user)
      })

    }, (er) => {
      console.error(er);
    });
  }

  async function fetchAppointment() {
    var tableData = {}
    try {
      await axios.get(`https://hcmc.herokuapp.com/api/appointment/${tokeId}`,
        { headers: { "content-type": "application/json", "Authorization": `Bearer ${token}` }, },
      ).then(res => {
        tableData = res.data
        setAppointment(tableData)
        console.log("done")
      }).catch(error => {
        console.log(error)
      })
    } catch (e) {
      console.log(e)
    }
    return tableData
  }

  console.log(appointment)


  useEffect(() => {
    var randomNum = Math.floor(1000 + Math.random() * 9000);
    localStorage.setItem('uid', randomNum)
    console.log(localStorage.getItem('uid'))
    var channelName = '';
    async function fetchCall() {
      try {
        const appointment = await fetchAppointment()
        var m = new Date();
        const getMonth = padLeft((m.getMonth() + 1), 2, '0')
        const getUTCDate = padLeft(m.getDate(), 2, '0')
        const hour = padLeft(m.getHours(), 2, 0)
        const minute = padLeft(m.getMinutes(), 2, 0)
        var currentDate = m.getFullYear() + "" + getMonth + "" + getUTCDate + "" + hour + "" + minute
        const startTime = appointment.session.startTime
        const date1 = padLeft(startTime[1], 2, '0')
        const date2 = padLeft(startTime[2], 2, '0')
        const date3 = padLeft(startTime[3], 2, '0')
        const date4 = padLeft(startTime[4], 2, '0')
        var startDate1 = startTime[0] + "" + date1 + "" + date2 + "" + date3 + "" + date4
        const endDate = appointment.session.endTime
        const date5 = padLeft(endDate[1], 2, '0')
        const date6 = padLeft(endDate[2], 2, '0')
        const date7 = padLeft(endDate[3], 2, '0')
        const date8 = padLeft(endDate[4], 2, '0')
        var endDate1 = endDate[0] + "" + date5 + "" + date6 + "" + date7 + "" + date8
        if ((currentDate - startDate1 >= 0) && (currentDate - endDate1 <= 0)) {
          await axios.post(`https://hcmc.herokuapp.com/api/agora/rtc`,
            { headers: { "content-type": "application/json", "Authorization": `Bearer ${token}` }, },
            {
              params: {
                channelName: appointment.channelName,
                expirationTimeInSeconds: 7200,
                role: 1,
                uid: randomNum
              },
            }
          ).then(res => {
            console.log(res)
            const tableData = res.data.token
            localStorage.setItem('callToken', tableData)
            setCallToken(tableData)

          }).catch(error => {
            console.log(error)
          })
          calculateTime(appointment);
        } else {
          openNotification()
        }
      } catch (e) {
        console.log(e)
      }

    }
    fetchCall();


  }, [])

  const openNotification = () => {
    const key = `open${Date.now()}`;
    const btn = (
      <Button type="primary" size="small" onClick={() => window.close()}>
        Confirm
      </Button>
    );
    notification.open({
      message: 'Your appointment not started',
      description:
        'The appointment may not started yet or time has expired',
      btn,
      duration: 0
    });
  };

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
      <div>
        {/* <button onClick={() => joinChannel('host')}>Join Channel as Host</button>
      <button onClick={() => leaveEventHost('host')}>Leave Event Host</button> */}
        <div id="local_stream" style={{ width: "0", height: "0" }}></div>
        <div id="remote_video_" />

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', fontFamily: 'Arial', fontSize: 16, height: '30vh' }}>
          <Badge dot color={isOnline == true ? 'lime' : 'red'} style={{ width: 20, height: 20, top: 9, right: 9 }}>
            <Avatar shape="circle" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} size={100} icon={<Image src={appointment.expat.avatarLink} />} />
          </Badge>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'Arial', fontSize: 16 }}>
          <Text>{appointment.expat.fullname}</Text>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'Arial', fontSize: 16 }}>
          <Countdown date={Date.now() + milSecond} renderer={beforeRender} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', height: '40vh' }}>
          <div style={{ padding: 5 }}>
            <Button style={{ width: 50, height: 50 }} type="default" shape="circle" icon={<AudioOutlined />} />
          </div>
          <div style={{ padding: 5 }}>
            <Button style={{ width: 50, height: 50 }} type="primary" onClick={onClick} shape="circle" icon={<PhoneOutlined />} danger />
          </div>
          <div style={{ padding: 5 }}>
            <Button style={{ width: 50, height: 50 }} type="default" shape="circle" icon={<SoundOutlined />} />
          </div>

        </div>
      </div>

    );
  }
}

export default StartAppointment;
