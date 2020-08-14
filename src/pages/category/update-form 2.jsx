
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
    
    Input
} from 'antd'
import {Form} from '@ant-design/compatible';
import Item from 'antd/lib/list/Item'

//const Option = Select.Option

/*
    更新分类的form组件
*/
class UpdateForm extends Component {
    static propTypes = {
        categoryName: PropTypes.string.isRequired,
        setForm: PropTypes.func.isRequired
    }

    componentWillMount() {
        //将form对象通过setForm方法传递给父组件
        this.props.setForm(this.props.form)
    }

    render() {
        const {categoryName} = this.props
        const { getFieldDecorator } = this.props.form
        return (
            <Form>
                <Item>
                    {
                    getFieldDecorator('categoryName', {
                        initialValue: categoryName,
                        rules:[{required: true, message:"Must Type sth"}],
                    })(
                        <Input placeholder='请输入分类名称' />
                    )}

                </Item>
            </Form>
        )
    }
}

export default UpdateForm = Form.create()(UpdateForm)