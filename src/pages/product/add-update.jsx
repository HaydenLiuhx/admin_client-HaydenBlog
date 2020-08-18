import React, { Component } from 'react'
import { Card, Form, Input, Cascader, Button, Icon } from 'antd'
import LinkButton from '../../components/link-button'
import { reqCategorys } from '../../api'
import PicturesWall from './pictures-wall'
import RichTextEditor from  './rich-text-editor'
const { Item } = Form
const { TextArea } = Input;


class ProductAddUpdate extends Component {

    state = {
        options: []
    }

    constructor(props) {
        super(props)
        //创建用来保存ref标识的标签对象的容器
        this.pw = React.createRef()
        this.editor = React.createRef()
    }



    initOptions = async (categorys) => {
        // 根据categorys生成option数组, 更新option状态
        const options = categorys.map(c => ({
            value: c._id,
            label: c.name,
            isLeaf: false, //判断
        }))

        //如果是一个二级分类商品的更新
        const { isUpdate, product } = this
        const { pCategoryId } = product
        if (isUpdate && pCategoryId !== '0') {
            //获取对应的二级分类列表
            const subCategorys = await this.getCategorys(pCategoryId)
            //生成二级下拉列表的Options
            const childOptions = subCategorys.map(c => ({
                value: c._id,
                label: c.name,
                isLeaf: true, //判断
            }))
            //找到商品对应的一级Option对象
            const targetOption = options.find(option => option.value === pCategoryId)
            //关联对应的一级option上
            targetOption.children = childOptions
        }

        this.setState({
            //options: [...options]
            options
        })
    }

    /* 
    获取一级和二级分类列表
    async函数的返回值是一个新的Promise对象, 
    promise的结果和值由Async函数结果来决定
    */
    getCategorys = async (parentId) => {
        const result = await reqCategorys(parentId) //{status: 0, data: categorys}
        if (result.status === 0) {
            const categorys = result.data
            //如果是一级分类列表
            if (parentId === '0') {
                this.initOptions(categorys)
            } else { //二级列表
                return categorys //返回二级列表 -> 当前Async函数返回的Promise成功
            }
        }
    }

    /* 用于加载下一级列表的回调函数 */
    loadData = async (selectedOptions) => {
        //const targetOption = selectedOptions[selectedOptions.length - 1];
        //得到选择的Option对象
        const targetOption = selectedOptions[0];
        //显示Loading
        targetOption.loading = true;
        //根据请求的分类,请求获取下一级分类列表
        const subCategorys = await this.getCategorys(targetOption.value)
        //隐藏loading
        targetOption.loading = false
        //二级分类数组有数据
        if (subCategorys && subCategorys.length > 0) {
            //生成一个二级列表的Options
            const childOptions = subCategorys.map(c => ({
                value: c._id,
                label: c.name,
                isLeaf: true, //判断
            }))
            //关联到当前的Option上
            targetOption.children = childOptions
        } else { //当前选中的分类没有二级分类
            targetOption.isLeaf = true
        }
        //更新Option状态
        this.setState({
            options: [...this.state.options]
        })
    };

    validatePrice = (rule, value, callback) => {
        if (value * 1 > 0) {
            callback() //验证通过
        } else {
            callback("价格必须大于0")
        }
    }

    submit = () => {
        // 进行表单验证. 如果通过了,才发送请求
        this.props.form.validateFields((err, val) => {
            if (!err) {
                const imgs = this.pw.current.getImgs()
                const detail = this.editor.current.getDetail()
                console.log("imgs",imgs, "->detail", detail)
                alert('提交')
            }
        })
    }

    componentDidMount() {
        this.getCategorys('0')
    }

    //第一次render之前会执行一次
    UNSAFE_componentWillMount() {
        const product = this.props.location.state
        //强制转化bool类型,保存是否更新的标识
        this.isUpdate = !!product
        this.product = product || {}
        console.log(this.product)
    }

    render() {
        //指定Item布局的配置对象
        const { isUpdate, product } = this
        const { pCategoryId, categoryId, imgs, detail } = product
        //用来接收集联分类ID的数组
        const categoryIds = []
        if (isUpdate) {
            //商品是一个一级分类的商品
            if (pCategoryId === '0') {
                categoryIds.push(categoryId)
            } else {
                //商品是一个二级分类的商品
                categoryIds.push(pCategoryId)
                categoryIds.push(categoryId)
            }
        }
        const formItemLayout = {
            labelCol: { span: 2 }, //左侧Label的宽度
            wrapperCol: { span: 8 }, //指定右侧包裹的宽度
        };

        const title = (
            <span>
                <LinkButton onClick={() => this.props.history.goBack()}>
                    <Icon type="arrow-left" style={{ fontSize: 20 }}></Icon>
                </LinkButton>
                <span>{isUpdate ? '修改商品' : '添加商品'}</span>
            </span>
        )

        const { getFieldDecorator } = this.props.form

        return (
            <Card title={title}>
                <Form {...formItemLayout}>
                    <Item label="商品名称">
                        {
                            getFieldDecorator('name', {
                                initialValue: product.name,
                                rules: [
                                    { required: true, message: '必须输入商品名称' }
                                ]
                            })(<Input placeholder="请输入商品名称"></Input>)
                        }
                    </Item>
                    <Item label="商品描述">
                        {
                            getFieldDecorator('desc', {
                                initialValue: product.desc,
                                rules: [
                                    { required: true, message: '必须输入商品描述' }
                                ]
                            })(<TextArea
                                placeholder="Autosize height based on content lines"
                                autoSize={{ minRows: 2, maxRows: 6 }} />)
                        }
                    </Item>
                    <Item label="商品价格">
                        {
                            getFieldDecorator('price', {
                                initialValue: product.price,
                                rules: [
                                    { required: true, message: '必须输入商品名称' },
                                    { validator: this.validatePrice }
                                ],
                            })(<Input
                                type="number"
                                placeholder="请输入商品价格"
                                addonAfter="AUD"
                            ></Input>)
                        }
                    </Item>
                    <Item label="商品分类">
                        {
                            getFieldDecorator('categoryIds', {
                                initialValue: categoryIds,
                                rules: [
                                    { required: true, message: '必须指定商品的分类' }
                                ]
                            })
                                (<Cascader
                                    placeholder='请指定商品分类'
                                    options={this.state.options} /* 需要显示的列表数据 */
                                    loadData={this.loadData} /* 当选择某个列表项, 加载下一级列表的监听回调*/
                                //onChange={this.onChange}
                                //changeOnSelect
                                />)
                        }
                    </Item>
                    <Item label="商品图片">
                        <PicturesWall ref={this.pw} imgs={imgs}/>
                    </Item>
                    <Item label="商品详情" labelCol={{ span: 2 }} wrapperCol={{ span: 20 }}>
                        <RichTextEditor ref={this.editor} detail={detail}/>
                    </Item>
                    <Item >
                        <Button type='primary' onClick={this.submit}>提交</Button>
                    </Item>
                </Form>
            </Card>
        )
    }
}

//让我们的组件能看到小写的form对象
export default Form.create()(ProductAddUpdate)

/*
1. 子组件调用父组件的方法: 将父组件的方法以函数属性的形式传递给子组件
2. 父组件调用子组件的方法: 在父组件中通过ref得到子组件标签对象(也就是组件对象),调用其方法
*/
