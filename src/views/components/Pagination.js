import { Pagination, Tag } from 'antd';
export default function MyPagination(props) {
    const { qData, setQData } = props;

    const handleChange = (page, pp) => {
        if (qData.limit !== pp) {
            setQData({ ...qData, page: 1, limit: pp });
        } else {
            setQData({ ...qData, page: page });
        }
    }

    const showTotal = () => {
        let start = (qData.page - 1) * qData.limit * 1 + 1;
        let end = qData.page * qData.limit;
        return <Tag>{'Showing ' + start + ' - ' + end + ' out of ' + qData.total}</Tag>
    }
    return (
        <>
            {
                qData.total > 0
                    ? <Pagination
                        total={qData.total}
                        showTotal={showTotal}
                        pageSize={qData.limit}
                        current={qData.page}
                        onChange={handleChange}
                        showSizeChanger={true}
                        size="small"
                    />
                    : null
            }
        </>
    );
};
