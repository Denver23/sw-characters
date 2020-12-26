import React from 'react';
import s from "./SpinnerComponent.module.scss";
import {Spin} from "antd";

const SpinnerComponent = () => {
    return <div className={s.spiner}>
        <Spin size="large"/>
    </div>
};

export default SpinnerComponent;
