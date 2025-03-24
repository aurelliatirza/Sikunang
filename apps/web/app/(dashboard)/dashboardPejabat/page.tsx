"use client";
import React, { useEffect, useState } from "react";
import withAuth from "../../../lib/withAuth";
import { DashboardWrapper } from "../../components/DashboardWrapper/dashboardWrapperPejabat";
import CardLineChart from "../../components/Cards/CardLineChart";
import Footer from "../../components/Footers/index";

const DashboardPage = () => {

    return (
        <div>
            <DashboardWrapper>
                <CardLineChart />
            </DashboardWrapper>
            <Footer />
        </div>
    );
};

export default withAuth(DashboardPage);
