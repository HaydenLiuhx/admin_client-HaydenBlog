import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import {
    Form,
    Select,
    Input
} from 'antd'
const Option = Select.Option
const Item = Form.Item
/*
    添加用户和修改用户的form组件
*/
class UserForm extends PureComponent {

    static propTypes = {
        setForm: PropTypes.func.isRequired, //用来传递form对象的函数
        roles: PropTypes.array.isRequired, //传递roles
        user: PropTypes.object //可能为undefined
    }

    componentWillMount() {
        this.props.setForm(this.props.form)
    }

    render() {
        const {roles} = this.props
        const user = this.props.user || {} //如果没值是空对象
        const { getFieldDecorator } = this.props.form
        const formItemLayout = {
            labelCol: { span: 4 }, //左侧Label的宽度
            wrapperCol: { span: 12 }, //指定右侧包裹的宽度
        };
        return (
            <Form {...formItemLayout}>
                <Item label='用户名' >
                    {getFieldDecorator('username', {
                        initialValue: user.username,
                        //rules: [{required: true, message: '必须输入角色名称'}],
                    })(
                        <Input placeholder='请输入用户名' />
                    )}
                </Item>
                {
                    user._id ? null : (
                        <Item label='密码'>
                    {getFieldDecorator('password', {
                        initialValue: user.password,
                    })(
                        <Input type="password" placeholder='请输入密码' />
                    )}
                </Item>
                    )
                }
                <Item label='手机号'>
                    {getFieldDecorator('phone', {
                        initialValue: user.phone,
                    })(
                        <Input placeholder='请输入手机号' />
                    )}
                </Item>
                <Item label='邮箱'>
                    {getFieldDecorator('email', {
                        initialValue: user.email,
                    })(
                        <Input placeholder='请输入邮箱' />
                    )}
                </Item>
                <Item label='角色'>
                    {getFieldDecorator('role_id', {
                        initialValue: user.role_id,
                    })(
                        <Select>
                            {
                                roles.map(
                                    role => <Option key={role._id} value={role._id}>{role.name}</Option>)
                            }
                        </Select>
                    )}
                </Item>
            </Form>
        )
    }
}

export default Form.create()(UserForm)