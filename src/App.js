import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    updateProfile,
} from "@firebase/auth";
import { collection, onSnapshot, orderBy, query } from "@firebase/firestore";
import { Button, Input, Modal } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import "./App.css";
import Header from "./components/header/Header";
import Post from "./components/post/Post";
import UploadPost from "./components/uploadPost/UploadPost";
import { db, auth } from "./firebase";

function App() {
    const style = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 400,
        bgcolor: "#fff",
        border: "2px solid #000",
        boxShadow: 24,
        p: 4,
    };
    const [posts, setPosts] = useState([]);
    const [loggingIn, setLoggingIn] = useState(false);
    const [open, setOpen] = useState(false);
    const [openLogin, setOpenLogin] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [user, setUser] = useState(null);
    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (authuser) => {
            if (authuser) {
                setUser(authuser);
            } else {
                setUser(null);
            }
        });
        return () => {
            unsubscribeAuth();
        };
    }, [user, username]);
    useEffect(() => {
        const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
        const unsubscribeDb = onSnapshot(q, (snapshot) => {
            setPosts(
                snapshot.docs.map((doc) => ({ id: doc.id, post: doc.data() }))
            );
        });
        return () => {
            unsubscribeDb();
        };
    }, []);
    const handleSignup = (e) => {
        setLoggingIn(true);
        e.preventDefault();
        if (openLogin) {
            signInWithEmailAndPassword(auth, email, password)
                .then(() => {
                    setOpenLogin(false);
                    setOpen(false);
                    setEmail("");
                    setPassword("");
                    setUsername("");
                    setLoggingIn(false);
                    return;
                })
                .catch((error) => {
                    setLoggingIn(false);
                    alert(error.message);
                });
        } else {
            createUserWithEmailAndPassword(auth, email, password)
                .then((authuser) => {
                    updateProfile(authuser.user, {
                        displayName: username,
                    });
                    setOpenLogin(false);
                    setOpen(false);
                    setEmail("");
                    setPassword("");
                    setUsername("");
                    setLoggingIn(false);
                    return;
                })
                .catch((error) => {
                    setLoggingIn(false);
                    alert(error.message);
                });
        }
    };
    return (
        <div className="app">
            <Modal
                open={open}
                onClose={() => {
                    setOpenLogin(false);
                    setOpen(false);
                    setEmail("");
                    setPassword("");
                    setUsername("");
                }}
            >
                <Box sx={style}>
                    <form className="app_signUp">
                        <center>
                            <img
                                className="app_headerImage"
                                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                                alt=""
                            />
                        </center>
                        {!openLogin && (
                            <Input
                                placeholder="Username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        )}
                        <Input
                            placeholder="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Input
                            placeholder="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Button
                            disabled={loggingIn}
                            type="submit"
                            onClick={handleSignup}
                        >
                            {!loggingIn
                                ? openLogin
                                    ? "Sign in"
                                    : "Sign up"
                                : "Logging..."}
                        </Button>
                    </form>
                </Box>
            </Modal>
            <Header user={user} setOpen={setOpen} setOpenLogin={setOpenLogin} />
            {user ? (
                <UploadPost user={user} />
            ) : (
                <h3 className="app_loginToPost">Login to post or comment</h3>
            )}
            <div className="app_posts">
                {posts.map((post) => (
                    <Post
                        username={user?.displayName}
                        postId={post.id}
                        key={post.id}
                        post={post.post}
                    />
                ))}
            </div>
        </div>
    );
}

export default App;
