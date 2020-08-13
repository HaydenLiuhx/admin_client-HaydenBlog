import React, { Component } from 'react'
import { Card, Select, Input, Button, Icon, Table } from 'antd'
import LinkButton from '../../components/link-button'
import { reqProducts } from '../../api'
// eslint-disable-next-line
import { reqSearchProducts } from '../../api'
import { PAGE_SIZE } from '../../utils/constants'
const Option = Select.Option
export default class ProductHome extends Component {

    state = {
        total: 0, //商品的总数量
        products: [], //商品的数组
        loading: false, //是否正在加载中
        searchName: '', //搜索的关键字
        searchType: 'productName', //根据哪个字段搜索
    }

    /*
    初始化table列的数组
    */
    initColumns = () => {
        this.columns = [
            {
                title: '商品名称',
                dataIndex: 'name',
            },
            {
                title: '商品描述',
                dataIndex: 'desc',
            },
            {
                title: '价格',
                dataIndex: 'price',
                render: (price) => {
                    return "$" + price
                }
            },
            {
                width: 100,
                title: '商品状态',
                dataIndex: 'status',
                render: (status) => {
                    return (
                        <span>
                            <Button type='primary'>下架</Button>
                            <span>在售</span>
                        </span>
                    )
                }
            },
            {
                width: 100,
                title: '操作',
                render: (product) => {
                    return (
                        <span>
                            <LinkButton>详情</LinkButton>
                            <LinkButton>修改</LinkButton>
                        </span>
                    )
                }
            },
        ]
    }

    /* 
    获取指定页码的列表数据显示 
    */
    getProducts = async (pageNum) => {
        this.setState({ loading: true }) //显示loading

        const {searchName, searchType} = this.state
        //如果搜索关键字有值,说明我们进行搜索分页
        let result //结果是统一处理的
        
        if (searchName){
             result = await reqSearchProducts(pageNum,PAGE_SIZE,searchName,searchType)
        } else { //一般分页
             result = await reqProducts(pageNum, PAGE_SIZE)
        }
        this.setState({ loading: false }) //隐藏loading
        if (result.status === 0) {
            // 取出分页数据,更新状态,显示分页列表
            const { total, list } = result.data
            this.setState({
                total,
                products: list
            })
        }
    }

    UNSAFE_componentWillMount() {
        this.initColumns()
    }

    componentDidMount() {
        this.getProducts(1)
    }

    render() {

        //取出状态数据
        const { products, total, loading, searchType, searchName } = this.state

        const title = (
            <span>
                <Select 
                    value={searchType} 
                    style={{ width: 150 }}
                    onChange={value => this.setState({ searchType: value })}
                >
                    <Option value='productName'>按名称搜索</Option>
                    <Option value='productDesc'>按描述搜索</Option>
                </Select>
                <Input 
                    placeholder='关键字' 
                    style={{ width: 150, margin: '0 15px' }}
                    value={searchName}
                    onChange={event => this.setState({ searchName: event.target.value })}
                />
                <Button type='primary' onClick={() => this.getProducts(1)}>搜索</Button>
            </span>
        )

        const extra = (
            <Button type="primary">
                <Icon type='plus'></Icon>
                添加商品
            </Button>
        )

        return (
            <Card title={title} extra={extra}>
                <Table
                    bordered
                    loading={loading}
                    rowKey='_id'
                    dataSource={products}
                    columns={this.columns}
                    pagination={{
                        total,
                        defaultPageSize: PAGE_SIZE,
                        showQuickJumper: true,
                        onChange: this.getProducts
                        //(pageNum) => {this.getProducts(pageNum)}
                    }}
                ></Table>
            </Card>
        )
    }
}