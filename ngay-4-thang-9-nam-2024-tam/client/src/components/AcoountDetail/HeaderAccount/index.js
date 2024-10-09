import React from 'react';
import { Avatar, Col, Row } from 'antd';
import { Link } from 'react-router-dom';
import { HeaderStyles } from './styles';

function HeaderAccount({ user }) {
    return (
        <HeaderStyles>
            <div className="info-header" style={{ marginLeft: '20px' }}>
                <Row align="middle">
                    <Col>
                        <Avatar size={50} src="../../assets/ava.png" />
                    </Col>
                    <Col>
                        <div style={{ marginLeft: '10px' }}>
                            <span style={{ fontSize: '20px', fontWeight: 'bold' }}>{user.name}</span>
                            <br />
                            <span style={{ fontSize: '12px' }}>@{user.username}</span>
                        </div>
                    </Col>
                </Row>
            </div>

            <div className="nav">
                <Link to="/profile">Profile</Link> 
                <Link to="/profile/activity">Activity</Link>
            </div>
        </HeaderStyles>
    );
}

export default HeaderAccount;
