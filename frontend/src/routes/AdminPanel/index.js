import classes from './index.module.css';
import { Button, Input, Card, Table, message } from 'antd';
import { SaveOutlined } from '@ant-design/icons'
import axios from "axios";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

function WeekMenu(menu, setMenu) {
    return menu.map(e =>
        <Table className={classes.table}
            columns={
                [
                    {
                        title: e.day && e.day.charAt(0).toUpperCase() + e.day.substring(1),
                        dataIndex: 'Type',
                        key: 'Type',
                        colSpan: 2,
                        width: 50,
                        render: (text) => ({
                            props: {
                                style: { background: "#FAFAFA" },
                            },
                            children: <span style={{ fontWeight: 500, textTransform: "capitalize" }}>{text}</span>,
                        })
                    },
                    {
                        title: '',
                        dataIndex: 'Meal',
                        key: 'Meal',
                        colSpan: 0,
                        width: 300,
                        render: (text, record) => ({
                            props: {
                                style: { padding: 0 },
                            },
                            children: <Input bordered={false} style={{ height: "3rem" }} defaultValue={text}
                                onChange={(ele) => {
                                    for (let i = 0; i < menu.length; i++) {
                                        let temp = menu;
                                        if (menu[i].day === e.day) {
                                            temp[i][record.Type.toLowerCase()] = ele.target.value;
                                            setMenu(temp);
                                            console.log(temp);
                                            break;
                                        }
                                    }
                                }}
                            />,
                        })
                    },
                ]
            }
            dataSource={
                [
                    {
                        key: '1',
                        Type: 'Breakfast',
                        Meal: e.breakfast,
                    },
                    {
                        key: '2',
                        Type: 'Lunch',
                        Meal: e.lunch,
                    },
                    {
                        key: '3',
                        Type: 'Dinner',
                        Meal: e.dinner,
                    },
                ]
            }
            pagination={false} bordered />
    );
}

export default function AdminPanel() {
    // TIME AND COST START
    const [timingRow, setTimingRow] = useState([]);
    const [savingTime, setSavingTime] = useState(false);

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
            title: 'Rs',
            dataIndex: 'cost',
            key: 'cost',
            render: (text, record) => ({
                props: {
                    style: { padding: 0 },
                },
                children: <Input bordered={false} style={{ height: "3rem" }} defaultValue={text}
                    onChange={(e) => {
                        for (let i = 0; i < timingRow.length; i++) {
                            let temp = timingRow;
                            if (timingRow[i].meal === record.meal) {
                                temp[i].cost = parseInt(e.target.value, 10);
                                setTimingRow(temp);
                                break;
                            }
                        }
                    }}
                />,
            }),
            width: 100
        },
        {
            title: 'Time',
            dataIndex: 'time',
            key: 'time',
            render: (text, record) => ({
                props: {
                    style: { padding: 0 },
                },
                children: <Input bordered={false} style={{ height: "3rem" }} defaultValue={text}
                    onChange={(e) => {
                        for (let i = 0; i < timingRow.length; i++) {
                            let temp = timingRow;
                            if (timingRow[i].meal === record.meal) {
                                temp[i].time = e.target.value;
                                setTimingRow(temp);
                                break;
                            }
                        }
                    }}
                />,
            })
        }
    ];

    const fetchTime = async () => {
        try {
            let response = await axios.get(window.APIROOT + 'api/data/time');
            setTimingRow(response.data);
            console.log(response.data);
        } catch (error) {
            message.error('Failed to fetch timing from server');
        }
    }

    const setTime = async () => {
        setSavingTime(true);
        try {
            await axios.post(window.APIROOT + 'api/admin/setTime', { times: timingRow });
            message.success('Changes saved successfully')
        } catch (error) {
            message.error('Failed to save changes');
        }
        setSavingTime(false);
    }

    useEffect(() => {
        fetchTime();
    }, []);
    // TIME AND COST END


    // MENU START
    const [menu, setMenu] = useState([]);
    const [savingMenu, setSavingMenu] = useState(false);

    const fetchMenu = async () => {
        try {
            const response = await axios.get(window.APIROOT + 'api/data/menu');
            setMenu(response.data);
        } catch (error) {
            message.error('Failed to fetch menu from server');
        }
    }

    const saveMenu = async () => {
        setSavingMenu(true);
        try {
            await axios.post(window.APIROOT + 'api/admin/setMenu', { menus: menu });
            message.success('Changes saved successfully')
        } catch (error) {
            message.error('Failed to save changes');
        }
        setSavingMenu(false);
    }

    useEffect(() => {
        fetchMenu();
    }, []);
    // MENU END

    return (
        <>
            <div className={classes.adminBody}>
                <Card size='small' className={classes.card}>
                    <h1>TIME & COST</h1>
                    <Table loading={!timingRow.length} className={classes.table} columns={timingCol} dataSource={timingRow} pagination={false} bordered />
                    <div className={classes.buttons}>
                        <Button loading={savingTime} className={classes.buy} type='primary' size='large' icon={<SaveOutlined />} onClick={() => setTime()}>Save Changes</Button>
                    </div>
                </Card>
            </div>

            <motion.div layout className={classes.adminBody}>
                {menu.length ? <Card size='small' className={classes.card}>
                    <h1>MENU</h1>
                    {WeekMenu(menu, setMenu)}
                    <div className={classes.buttons}>
                        <Button loading={savingMenu} className={classes.buy} type='primary' size='large' icon={<SaveOutlined />} onClick={() => saveMenu()}>Save Changes</Button>
                    </div>
                </Card> : null}
            </motion.div>
        </>
    );
}