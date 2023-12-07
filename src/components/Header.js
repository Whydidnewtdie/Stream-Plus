import React from "react";
import {LinkContainer} from 'react-router-bootstrap';
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";


import 'bootstrap/dist/css/bootstrap.min.css';

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return(
            <div>
                <Navbar bg="black" variant="dark" >
                    <LinkContainer to={"/"}>
                    <Navbar.Brand style={{ fontFamily: 'Georgia, serif', fontSize: '300px' }}>STREAMPLUS</Navbar.Brand>
                    </LinkContainer>

                </Navbar>

            </div>
        );
    }
}

export default Header;