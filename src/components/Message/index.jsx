import React from "react";

import "./index.css";

const Message = ({ author, message, id }) => {
  return (
    <div id={id} className="message">
      <h4>{author}:</h4>
      {(() => {
        switch (message.substring(0, 10)) {
          case "data:image":
            return (
              <img className="image" src={message} alt={`Sent by: ${author}`} />
            );

          case "data:audio":
            return (
              <audio className="audio" controls>
                <source src={message} type="audio/mp3" />
              </audio>
            );

          default:
            return <p>{message}</p>;
        }
      })()}
    </div>
  );
};

export default Message;
