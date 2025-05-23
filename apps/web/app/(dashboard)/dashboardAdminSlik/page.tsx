"use client";
import React from 'react';
import withAuth from '../../../lib/withAuth';
import DashboardWrapper from '../../components/DashboardWrapper/dashboardWrapperAdminSlik';
import Footer from '../../components/Footers/index';

const DashboardPage = () => {
    return (
        <div>
            <DashboardWrapper>
                {/* Konten utama Dashboard */}
                <div></div>
            </DashboardWrapper>
            <Footer />
        </div>
    );
};

export default withAuth(DashboardPage);