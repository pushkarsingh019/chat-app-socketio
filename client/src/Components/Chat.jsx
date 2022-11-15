import { useEffect } from "react";
import { useState } from "react"

export default function Chat({socket, room, username}){

    const [message, setMessage] = useState("");
    let [messageList, setMessagelist] = useState([]);

    async function sendMessage(event){
        event.preventDefault();
        let chatData = {
            room : room,
            author : username,
            message : message || "",
            time : new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
        }

        await socket.emit("sendMessage", chatData);
        setMessage("");
    };


    useEffect(() => {
        socket.on("get_message", (data) => {
            setMessagelist((list) => {
                return [...list, data]
            });
        })
    }, [socket, messageList])

    return(
        <section className="chat">
            <small><code>Room : {room}</code></small>
            <br />
            <small><code>Username : {username}</code></small>
            <div><h3>Live Chat</h3></div>
            <div>
                {messageList ? messageList.map((message) => {
                    return <h1>{message.message}</h1>
                }) : "start chatting"}
            </div>
            <form onSubmit={sendMessage}>
                <input value={message} required type="text" placeholder="message..." onChange={(event) => {setMessage(event.target.value)}} />
                <button type="submit">send</button>
            </form>
            <br />
            <br />
        </section>
    )
}