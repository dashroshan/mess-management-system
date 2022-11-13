import classes from './index.module.css';
import { Table, message } from 'antd';
import { useMediaQuery } from 'react-responsive';
import WeekMenu from '../../components/WeekMenu';
import axios from "axios";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const timingCol = [
    {
        title: 'Meal',
        dataIndex: 'meal',
        key: 'meal',
        render: (text) => ({
            props: {
                style: { background: "#FAFAFA" },
            },
            children: <span style={{ fontWeight: 500 }}>{text}</span>
        })
    },
    {
        title: 'Time',
        dataIndex: 'time',
        key: 'time'
    }
];

export default function SchedulePage() {
    const mobile = useMediaQuery({ query: '(max-width: 750px)' });
    const [timingRow, setTimingRow] = useState([]);
    const [menu, setMenu] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                let response = await axios.get(window.APIROOT + 'api/data/time');
                setTimingRow(response.data);
            } catch (error) {
                message.error('Failed to fetch timing from server');
            }
        }
        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(window.APIROOT + 'api/data/menu');
                setMenu(response.data);
            } catch (error) {
                message.error('Failed to fetch menu from server');
            }
        }
        fetchData();
    }, []);

    return (
        <div className={classes.menuBody}>
            <h1>TIMING</h1>
            <Table loading={!timingRow.length} className={classes.table} columns={timingCol} dataSource={timingRow} pagination={false} bordered />
            <h1>MENU</h1>
            <motion.div layout>
                <WeekMenu loading={!menu.length} menu={menu} mobile={mobile} />
            </motion.div>
        </div>
    );
}