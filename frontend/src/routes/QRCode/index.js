import { QRCodeSVG } from 'qrcode.react';
import classes from './index.module.css';
import { ReloadOutlined, QuestionOutlined, LoadingOutlined } from '@ant-design/icons';
import { Button, notification, Space, message } from 'antd';
import axios from "axios";
import { useState, useEffect } from "react";

export default function QRCodePage() {
    const [loading, setLoading] = useState(false);
    const [rawCode, setRawCode] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(window.APIROOT + 'api/user/data');
                const code = response.data.secret + response.data.email;
                setRawCode(code);
                setLoading(false);
            } catch (error) {
                message.error('Failed to fetch QR code');
            }
        }
        fetchData();
    }, []);

    return (
        <div className={classes.qrBody}>
            <div className={classes.qrWrap}>
                <div className={classes.loading} style={{ opacity: loading ? 1 : 0 }}><LoadingOutlined /></div>
                <QRCodeSVG className={classes.qr} size={256} value={rawCode} />
            </div>
            <Space>
                <Button type='primary' size='large' icon={<ReloadOutlined />}
                    onClick={async () => {
                        setLoading(true);
                        try {
                            const response = await axios.get(window.APIROOT + 'api/user/resetSecret');
                            const code = response.data.secret + response.data.email;
                            setRawCode(code);
                            setLoading(false);
                            message.success('New QR code created successfully');
                        } catch (error) {
                            message.error('Failed to create new QR code');
                        }
                    }}
                >Create New</Button>
                <Button size='large' icon={<QuestionOutlined />} onClick={() =>
                    notification.open({ message: <b>Information</b>, description: 'Keep your QR code private. If you think it has been compromised, reissue a new one using this Create New button.', placement: 'top', closeIcon: '[ CLOSE ]', duration: 10 })
                } />
            </Space>
        </div>
    );
}