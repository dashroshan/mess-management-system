import classes from './index.module.css';
import { useState, useEffect } from 'react';
import { QrReader } from 'react-qr-reader';
import { Radio, Card, Button, message } from 'antd';
import Fade from '../../utility/fade';
import { CloseSquareOutlined, CheckSquareOutlined, ReloadOutlined, LoadingOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import axios from 'axios';

export default function ScanQRPage() {
    const [data, setData] = useState();
    const [type, setType] = useState(null);
    const [valid, setValid] = useState(null);

    const checkCoupon = async (postData) => {
        try {
            const response = await axios.post(window.APIROOT + 'api/user/checkCoupon', postData);
            setValid(response.data);
        } catch (error) {
            message.error("Failed to reach server to verify coupon");
            setData(null);
        }
    }

    useEffect(() => {
        if (!data) return;
        const secret = data?.substring(0, 4);
        const email = data?.substring(4, data.length);
        const day = (new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date())).toLowerCase();
        checkCoupon({ secret: secret, email: email, day: day, type: type });
    }, [data, type])

    return (
        <>
            <QrReader className={classes.qrreader} onResult={result => {
                if (!!result) setData(result?.text)
            }} />
            <div className={classes.body}>
                <Card className={classes.card}>
                    <div className={classes.radio}>
                        <Radio.Group buttonStyle="solid" onChange={(e) => setType(e.target.value)}>
                            <Radio.Button value="breakfast">Breakfast</Radio.Button>
                            <Radio.Button value="lunch">Lunch</Radio.Button>
                            <Radio.Button value="dinner">Dinner</Radio.Button>
                        </Radio.Group>
                    </div>
                    {
                        type ?
                            <h1>Scan QR Code for {type}</h1> :
                            <h1>Select the meal</h1>
                    }
                    <motion.div layout>
                        {type ? <Fade one2Two={valid === null} one={<LoadingOutlined className={classes.icon} />} two={<Fade one2Two={!valid} one={<CloseSquareOutlined className={classes.icon} />} two={<CheckSquareOutlined className={classes.icon} />} />} /> : null}
                    </motion.div>
                    <div className={classes.buttons}>
                        <Button disabled={!type} type='primary' size='large' icon={<ReloadOutlined />} onClick={() => {
                            setData(null);
                            setValid(null);
                        }}>Scan New</Button>
                    </div>
                </Card>
            </div >
        </>
    );
}