import React, {Component} from 'react'
import {
    Card, 
    Button,
    //Icon,
    Table
} from 'antd'
import {PlusOutlined} from '@ant-design/icons';
import LinkButton from '../../components/link-button'
/*
Category路由
*/
export default class Category extends Component {
    render() {

    //card左侧标题
    const title = '一级分类表'
        //card的右侧标题
    const extra = (
        <Button type='primary'>
            <PlusOutlined />
            Add
        </Button>
    )

    const dataSource = [
        {
          key: '1',
          name: '胡彦斌',
          age: 32,
          address: '西湖区湖底公园1号',
        },
        {
          key: '2',
          name: '胡彦祖',
          age: 42,
          address: '西湖区湖底公园1号',
        },
      ];
      
      const columns = [
        {
          title: '姓名',
          dataIndex: 'name' //显示数据对应的属性名
        },
        {
          title: '年龄',
          width:500,
          render: () => ( //返回需要显示的页面标签
              <span>
                  <LinkButton>修改分类</LinkButton>
                  <LinkButton>查看子分类</LinkButton>
              </span>
          )
        },
        
      ];

        return (
            //  eslint-disable-next-line
            <Card title={title} extra={extra}>
                <Table 
                bordered
                //rowKey
                dataSource={dataSource} 
                columns={columns} />
          </Card>
        )
    }
}