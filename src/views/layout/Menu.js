import { Menu } from 'antd';
import React from 'react';
import routes from './route';
import { Link, useLocation } from 'react-router-dom';

const items = [...routes];
function convertMultiToSingle(arr, prevBaseUrl = '') {
    arr.forEach((v, i) => {
        if (v.children?.length) {
            arr[i] = {
                ...arr[i],
                key: prevBaseUrl + v.url,
                icon: <v.icon />,
                label: <Link className="text-d-none" to={(prevBaseUrl + v.url)}>{v.title}</Link>
            }
            convertMultiToSingle(v.children, prevBaseUrl + v.url);
        } else {
            arr[i] = {
                ...v,
                key: prevBaseUrl + v.url,
                icon: <v.icon />,
                label: <Link className="text-d-none" to={(prevBaseUrl + v.url)} >{v.title}</Link>,
            }
        }
    })
}
convertMultiToSingle(items);

const App = () => {
    const paths = [];
    useLocation().pathname.split('/')?.reduce((prev, cur) => {
        return prev + '/' + cur;
    });



    return (
        <Menu
            defaultSelectedKeys={[paths.pop()]}
            defaultOpenKeys={[...paths]}
            mode="inline"
            // theme="dark"
            items={items}
            style={{ height: 'calc(100vh - 64px)', overflowX: 'hidden', overflowY: 'auto' }}
        />
    );
};

export default App;