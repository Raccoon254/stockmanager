'use client'

import Layout from '@/components/Layout'
import SaleDetails from '@/components/SaleDetails'
import {useBreadcrumbs} from "@/hooks/useBreadcrumbs";
import React from "react";

export default function SaleDetailsPage({params}) {
    const unwrappedParams = React.use(params);
    const {id} = unwrappedParams;
    const breadcrumbs = useBreadcrumbs()
    const breadcrumbItems = breadcrumbs.saleDetails(id)
    return (
        <Layout breadcrumbItems={breadcrumbItems}>
            <SaleDetails saleId={id}/>
        </Layout>
    )
}