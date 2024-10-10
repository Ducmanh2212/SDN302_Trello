import React from 'react';
import HeaderAccount from './HeaderAccount';
import { Outlet } from 'react-router-dom';

function ProfileLayout({ user }) {
    return (
        <div>
            <HeaderAccount user={user} />
            <div className="profile-content">
                <Outlet />
            </div>
        </div>
    );
}

export default ProfileLayout;
