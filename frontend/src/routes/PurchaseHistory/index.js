import classes from './index.module.css';
import { Button, Space, message } from 'antd';
import { useMediaQuery } from 'react-responsive';
import WeekMenu from '../../components/WeekMenu';
import axios from "axios";
import { useState, useEffect } from "react";

export default function PurchaseHistoryPage() {
    const mobile = useMediaQuery({ query: '(max-width: 750px)' });
    const [thisweek, setthisweek] = useState(true);
    const [menu, setMenu] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(window.APIROOT + 'api/data/menu');
                const buyer = await axios.get(window.APIROOT + 'api/user/data');
                let data = [];
                for (let r of response.data) {
                    data.push({
                        day: r.day,
                        breakfast: { text: r.breakfast, selected: buyer.data[thisweek ? "this" : "next"][r.day].breakfast },
                        lunch: { text: r.lunch, selected: buyer.data[thisweek ? "this" : "next"][r.day].lunch },
                        dinner: { text: r.dinner, selected: buyer.data[thisweek ? "this" : "next"][r.day].dinner },
                    })
                }
                setMenu(data);
                setLoading(false);
            } catch (error) {
                message.error('Failed to fetch purchase history from server');
            }
        }
        fetchData();
    }, [thisweek]);

    return (
        <div className={classes.menuBody}>
            <div className={classes.buttons}>
                <Space>
                    <Button disabled={thisweek} type='primary' size='large' onClick={() => setthisweek(true)}>This Week</Button>
                    <Button disabled={!thisweek} type='primary' size='large' onClick={() => setthisweek(false)}>Next Week</Button>
                </Space>
            </div>
            <h1>{thisweek ? "Your Coupons This Week" : "Your Coupons Next Week"}</h1>
            <WeekMenu loading={loading} menu={menu} mobile={mobile} highlight />
        </div >
    );
}