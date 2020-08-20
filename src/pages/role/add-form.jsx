import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
    Form,
    //Select,
    Input
} from 'antd'

const Item = Form.Item
/*
    添加分类的form组件
*/
class AddForm extends Component {

    static propTypes = {
        setForm: PropTypes.func.isRequired, //用来传递form对象的函数
    }

    componentWillMount() {
        this.props.setForm(this.props.form)
    }

    render() {
        const { getFieldDecorator } = this.props.form
        const formItemLayout = {
            labelCol: { span: 4 }, //左侧Label的宽度
            wrapperCol: { span: 12 }, //指定右侧包裹的宽度
        };
        return (
            <Form>
                <Item label='角色名称' {...formItemLayout}>
                    {getFieldDecorator('roleName', {
                        initialValue: '',
                        rules: [{required: true, message: '必须输入角色名称'}],
                    })(
                        <Input placeholder='请输入角色名称' />
                    )}

                </Item>
            </Form>
        )
    }
}

export default Form.create()(AddForm)