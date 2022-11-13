import classes from './index.module.css';
import { Table, Button, message, Card } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { useState, useEffect, useCallback } from 'react';
import axios from "axios";
import useRazorpay from "react-razorpay";

const dayToNum = { "monday": 0, "tuesday": 1, "wednesday": 2, "thursday": 3, "friday": 4, "saturday": 5, "sunday": 6 };

const columns = [
    {
        title: 'Meal',
        dataIndex: 'meal',
        width: 90,
    },
    {
        title: 'Rs',
        dataIndex: 'cost',
        width: 50,
    },
    {
        title: 'Menu',
        dataIndex: 'menu',
    },
];

async function createOrder(selected) {
    let response = await axios.post(window.APIROOT + 'api/user/createOrder', { selected: selected });
    return response.data;
}

async function CheckOrder(resp, setBought) {
    let response = await axios.post(window.APIROOT + 'api/user/checkOrder', resp);
    if (response.data) {
        message.success("Coupons bought!");
        setBought(true);
    }
    else {
        message.error("Failed to buy coupons!");
    }
}

function PayButton(props) {
    const Razorpay = useRazorpay();
    const handlePayment = useCallback(async () => {
        const order = await createOrder(props.selected);
        const options = {
            key: "rzp_test_LfhDxl3w4SvQr8",
            amount: order.amount.toString(),
            currency: "INR",
            name: "Mess Portal",
            order_id: order.id,
            handler: async (res) => {
                await CheckOrder(res, props.setBought);
            }
        };

        const rzpay = new Razorpay(options);
        rzpay.open();
    }, [Razorpay, props]);

    return (
        <Button disabled={props.disabled || !props.cost} onClick={handlePayment} className={classes.buy} type='primary' size='large' icon={<ShoppingCartOutlined />}>Continue with Payment</Button>
    );
}

export default function BuyPage() {
    const [cost, setCost] = useState(0);
    const [loading, setLoading] = useState(true);
    const [bought, setBought] = useState(false);
    const [menu, setMenu] = useState([
        {
            day: "monday",
            breakfast: { text: "", cost: "" },
            lunch: { text: "", cost: "" },
            dinner: { text: "", cost: "" },
        },
        {
            day: 'tuesday',
            breakfast: { text: "", cost: "" },
            lunch: { text: "", cost: "" },
            dinner: { text: "", cost: "" },
        },
        {
            day: 'wednesday',
            breakfast: { text: "", cost: "" },
            lunch: { text: "", cost: "" },
            dinner: { text: "", cost: "" },
        },
        {
            day: 'thursday',
            breakfast: { text: "", cost: "" },
            lunch: { text: "", cost: "" },
            dinner: { text: "", cost: "" },
        },
        {
            day: 'friday',
            breakfast: { text: "", cost: "" },
            lunch: { text: "", cost: "" },
            dinner: { text: "", cost: "" },
        },
        {
            day: 'saturday',
            breakfast: { text: "", cost: "" },
            lunch: { text: "", cost: "" },
            dinner: { text: "", cost: "" },
        },
        {
            day: 'sunday',
            breakfast: { text: "", cost: "" },
            lunch: { text: "", cost: "" },
            dinner: { text: "", cost: "" },
        }
    ]);
    const [selected, setSelected] = useState(
        {
            monday: { breakfast: false, lunch: false, dinner: false },
            tuesday: { breakfast: false, lunch: false, dinner: false },
            wednesday: { breakfast: false, lunch: false, dinner: false },
            thursday: { breakfast: false, lunch: false, dinner: false },
            friday: { breakfast: false, lunch: false, dinner: false },
            saturday: { breakfast: false, lunch: false, dinner: false },
            sunday: { breakfast: false, lunch: false, dinner: false },
        }
    );

    useEffect(() => {
        let cost = 0;
        for (const [day, val] of Object.entries(selected)) {
            for (const [meal, mealV] of Object.entries(val)) {
                if (mealV)
                    cost += menu[dayToNum[day]][meal].cost;
            }
        }
        setCost(cost);
    }, [menu, selected]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                let response = await axios.get(window.APIROOT + 'api/data/menu');
                let cost = await axios.get(window.APIROOT + 'api/data/time');
                let data = {};
                for (let c of cost.data) data[c.meal] = c.cost;
                for (let i = 0; i < response.data.length; i++) {
                    response.data[i].breakfast = { text: response.data[i].breakfast, cost: data.breakfast }
                    response.data[i].lunch = { text: response.data[i].lunch, cost: data.lunch }
                    response.data[i].dinner = { text: response.data[i].dinner, cost: data.dinner }
                }
                setMenu(response.data);
                setLoading(false);
            } catch (error) {
                console.log(error);
                message.error('Failed to fetch menu from server');
            }
        }
        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                let response = await axios.get(window.APIROOT + 'api/user/boughtNextWeek');
                setBought(response.data);
            } catch (error) {
                message.error('Failed to fetch data from server');
            }
        }
        fetchData();
    }, []);

    return (<>{bought ?
        <div className={classes.bought}>
            <Card
                title="Coupons Bought"
                bordered={false}
                style={{
                    width: 300,
                }}
            >
                You can buy coupons for a week, the week before. You have already bought coupons for the next week.
            </Card>
        </div>
        :
        <div className={classes.buyBody}>
            {
                menu.map(e =>
                    <>
                        <h1>{e.day}</h1>
                        <Table loading={loading} className={classes.table} pagination={false} rowSelection={{
                            type: 'checkbox',
                            onChange: (skeys, srows) => {
                                setSelected({
                                    ...selected,
                                    [e.day]: {
                                        breakfast: skeys.includes('breakfast'),
                                        lunch: skeys.includes('lunch'),
                                        dinner: skeys.includes('dinner'),
                                    }
                                });
                            }
                        }} columns={columns}
                            dataSource={
                                [
                                    {
                                        key: 'breakfast',
                                        meal: 'Breakfast',
                                        menu: e.breakfast.text,
                                        cost: e.breakfast.cost
                                    },
                                    {
                                        key: 'lunch',
                                        meal: 'Lunch',
                                        menu: e.lunch.text,
                                        cost: e.lunch.cost
                                    },
                                    {
                                        key: 'dinner',
                                        meal: 'Dinner',
                                        menu: e.dinner.text,
                                        cost: e.dinner.cost
                                    }
                                ]
                            }
                        />
                    </>
                )
            }
            <h1>Total Cost: ₹{cost}</h1>
            <PayButton selected={selected} disabled={loading} cost={cost} setBought={setBought} />
        </div>
    }</>);
}