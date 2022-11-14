import classes from './index.module.css';
import { Table } from 'antd';

// menu: the menu object
// mobile: display menu as 7 individual tables for better mobile usability when true
// highlight: when true, it looks for cells to be highlighted in the menu object for purchase history page
// loading: plays a loading spinner when true
export default function WeekMenu(props) {
    const menu = props.menu;
    const mobile = props.mobile;
    const highlight = props.highlight;
    const loading = props.loading;

    if (mobile) {
        return menu.map(e =>
            <Table loading={loading} className={classes.table}
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
                                props: highlight ? {
                                    style: { background: record.selected ? "#ceface" : "unset", color: record.selected ? "unset" : "lightgrey" },
                                } : {},
                                children: <span>{text}</span>,
                            })
                        },
                    ]
                }
                dataSource={
                    [
                        {
                            key: '1',
                            Type: 'Breakfast',
                            Meal: highlight ? e.breakfast.text : e.breakfast,
                            selected: e.breakfast.selected
                        },
                        {
                            key: '2',
                            Type: 'Lunch',
                            Meal: highlight ? e.lunch.text : e.lunch,
                            selected: e.lunch.selected
                        },
                        {
                            key: '3',
                            Type: 'Dinner',
                            Meal: highlight ? e.dinner.text : e.dinner,
                            selected: e.dinner.selected
                        },
                    ]
                }
                pagination={false} bordered />
        );
    }
    else {
        return (<Table loading={loading} className={classes.table}
            columns={
                [
                    {
                        title: 'Day',
                        dataIndex: 'day',
                        key: 'day',
                        render: (text) => ({
                            props: {
                                style: { background: "#FAFAFA" },
                            },
                            children: <span style={{ fontWeight: 500, textTransform: "capitalize" }}>{text}</span>,
                        })
                    },
                    {
                        title: 'Breakfast',
                        dataIndex: 'breakfast',
                        key: 'breakfast',
                        render: (text, record) => ({
                            props: highlight ? {
                                style: { background: record.selected.breakfast ? "#ceface" : "unset", color: record.selected.breakfast ? "unset" : "lightgrey" },
                            } : {},
                            children: <span>{text}</span>,
                        })
                    },
                    {
                        title: 'Lunch',
                        dataIndex: 'lunch',
                        key: 'lunch',
                        render: (text, record) => ({
                            props: highlight ? {
                                style: { background: record.selected.lunch ? "#ceface" : "unset", color: record.selected.lunch ? "unset" : "lightgrey" },
                            } : {},
                            children: <span>{text}</span>,
                        })
                    },
                    {
                        title: 'Dinner',
                        dataIndex: 'dinner',
                        key: 'dinner',
                        render: (text, record) => ({
                            props: highlight ? {
                                style: { background: record.selected.dinner ? "#ceface" : "unset", color: record.selected.dinner ? "unset" : "lightgrey" },
                            } : {},
                            children: <span>{text}</span>,
                        })
                    },
                ]
            }
            dataSource={
                menu.map((e, i) => {
                    return {
                        key: i,
                        day: e.day,
                        breakfast: highlight ? e.breakfast.text : e.breakfast,
                        lunch: highlight ? e.lunch.text : e.lunch,
                        dinner: highlight ? e.dinner.text : e.dinner,
                        selected: {
                            breakfast: e.breakfast.selected,
                            lunch: e.lunch.selected,
                            dinner: e.dinner.selected
                        },
                    };
                })
            }
            pagination={false} bordered />);
    }
}