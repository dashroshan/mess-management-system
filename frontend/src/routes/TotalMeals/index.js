import classes from './index.module.css';
import { Button, Space, message } from 'antd';
import { useState, useEffect } from 'react';
import axios from 'axios';
import WeekMenu from '../../components/WeekMenu';

export default function TotalMealsPage() {
    const [thisweek, setthisweek] = useState(true);
    const [menu, setMenu] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.post(window.APIROOT + 'api/admin/meals', { week: thisweek ? "this" : "next" });
                setMenu(response.data);
                console.log(response.data);
                setLoading(false);
            } catch (error) {
                message.error('Failed to fetch menu from server');
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
            <h1>{thisweek ? "Total Meals This Week" : "Total Meals Next Week"}</h1>
            <WeekMenu loading={loading} menu={menu} mobile={false} />
        </div >
    );
}