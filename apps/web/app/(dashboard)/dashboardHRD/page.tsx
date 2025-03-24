import React from 'react';
import DashboardWrapper from '../../components/DashboardWrapper/dashboardWrapperHRD';
import CardLineChart from '../../components/Cards/CardLineChart';
import Footer from '../../components/Footers/index';
import withAuth from '../../../lib/withAuth';

const DashboardPage = () => {
    return (
        <div>
            <DashboardWrapper>
                {/* Konten utama Dashboard */}
                <div></div>
                <CardLineChart />
            </DashboardWrapper>
            <Footer />
        </div>
    );
};

export default withAuth(DashboardPage);