import React, { useState, useEffect, useRef } from "react";
import $ from "jquery";
import io from "socket.io-client";

import Message from "../../components/Message";
import Container from "../../components/Container/";

import "./index.css";

const socket = io("http://192.168.0.105:5000", { secure: true });
socket.on("connect", () => {
  console.log("Conectado!");
});

const Chat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const recording = useRef(false);
  const [author, setAuthor] = useState("");

  socket.on("someoneWalk", (msg) => {
    setMessages([...messages, msg]);
    $(".messagesContainer")
      .stop()
      .animate({ scrollTop: $(".messagesContainer")[0].scrollHeight }, 1000);
  });

  socket.on("addImage", (image) => {
    setMessages([...messages, image]);
    $(".messagesContainer")
      .stop()
      .animate({ scrollTop: $(".messagesContainer")[0].scrollHeight }, 1000);
  });

  const verifyAndSendImage = (e) => {
    let file = e.target.files[0];
    if (file) {
      let reader = new FileReader();
      reader.onload = (e) => {
        socket.emit("sendMessage", {
          author,
          message: e.target.result,
        });
        setMessages([
          ...messages,
          {
            id: messages.length,
            author,
            message: e.target.result,
          },
        ]);
        $(".messagesContainer")
          .stop()
          .animate(
            { scrollTop: $(".messagesContainer")[0].scrollHeight },
            1000
          );
      };
      return reader.readAsDataURL(file);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (message !== "") {
      setMessage("");
      socket.emit("sendMessage", {
        author,
        message,
      });
      setMessages([
        ...messages,
        {
          id: messages.length,
          author,
          message,
        },
      ]);
      $(".messagesContainer")
        .stop()
        .animate({ scrollTop: $(".messagesContainer")[0].scrollHeight }, 1000);
    }
  };

  let mediaRecorder;

  const recordAudio = () => {
    navigator.getUserMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia;

    if (!recording.current) {
      navigator.mediaDevices
        .getUserMedia({ audio: true, video: false })
        .then((stream) => {
          mediaRecorder = new MediaRecorder(stream);
          let buffer = [];
          mediaRecorder.ondataavailable = (data) => {
            buffer.push(data.data);
          };
          mediaRecorder.onstop = () => {
            const blob = new Blob(buffer, { type: "audio/mp3;" });
            const reader = new FileReader();
            reader.onloadend = () => {
              socket.emit("sendMessage", {
                author,
                message: reader.result,
              });
              setMessages([
                ...messages,
                {
                  id: messages.length,
                  author,
                  message: reader.result,
                },
              ]);
              $(".messagesContainer")
                .stop()
                .animate(
                  { scrollTop: $(".messagesContainer")[0].scrollHeight },
                  1000
                );
            };
            reader.readAsDataURL(blob);
          };

          mediaRecorder.start();
          recording.current = true;
          $("#recordAudio svg").css("animation", "recording 1s ease infinite");
          $("#recordAudio svg").css("fill", "red");
        })
        .catch((err) => console.log("Erro: " + err));
    } else {
      mediaRecorder.stop();
      recording.current = false;
      $("#recordAudio svg").css("animation", "gayerColors 30s ease infinite");
    }
  };

  useEffect(() => {
    socket.on("allMessages", (msgs) => {
      setMessages(
        ...messages,
        msgs.map((msg) => msg)
      );
    });
    let author = prompt("Digite o seu apelido");
    setAuthor(author ? author : "Anonymous");
    setTimeout(() => {
      $(".messagesContainer")
        .stop()
        .animate({ scrollTop: $(".messagesContainer")[0].scrollHeight }, 1000);
    }, 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container>
      <div className="chatContainer">
        <div className="gayerMenu">
          <h1>Private Chat</h1>
        </div>
        <div className="messagesContainer">
          {messages.map((msg) => {
            return (
              <Message
                key={msg.id}
                id={msg.id}
                author={msg.author}
                message={msg.message}
              />
            );
          })}
        </div>
        <div className="controlsContainer">
          <form encType="multipart/form-data" onSubmit={sendMessage}>
            <input
              type="file"
              accept="image/*"
              id="real-input"
              onChange={verifyAndSendImage}
              style={{
                visibility: "hidden",
                position: "fixed",
                left: "-9000px",
              }}
            />
            <label htmlFor="real-input">
              <svg
                version="1.1"
                id="Capa_1"
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="673.221px"
                height="673.222px"
                viewBox="0 0 673.221 673.222"
                style={{ enableBackground: "new 0 0 673.221 673.222" }}
              >
                <g>
                  <path
                    d="M470.486,136.597c13.158-13.77-13.158-41.279-26.347-27.509L138.69,428.215c0,0-68.452,71.543-5.263,137.547
		c63.188,66.035,131.672-5.508,131.672-5.508l321.269-335.621c0,0,84.272-88.036-5.263-181.581
		c-89.536-93.544-173.809-5.508-173.809-5.508L86.028,373.196c0,0-121.115,126.562-5.264,247.615s236.997-5.508,236.997-5.508
		l321.27-335.652c13.158-13.739-13.158-41.279-26.347-27.509L291.446,587.764c0,0-94.799,99.052-184.335,5.508
		c-89.535-93.544,5.264-192.565,5.264-192.565L433.613,65.054c0,0,57.926-60.527,121.146,5.508
		c63.188,66.035,5.263,126.562,5.263,126.562L238.783,532.745c0,0-42.136,44.033-79.009,5.508s5.263-82.528,5.263-82.528
		L470.486,136.597z"
                  />
                </g>
                <g></g>
                <g></g>
                <g></g>
                <g></g>
                <g></g>
                <g></g>
                <g></g>
                <g></g>
                <g></g>
                <g></g>
                <g></g>
                <g></g>
                <g></g>
                <g></g>
                <g></g>
              </svg>
            </label>
            <input
              type="text"
              onChange={(e) => setMessage(e.target.value)}
              value={message}
            />
            <button id="recordAudio" type="button" onClick={recordAudio}>
              <svg
                version="1.1"
                id="Capa_1"
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                viewBox="0 0 490.9 490.9"
                style={{ enableBackground: "new 0 0 490.9 490.9" }}
              >
                <g>
                  <g>
                    <path
                      d="M245.5,322.9c53,0,96.2-43.2,96.2-96.2V96.2c0-53-43.2-96.2-96.2-96.2s-96.2,43.2-96.2,96.2v130.5
			C149.3,279.8,192.5,322.9,245.5,322.9z M173.8,96.2c0-39.5,32.2-71.7,71.7-71.7s71.7,32.2,71.7,71.7v130.5
			c0,39.5-32.2,71.7-71.7,71.7s-71.7-32.2-71.7-71.7V96.2z"
                    />
                    <path
                      d="M94.4,214.5c-6.8,0-12.3,5.5-12.3,12.3c0,85.9,66.7,156.6,151.1,162.8v76.7h-63.9c-6.8,0-12.3,5.5-12.3,12.3
			s5.5,12.3,12.3,12.3h152.3c6.8,0,12.3-5.5,12.3-12.3s-5.5-12.3-12.3-12.3h-63.9v-76.7c84.4-6.3,151.1-76.9,151.1-162.8
			c0-6.8-5.5-12.3-12.3-12.3s-12.3,5.5-12.3,12.3c0,76.6-62.3,138.9-138.9,138.9s-138.9-62.3-138.9-138.9
			C106.6,220,101.2,214.5,94.4,214.5z"
                    />
                  </g>
                </g>
                <g></g>
                <g></g>
                <g></g>
                <g></g>
                <g></g>
                <g></g>
                <g></g>
                <g></g>
                <g></g>
                <g></g>
                <g></g>
                <g></g>
                <g></g>
                <g></g>
                <g></g>
              </svg>
            </button>
            <button type="submit">
              <svg
                version="1.1"
                id="Capa_1"
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                viewBox="0 0 535.5 535.5"
                style={{ enableBackground: "new 0 0 535.5 535.5" }}
              >
                <g>
                  <g id="send">
                    <polygon points="0,497.25 535.5,267.75 0,38.25 0,216.75 382.5,267.75 0,318.75 		" />
                  </g>
                </g>
                <g></g>
                <g></g>
                <g></g>
                <g></g>
                <g></g>
                <g></g>
                <g></g>
                <g></g>
                <g></g>
                <g></g>
                <g></g>
                <g></g>
                <g></g>
                <g></g>
                <g></g>
              </svg>
            </button>
          </form>
        </div>
      </div>
    </Container>
  );
};

export default Chat;
