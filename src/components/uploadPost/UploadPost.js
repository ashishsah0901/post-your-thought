import React, { useRef, useState } from "react";
import "./uploadpost.css";
import { Button, Input } from "@mui/material";
import { db, storage } from "../../firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "@firebase/storage";
import { addDoc, collection, serverTimestamp } from "@firebase/firestore";

const UploadPost = (props) => {
    const imageRef = useRef();
    const [caption, setCaption] = useState("");
    const [progress, setProgress] = useState(0);
    const [image, setImage] = useState(null);
    const handleChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };
    const handleUpload = () => {
        if (!image) return;
        setProgress(10);
        const reference = ref(storage, `images/${image.name}`);
        const uploadTask = uploadBytesResumable(reference, image);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const cProgress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(cProgress);
            },
            (error) => {
                alert(error.message);
            },
            () => {
                const reference = ref(storage, `images/${image.name}`);
                getDownloadURL(reference).then((url) => {
                    addDoc(collection(db, "posts"), {
                        timestamp: serverTimestamp(),
                        postCaption: caption,
                        postImage: url,
                        username: props.user.displayName,
                    }).then(() => {
                        setImage(null);
                        setCaption("");
                        setProgress(0);
                    });
                });
            }
        );
    };
    return (
        <div className="uploadpost">
            <progress
                className="uploadpost_progress"
                max="100"
                value={progress}
            />
            <Input
                className="uploadpost_caption"
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Enter a caption"
            />
            <input type="file" ref={imageRef} onChange={handleChange} />
            <Button onClick={handleUpload}>Post</Button>
        </div>
    );
};

export default UploadPost;
