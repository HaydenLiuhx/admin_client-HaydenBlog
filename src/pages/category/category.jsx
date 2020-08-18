import React, { Component } from 'react'
import {
  Card,
  Button,
  Table,
  message,
  Modal,
  Icon
} from 'antd'
//import { PlusOutlined, ArrowRightOutlined } from '@ant-design/icons';
import LinkButton from '../../components/link-button';
// eslint-disable-next-line
import { reqCategorys, reqAddCategory, reqUpdateCategory } from '../../api'
import AddForm from './add-form'
import UpdateForm from './update-form'

/*
Category路由
*/
export default class Category extends Component {

  state = {
    loading: false, //是否正在获取数据中
    categorys: [], //一级分类列表
    parentId: '0', //当前需要显示的分类列表的parentId
    parentName: '',
    subCategorys: [], //二级分类列表
    showStatus: 0, //标识添加/更新的确认框是否显示, 0: 都不显示 1:显示添加 2:显示更新

  }

  /*
  初始化所有列
  */
  initColumns = () => {
    this.columns = [
      {
        title: '名字',
        dataIndex: 'name' //显示数据对应的属性名
      },
      {
        title: '操作',
        width: 500,
        render: (category) => ( //返回需要显示的页面标签
          <span>
            <LinkButton onClick={() => this.showUpdate(category)}>修改分类</LinkButton>
            {/* 向事件回调函数传递参数 - 先定义一个匿名函数,在函数调用处理的函数,并传递数据 */}
            {this.state.parentId === '0' ? <LinkButton onClick={() => { this.showSubCategorys(category) }}>查看子分类</LinkButton> : null}
          </span>
        )
      },
    ];
  }

  /*
  初始化所有列, 异步发请求,获得一级和二级列表
   parentId: 如果没有指定根据状态中的parentId请求,
   如果指定了,根据指定的请求
  */
  getCategorys = async (parentId) => {
    //再发请求之前,显示loading,之后隐藏loading
    this.setState({ loading: true })
    parentId = parentId || this.state.parentId //如果没有值,根据状态里的parentId
    // 发异步ajax请求获取数据
    const result = await reqCategorys(parentId)
    //隐藏loading
    this.setState({ loading: false })
    if (result.status === 0) {
      //取出分类数组数据(可能是一级也可能是二级)
      const categorys = result.data
      if (parentId === '0') {
        //更新一级分类数组状态
        this.setState({
          categorys: categorys
        })
      }
      else {
        this.setState({
          subCategorys: categorys
        })
      }
    }
    else {
      message.error('获取分类列表失败')
    }
  }
  /*
    显示一级分类对象的二级子列表
    */
  showSubCategorys = (category) => {
    //先更新状态
    this.setState({
      parentId: category._id,
      parentName: category.name
    }, () => { //在状态更新后,重新redner()后执行
      //获取二级分类列表显示
      console.log('parentId', this.state.parentId)
      this.getCategorys()
    })
    //setState()后,不能立即获取最新的状态,因为setState是异步更新状态的
  }

  //显示一级分类列表,更新为显示一级列表的状态
  showCategorys = () => {
    this.setState({
      parentId: '0',
      parentName: '',
      subCategorys: []
    })
  }

  /*
  响应:隐藏确认框
  */
  handleCancel = () => {
    //清除输入数据
    this.form.resetFields()
    this.setState({
      showStatus: 0
    })
  }

  /*
  显示添加的确认框
  */
  showAdd = () => {
    this.setState({
      showStatus: 1
    })
  }

  /*
   添加分类
   */
  addCategory = () => {
    this.form.validateFields(async (err, values) => {
      if (!err) {
        console.log()
        //隐藏确认框
        this.setState({
          showStatus: 0
        })
        //收集数据,并提交添加分类的请求
        const { parentId, categoryName } = values
        //清除输入数据
        this.form.resetFields()
        const result = await reqAddCategory(categoryName, parentId)
        if (result.status === 0) {
          //重新获取分类列表显示
          if (parentId === this.state.parentId) {
            //添加的分类就是当前的分类
            this.getCategorys()
          }
          else if (parentId === '0') { //在二级分类列表下添加一级分类项,重新获取一级分类列表,但不需要显示
            //   this.setState({parentId: '0'}, () => {
            //     this.getCategorys()
            // })
            this.getCategorys('0')
          }
        }
      }

    })

  }

  /*
  显示修改的确认框
  */
  showUpdate = (category) => {
    //保存分类对象
    this.category = category
    this.setState({
      showStatus: 2
    })
  }

  /*
  更新分类
  */
  updateCategory = () => {
    //1-隐藏确认框
    this.form.validateFields(async (err, values) => {
      if (!err) {
        this.setState({
          showStatus: 0
        })
        //准备数据
        const categoryId = this.category._id
        const {categoryName} = values
        //const categoryName = this.form.getFieldValue('categoryName')
        //清除输入数据
        this.form.resetFields()
        //2-发请求保存更新分类
        const result = await reqUpdateCategory(categoryId, categoryName)
        if (result.status === 0) {
          //3-重新显示列表
          console.log(result)
          this.getCategorys()
        }
      }
    })

  }
  
  //为第一次render准备数据
  componentWillMount() {
    this.initColumns()
  }

  //发异步ajax请求,执行异步任务
  componentDidMount() {
    //获取一级分类列表
    this.getCategorys()
  }

  render() {

    //读取状态数据
    const { categorys, loading, subCategorys, parentId, parentName, showStatus } = this.state
    //读取指定的分类
    const category = this.category || {} //如果还没有,指定一个空对象

    //card左侧标题
    const title = parentId === '0' ? '一级分类表' : (
      <span>
        <LinkButton onClick={this.showCategorys}>一级分类列表</LinkButton>
        <Icon type="arrow-right" style={{ marginRight: 5 }} />
        <span>{parentName}</span>
      </span>
    )
    //card的右侧标题
    const extra = (
      <Button type='primary' onClick={this.showAdd}>
        <Icon type="plus" />
            Add
      </Button>
    )

    return (
      //  eslint-disable-next-line
      <Card title={title} extra={extra}>
        <Table
          bordered
          rowKey='_id'
          dataSource={parentId === '0' ? categorys : subCategorys}
          columns={this.columns}
          loading={loading}
          pagination={{
            defaultPageSize: 5,
            showQuickJumper: true
          }}
        />

        <Modal
          title="添加分类"
          visible={showStatus === 1}
          onOk={this.addCategory}
          onCancel={this.handleCancel}
        >
          <AddForm
            categorys={categorys}
            parentId={parentId}
            setForm={(form) => { this.form = form }}
          />

        </Modal>

        <Modal
          title="更新分类"
          visible={showStatus === 2}
          onOk={this.updateCategory}
          onCancel={this.handleCancel}
        >
          <UpdateForm
            categoryName={category.name}
            setForm={(form) => { this.form = form }} />
        </Modal>
      </Card>
    )
  }
}