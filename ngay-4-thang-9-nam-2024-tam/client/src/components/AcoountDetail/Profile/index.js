import React, { useState, useEffect } from 'react';
import "./styles.js";
import { Input, Button, Tooltip, notification, Avatar } from 'antd';
import { Row, Col } from 'antd';
import { ProfileStyles } from './styles.js';
import { GlobalOutlined } from '@ant-design/icons';

function ProfilePage({ user: initialUser}) {
  const [user, setUser] = useState(initialUser);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(prevUser => ({
        ...prevUser,
        ...storedUser
      }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => {
      const updatedUser = {
        ...prevUser,
        [name]: value,
      };
      console.log('Updated user data:', updatedUser);
      return updatedUser;
    });
  };

  const handleSave = () => {
    localStorage.setItem('user', JSON.stringify(user));
    console.log('Saved user data:', user);

    notification.success({
      message: 'Success',
      description: 'User data has been saved successfully!',
      placement: 'bottomLeft',
    });
  };

  return (
    <ProfileStyles>

      <div className="container">
        <img src="../../assets/pro5-img.png" alt="Profile" className='img' />
        <div className="title">
          <h3>Manage your personal information</h3>
          <div className="subtitle">
            <p>
              This is an Atlassian account. Edit your personal information and visibility settings through your <a href="">Atlassian profile</a>.
            </p>
            <p>
              To learn more, view our <a href="">Terms of Service</a> or <a href="">Privacy Policy</a>.
            </p>
          </div>
        </div>
        <div className="body">
          <h3>About</h3>
          <div className="info">
            <Row gutter={24}>
              <Col span={16}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginTop: '20px' }}>
                  <span>Username</span>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Tooltip
                      placement="bottom"
                      title="Visible to anyone on the internet, including those that find you through search engines like Google. Edit your username to reflect how you'd like people to see it."
                      overlayStyle={{ maxWidth: '300px', fontSize: '10px' }}
                    >
                      <GlobalOutlined style={{ marginRight: '5px' }} />
                      <span>Always public</span>
                    </Tooltip>
                  </div>
                </div>
                <Input
                  type="text"
                  name="username"
                  value={user.username}
                  onChange={handleChange}
                  style={{ width: '100%', marginTop: '5px' }}
                />
              </Col>

              <Col span={16}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginTop: '10px' }}>
                  <span>Bio</span>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Tooltip
                      placement="bottom"
                      title="Visible to anyone on the internet, including those that find you through search engines like Google. Edit your bio to reflect how you'd like people to see it."
                      overlayStyle={{ maxWidth: '300px', fontSize: '10px' }}
                    >
                      <GlobalOutlined style={{ marginRight: '5px' }} />
                      <span>Always public</span>
                    </Tooltip>
                  </div>
                </div>
                <Input.TextArea
                  name="bio"
                  value={user.bio}
                  onChange={handleChange}
                  rows={3}
                  style={{ width: '100%' }}
                />
              </Col>

              <Col span={16}>
                <Button
                  type="primary"
                  onClick={handleSave}
                  style={{ marginTop: '10px', width: '100%', marginTop: '40px' }}
                >
                  Save
                </Button>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </ProfileStyles>
  );
}

export default ProfilePage;
