import React from "react";

import Container from "react-bootstrap/cjs/Container";
import Row from "react-bootstrap/cjs/Row";
import Col from "react-bootstrap/cjs/Col";
import Button from "react-bootstrap/cjs/Button";
import Form from "react-bootstrap/cjs/Form";
import InputGroupWithExtras from "react-bootstrap/cjs/InputGroup";

import 'bootstrap/dist/css/bootstrap.min.css';
import VideoPlayer from "./VideoPlayer";
import ChatRoom from "./ChatRoom";
import DatabaseBackend from "./DatabaseBackend";
import URLFormatter from "./URLFormatter";

class PartyRoom extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            'room_id': props.room_id || "NO ROOM ID PROVIDED",
            'title': props.title || "STREAMPLUS",
            'url': props.url,
            'database': new DatabaseBackend(),
            'ref': "",
            'is_join': props.is_join || false,
            'name': props.name,
            'add_url':'',
            'play_mode':'pause',
            'url_formatter': new URLFormatter(),
        };

        console.log(`IS JOIN ${this.state.is_join}`);


    }
    componentDidMount() {
        if(!this.state.is_join) {
            this.state.database.createRoom({
                "url": this.state.url, "title": this.state.title,
                "mode": "pause", "time": 0.000,
                "chats":[{"color":"light","text_color":"dark","from":"STREAMPLUS","text":"Welcome to STREAMPLUS Party!","title": this.state.title}],
                "video_list": [this.state.url],
            }).then(ref => {
                this.state.room_id = ref.id;
                console.log(ref.id);
                ref.onSnapshot(doc => {
                    console.log("Current data: ", doc.data());
                })
                this.setState({'room_id':ref.id});

                    ref.onSnapshot(doc => {
                        let data = doc.data();

                        if (data != undefined) {
                            if (data['mode'] != this.state.mode) {
                                this.setState({"play_mode": data['mode']})
                            }
                        }
                    })
            })


        } else {
            console.log('fetching room info')
            this.state.database.getRef(this.state.room_id).then(ref => {
                this.state.room_id = ref.id;
                ref.get().then(doc=>{
                    console.log(doc.data());
                    this.setState({'room_id':ref.id, url: doc.data['url'],title:doc.data['title']});
                })
            })


        }

    }

    render() {

        let room_controls  = "";

        if(!this.state.is_join){
            room_controls = (
                <div>
                    <Row>
                        <Col md={"auto"}>
                        <Button variant={"light"} onClick={()=>this.state.database.deleteRoom()}>Delete Room</Button>
                        </Col>
                        <Col md={"auto"}>
                            <InputGroupWithExtras>
                                <Form.Control
                                    onChange ={ evt => {this.state.add_url = evt.target.value}}
                                    placeholder={"Video URL"}>
                                </Form.Control>
                                <InputGroupWithExtras.Append>
                                    <Button variant={"light"} 
                                            onClick={()=>this.state.database.addVideo(this.state.url_formatter.rewrite_url(this.state.add_url))}
                                    >Add Video</Button>
                                </InputGroupWithExtras.Append>
                            </InputGroupWithExtras>

                        </Col>
                    </Row>
                </div>
            );

        }

        return(
            <div>
                <Container fluid>
                    <br/>
                    <Row className={"justify-content-md-center"}>
                       
                    </Row>
                    <Row >
                        <Col>
                        <div style={{ color: '#ffffff' }}>Room-ID: {this.state.room_id}</div>
                        </Col>
                        <Col>
                        <div style={{ color: '#ffffff' }}> {this.state.play_mode.toUpperCase()}</div>
                        </Col>
                    </Row>
                    <Row >
                        <Col md={'auto'}>
                        <div style={{ color: '#ffffff' }}> <VideoPlayer url={this.state.url} database={this.state.database} is_join={this.state.is_join}/></div>
                        </Col>
                        <Col md={'auto'}>
                        <div style={{ color: '#ffffff' }}><ChatRoom name={this.state.name} database={this.state.database}/></div>
                        </Col>
                    </Row>
                    <br/>
                    {room_controls}
                </Container>

            </div>
        );
    }
}

export default PartyRoom;