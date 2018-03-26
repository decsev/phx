import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import queryString from 'query-string';
import { List, InputItem, WingBlank, Button } from 'antd-mobile';
import { createForm } from 'rc-form';
import './index.scss';
import '../../assets/font/iconfont.css';

class Myform extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
        this.dispatch = this.props.dispatch;
    }
    onSubmit = () => {
        this.props.form.validateFields({ force: true }, (error) => {
            if (!error) { // ajax
                console.log(this.props.form.getFieldsValue());
            } else {
                alert('校验失败。');
            }
        });
    }
    goPage = (url) => {
        this.dispatch(routerRedux.push(url));
    }
    validateuserName = (rule, value, callback) => {
        if (value && value.length > 4) { // 校验规则
            callback();
        } else {
            callback(new Error('手机号码必须4个字符以上'));
        }
    }
    render() {
        const { location } = this.props;
        const pathName = this.props.location.pathname;
        const query = queryString.parse(this.props.location.search);
        const { getFieldProps, getFieldError } = this.props.form;

        return (
            <form>
                <div className="myForm">
                    <List
                        renderHeader={() => '注册'}
                        renderFooter={() => getFieldError('userName') && getFieldError('userName').join(',')}
                    >
                        <InputItem
                            {...getFieldProps('userName', {
                                // initialValue: 'little ant',
                                rules: [
                                    { required: true, message: '手机号码' },
                                    { validator: this.validateuserName },
                                ],
                            })}
                            clear
                            error={!!getFieldError('userName')}
                            onErrorClick={() => {
                                alert(getFieldError('userName').join('、'));
                            }}
                            placeholder="手机号码"
                        >
                            <i className="iconfont">&#xe65a;</i>
                        </InputItem>
                        <InputItem {...getFieldProps('code')} placeholder="手机验证码" type="code">
                            <i className="iconfont">&#xe622;</i>
                        </InputItem>
                        <InputItem {...getFieldProps('passWord')} placeholder="密码" type="passWord">
                            <i className="iconfont">&#xe622;</i>
                        </InputItem>
                        <WingBlank>
                            <Button
                                className="mt20"
                                type="primary"
                                onClick={() => {
                                    this.onSubmit();
                                }}
                            >
                              注册
                            </Button>
                            <Button
                                className="mt20"
                                onClick={() => {
                                    const url = '/login?type=user';
                                    this.goPage(url);
                                }}
                            >
                              已有账号？立即登录
                            </Button>
                        </WingBlank>
                    </List>
                </div>
            </form>
        );
    }
}


Myform.propTypes = {
};

function mapStateToProps(state, ownProps) {
    return {
        name: '王思聪',
    };
}
export default connect(mapStateToProps)(createForm()(Myform));
