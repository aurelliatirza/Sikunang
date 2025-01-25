import React from 'react';
import { DashboardWrapper } from './dashboardWrapper';
import CardLineChart from '../components/Cards/CardLineChart';
import Footer from '../components/Footers/index';

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

export default DashboardPage;
