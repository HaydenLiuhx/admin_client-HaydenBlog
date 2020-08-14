import React, {Component} from 'react'
import {Card, Icon, List} from 'antd'
import {BASE_IMG_URL} from '../../utils/constants'
import LinkButton from '../../components/link-button'
import {reqCategory} from '../../api'
const Item = List.Item
/* 
Product的详情子路由组件
*/
export default class ProductDetail extends Component {

    state = {
        cName1: '',//一级分类
        cName2: '',//二级分类
    }

    async componentDidMount() {
        //一级分类商品,父ID为0
        const {categoryId, pCategoryId} = this.props.location.state.product
        if(pCategoryId==='0'){ //一级分类
            const result = await reqCategory(categoryId)
            const cName1 = result.data.name
            this.setState({cName1})
        } else { //二级分类
            //通过多个await发送多个请求: 后面的请求是在前一个请求成功返回之后才发送
            // const result1 = await reqCategory(pCategoryId)
            // const result2 = await reqCategory(categoryId)
            // const cName1 = result1.data.name
            // const cName2 = result2.data.name

            //一次性发送多个请求,只有都成功,才正常处理
            const results = await Promise.all([reqCategory(pCategoryId), reqCategory(categoryId)])
            const cName1 = results[0].data.name
            const cName2 = results[1].data.name
            this.setState({
                cName1,
                cName2
            })
        }
    }

    render() {

        const {name, desc, price, detail, imgs} = this.props.location.state.product
        const {cName1, cName2} = this.state
        const title = (
            <span>
                <LinkButton>
                <Icon 
                type="arrow-left" 
                style={{color: 'green', marginRight: 15, fontSize: 20}} 
                onClick={() => this.props.history.goBack()}
                ></Icon>
                </LinkButton>
                <span>商品详情</span>
            </span>
        )
        return (
            <Card title={title} className="product-detail">
                <List>
                    <Item>
                        <span className="left">商品名称:</span>
                        <span className="word">{name}</span>
                    </Item>
                    <Item>
                        <span className="left">商品描述:</span>
                        <span className="word" style={{width:600}}>{desc}</span>
                    </Item>
                    <Item>
                        <span className="left">商品价格:</span>
                        <span className="word">${price}</span>
                    </Item>
                    <Item>
                        <span className="left">所属分类:</span>
                        <span className="word">{cName1} {cName2 ? '-->'+ cName2 : ''}</span>
                    </Item>
                    <Item>
                        <span className="left">商品图片:</span>
                        <span className="img">
                            {/* <img
                            className="product-img" 
                            src="https://images-na.ssl-images-amazon.com/images/I/81f1sNBXtOL._AC_SX679_.jpg" 
                            alt=""
                            ></img>
                            <img
                            className="product-img"  
                            src="https://images-na.ssl-images-amazon.com/images/I/71JF8H6rCxL._AC_SX679_.jpg" 
                            alt=""
                            ></img> */}
                            {
                                imgs.map(img => (
                                    <img key={img} className="product-img" src={BASE_IMG_URL + img} alt="img" />
                                ) )
                            }
                        </span>
                    </Item>
                    <Item>
                        <span className="left">商品详情:</span>
                        <span className="word" dangerouslySetInnerHTML={{__html:detail}}></span>
                    </Item>
                </List>
            </Card>
        )
    }
}