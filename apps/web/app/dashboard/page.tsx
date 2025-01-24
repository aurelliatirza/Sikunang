import React from 'react';
import { DashboardWrapper } from './dashboardWrapper';
import CardLineChart from '../components/Cards/CardLineChart';

const DashboardPage = () => {
    return (
        <DashboardWrapper>
            {/* Konten utama Dashboard */}
            <div></div>
            <CardLineChart />
        </DashboardWrapper>
    );
};

export default DashboardPage;
