import {Button} from "antd";
import {DislikeOutlined, LikeOutlined} from "@ant-design/icons";
import React from "react";
import s from './RatingComponent.module.scss';
import CheckOutlined from "@ant-design/icons/lib/icons/CheckOutlined";

const RatingComponent = ({like, dislike, liked}) => {
    return <div className={s.rating}>
        <Button type="primary" shape="round" icon={<LikeOutlined />} size={'default'} onClick={() => like()} className={s.button}>
            Like{liked ? <CheckOutlined /> : ''}
        </Button>
        <Button type="danger" shape="round" icon={<DislikeOutlined />} size={'default'} onClick={() => dislike()} className={s.button}>
            Dislike{liked !== null && !liked ? <CheckOutlined /> : ''}
        </Button>
    </div>
};

export default RatingComponent;
