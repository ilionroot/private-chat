import React from "react";

import "./index.css";

const Message = ({ author, message, id }) => {
  return (
    <div id={id} className="message">
      <h4>{author}:</h4>
      {message.split(":")[0] === "data" ? (
        <img className="image" src={message} alt={`Sent by: ${author}`} />
      ) : (
        <p>{message}</p>
      )}
    </div>
  );
};

export default Message;
