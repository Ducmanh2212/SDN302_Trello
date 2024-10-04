import React from 'react';
import { ActivityStyles } from './styles';
import { MenuOutlined, TeamOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { Avatar, Col, List, Row, Typography } from 'antd';

const { Text } = Typography;

function ActivityPage({ activities }) {
  const activitiesCardEdit = activities.filter(activity => activity.card);
  const activitiesListEdit = activities.filter(activity => !activity.card);

  return (
    <ActivityStyles>
      <div className="container">
        <div className="workspaces">
          <div className="header">
            <TeamOutlined style={{ borderBottom: 'none' }} />
            <span className="title" style={{ marginLeft: '10px', fontSize: '20px' }}>Workspaces</span>
          </div>
          <div className="list-workspace">
            <Link to="/">Trello WorkSpace</Link>
          </div>
        </div>

        <div className="activity">
          <div className="list-activity">
            <div className="header">
              <MenuOutlined style={{ borderBottom: 'none' }} />
              <span className="title" style={{ marginLeft: '10px', fontSize: '20px' }}>Activity</span>
            </div>

            <div className="list-activity">
              <List
                dataSource={[...activitiesCardEdit, ...activitiesListEdit]}
                renderItem={(activity, index) => (
                  <List.Item key={index}>
                    <Row align="middle">
                      <Col>
                        <Avatar size={50} src="../../assets/ava.png" />
                      </Col>
                      <Col>
                        <Text strong>{activity.name}</Text> {activity.action}
                        {activity.card ? (
                          <>
                            <Link
                              className='link-card'
                              style={{ textDecoration: 'none' }}
                              to={`/card/${activity.cardId}`}
                            >
                              <Text
                                className='text-link-card'
                                type="link"
                                style={{ marginLeft: '5px', color: 'blue' }}
                              >
                                {activity.card}
                              </Text>
                            </Link>
                            {activity.list && <Text> to {activity.list}</Text>}
                          </>
                        ) : (
                          <Text> list {activity.list} to
                            <Link className='link-card' to={`/board/${activity.boardId}`}>
                              <Text
                                className='text-link-card'
                                type="link"
                                style={{ marginLeft: '5px', color: 'blue' }}
                              >
                                {activity.board}
                              </Text>
                            </Link>
                          </Text>
                        )}
                        <br />
                        <Text style={{ color: 'gray' }}>
                          {activity.date}, {activity.time} • on board
                          <Link className='link-card' to={`/board/${activity.boardId}`}>
                            <Text
                              type="link"
                              style={{ marginLeft: '5px', textDecoration: 'underline' }}
                            >
                              {activity.board}
                            </Text>
                          </Link>
                        </Text>
                      </Col>
                    </Row>
                  </List.Item>
                )}
              />
            </div>
          </div>
        </div>
      </div>
    </ActivityStyles>
  );
}

export default ActivityPage;
