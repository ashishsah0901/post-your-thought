import { Avatar } from "@mui/material";
import React from "react";
import "./post.css";

const Post = (props) => {
    const { username, postImage, postCaption } = props.post;
    return (
        <div className="post">
            <div className="post_header">
                <Avatar
                    className="post_avatar"
                    src="https://stat1.bollywoodhungama.in/wp-content/uploads/2021/07/Tara-Sutaria-looks-scintillating-in-stunning-black-strapless-dress.jpg"
                >
                    {username.charAt(0)}
                </Avatar>
                <h3>tarasutaria</h3>
            </div>
            <img className="post_image" src={postImage} alt="" />
            <h4 className="post_text">
                <Avatar
                    className="post_textAvatar"
                    src="https://stat1.bollywoodhungama.in/wp-content/uploads/2021/07/Tara-Sutaria-looks-scintillating-in-stunning-black-strapless-dress.jpg"
                >
                    {username.charAt(0)}
                </Avatar>
                <strong>{username}</strong>
                {postCaption}
            </h4>
        </div>
    );
};

export default Post;
