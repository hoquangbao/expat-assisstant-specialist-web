import React, { useEffect } from 'react';
import AgoraRTC from "agora-rtc-sdk";
import { Button, Avatar, Typography } from 'antd';
import { PhoneOutlined, SoundOutlined, AudioOutlined, UserOutlined } from '@ant-design/icons';
import Countdown from 'react-countdown';

var rtc = {
  client: null,
  joined: false,
  published: false,
  localStream: null,
  remoteStreams: [],
  params: {}
};

// Options for joining a channel
var option = {
  appID: "9aff35de497443c9be8469665d87176b",
  channel: "baobao",
  uid: null,
  token: "0069aff35de497443c9be8469665d87176bIAATJfdYqUoExd1CNlam77/O3FDBSuHrIeXIb1xDET5Z0DuPUdkAAAAAEABYI5phRfsJYQEAAQBF+wlh",
  key: '',
  secret: ''
}

const { Text } = Typography;
const role = 'host'



function joinChannel(role) {
  // Create a client
  rtc.client = AgoraRTC.createClient({ mode: "rtc", codec: "h264" });
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
            console.log(id)
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

        }

      }, function (err) {
        console.error("client join failed", err)
      })

  }, (err) => {
    console.error(err);
  });
}

function leaveEventHost(params) {
  rtc.client.unpublish(rtc.remoteStreams, function (err) {
    console.log("publish failed");
    console.error(err);
  })
  rtc.client.leave(function (ev) {
    console.log(ev)
  })
}

function leaveEventAudience(params) {
  rtc.client.leave(function () {
    console.log("client leaves channel");
    //……
  }, function (err) {
    console.log("client leave failed ", err);
    //error handling
  })
}

function onClick() {
  rtc.client.unpublish(rtc.remoteStreams, function (err) {
    console.log("publish failed");
    console.error(err);
  })
  rtc.client.leave(function (ev) {
    console.log(ev)
  })
  window.close();
}

const renderer = ({ hours, minutes, seconds, completed }) => {
  if (completed) {
    // Render a completed state
    return window.close();
  } else {
    // Render a countdown
    return (
      <span>
        {minutes}:{seconds}
      </span>
    );
  }
};

function StartAppointment(props) {

  useEffect(() => {
    function joinChannel(role) {
      // Create a client
      rtc.client = AgoraRTC.createClient({ mode: "rtc", codec: "h264" });
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
                console.log(id)
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

            }

          }, function (err) {
            console.error("client join failed", err)
          })

      }, (err) => {
        console.error(err);
      });
    }
    joinChannel(role);
  }, [])

  return (
    <div>
      {/* <button onClick={() => joinChannel('host')}>Join Channel as Host</button>
      <button onClick={() => leaveEventHost('host')}>Leave Event Host</button> */}
      <div id="local_stream" style={{ width: "0", height: "0" }}></div>
      <div id="remote_video_" />
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <div style={{ boxShadow: "#000000" }}>
          <Avatar style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} size={100} icon={<UserOutlined />} />
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'Arial', fontSize: 16 }}>
            <Text>Lê Quang Bảo</Text>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'Arial', fontSize: 16 }}>
            <Countdown date={Date.now() + 1000000} renderer={renderer} />
          </div>
        </div>
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

export default StartAppointment;
