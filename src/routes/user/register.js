import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import queryString from 'query-string';
import { List, InputItem, WingBlank, Button, Flex, Toast, Modal, WhiteSpace } from 'antd-mobile';
import { setTimeout } from 'timers';
import { createForm } from 'rc-form';
import Hammer from 'react-hammerjs';
import shortid from 'shortid';
import Btn from '../../components/Btn';
import { config, Func } from '../../utils';
import './index.scss';
import '../../assets/font/iconfont.css';


const { getQueryString } = Func;
const { alert } = Modal;
if (sessionStorage.getItem('_token') !== null) {
    if (getQueryString('returl')) {
        window.location.replace(getQueryString('returl'));
    } else {
        window.location.replace('/#/user?type=user');
    }
}
const { phoneReg, passwordReg, codeReg } = config.reg;
const { countdownTime, pcHost } = config;
class Myform extends Component {
    constructor(props) {
        super(props);
        this.state = {
            phone: null,
            phonehasError: true,
            password: null,
            passwordhasError: true,
            code: null,
            codehasError: true,
            // phone: 13538831277,
            // phonehasError: false,
            // password: 123456,
            // passwordhasError: false,
            // code: 1234,
            // codehasError: false,

            times: 0,
        };
        this.dispatch = this.props.dispatch;
    }
    componentWillMount() {
        // 自动跳转致pc
        if (!(navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
            window.location.href = `${pcHost}/reg`;
        }
    }
    componentDidMount() {
        Func.changeTitle('数字财经 - 用户注册');
    }
    componentWillUnmount() {
        Func.changeTitle('');
    }
    /**
     * @description 提交注册
     */
    onSubmit = () => {
        this.dispatch({
            type: 'user/reg',
            payload: {
                phone: this.state.phone,
                password: this.state.password,
                code: this.state.code,
                rid: getQueryString('rid'),
            },
        }).then((data) => {
            if (data.success) {
                alert('注册成功', '前往登录？', [
                    { text: '取消', onPress: () => console.log('取消') },
                    { text: '确定', onPress: () => this.dispatch(routerRedux.push('/login?type=user')) },
                ]);
            }
        });
    }


    onErrorClick = (msg) => {
        Toast.info(msg);
    }
    /**
     * @description 获取验证码
     */
    getCode = () => {
        this.dispatch({
            type: 'user/reg',
            payload: {
                phone: this.state.phone,
                password: '',
                code: '',
            },
        }).then((data) => {
            if (data.success) {
                Toast.info('验证码获取成功');
                this.countdown(countdownTime);
            }
        });
    }
    /**
     * @description 倒计时
     */
    countdown = (t) => {
        if (t === 0) return false;
        setTimeout(() => {
            this.setState({
                times: --t,
            });
            this.countdown(t);
        }, 1000);
    }

    handlePhoneChange = (v) => {
        let phonehasErrorVal;
        if (v && phoneReg.test(v)) { // 校验规则
            phonehasErrorVal = false;
        } else {
            phonehasErrorVal = true;
        }
        this.setState({
            phone: v,
            phonehasError: phonehasErrorVal,
        });
    }

    handlePasswordChange = (v) => {
        let passwordhasErrorVal;
        if (v && passwordReg.test(v)) { // 校验规则
            passwordhasErrorVal = false;
        } else {
            passwordhasErrorVal = true;
        }
        this.setState({
            password: v,
            passwordhasError: passwordhasErrorVal,
        });
    }

    handleCodeChange = (v) => {
        let codehasErrorVal;
        if (v && codeReg.test(v)) { // 校验规则
            codehasErrorVal = false;
        } else {
            codehasErrorVal = true;
        }
        this.setState({
            code: v,
            codehasError: codehasErrorVal,
        });
    }

    // validatephone = (rule, value, callback) => {
    //     if (value && phoneReg.test(val)) { // 校验规则
    //         callback();
    //     } else {
    //         callback(new Error('手机号码不正确'));
    //     }
    // }

    // validatepassword = (rule, value, callback) => {
    //     if (value && passwordReg.test(val)) { // 校验规则
    //         callback();
    //     } else {
    //         callback(new Error('请输入6-20位的密码'));
    //     }
    // }

    // validatecode = (rule, value, callback) => {
    //     if (value && codeReg.test(val)) { // 校验规则
    //         callback();
    //     } else {
    //         callback(new Error('请输入验证码'));
    //     }
    // }

    goPage = (url) => {
        this.dispatch(routerRedux.push(url));
    }
    render() {
        const { location } = this.props;
        const pathName = this.props.location.pathname;
        const query = queryString.parse(this.props.location.search);
        const { getFieldProps, getFieldError } = this.props.form;
        let ctrBtn = null;
        if (!this.state.phonehasError && !this.state.passwordhasError && !this.state.codehasError) {
            ctrBtn = <Button className="mt20" type="primary" onClick={() => { this.onSubmit(); }} >注册</Button>;
        } else {
            ctrBtn = <Button className="mt20" type="primary" disabled >注册</Button>;
        }
        let getCodeBtn = null;
        if (!this.state.phonehasError && !this.state.times) {
            getCodeBtn = <Button className="getCodeBtnAct" onClick={() => { this.getCode(); }}>获取验证码</Button>;
        } else if (!!this.state.times) {
            getCodeBtn = <Button className="getCodeBtnAct">{this.state.times}s</Button>;
        } else {
            getCodeBtn = <Button className="getCodeBtn" disabled>获取验证码</Button>;
        }
        return (
            <form className="userWp">
                <div className="myForm">
                    <List
                        renderHeader={() => '注册'}
                    >
                        <InputItem
                            {...getFieldProps('phone')}
                            clear
                            value={this.state.phone}
                            error={this.state.phonehasError}
                            onErrorClick={() => (this.onErrorClick('请输入手机号'))}
                            placeholder="手机号码"
                            onChange={(v) => { this.handlePhoneChange(v); }}
                        >
                            <i className="iconfont">&#xe65a;</i>
                        </InputItem>
                        <InputItem
                            {...getFieldProps('password')}
                            clear
                            value={this.state.password}
                            error={this.state.passwordhasError}
                            onErrorClick={() => (this.onErrorClick('请设置密码'))}
                            onChange={(v) => { this.handlePasswordChange(v); }}
                            placeholder="密码"
                            type="passWord"
                        >
                            <i className="iconfont">&#xe622;</i>
                        </InputItem>
                        <Flex>
                            <div style={{ width: '70%' }}>
                                <InputItem
                                    {...getFieldProps('code')}
                                    clear
                                    value={this.state.code}
                                    error={this.state.codehasError}
                                    onErrorClick={() => (this.onErrorClick('请输入验证码'))}
                                    placeholder="验证码"
                                    onChange={(v) => { this.handleCodeChange(v); }}
                                    type="code"
                                >
                                    <i className="iconfont">&#xe622;</i>
                                </InputItem>
                            </div>
                            <div style={{ width: '30%' }}>
                                {getCodeBtn}
                            </div>
                        </Flex>
                        <WingBlank>
                            {ctrBtn}
                            <WhiteSpace size="xl" />
                            <Hammer
                                onTap={() => {
                                    const url = '/login?type=user';
                                    this.goPage(url);
                                }}
                                key={shortid.generate()}
                            >
                                <div><Btn type="default">已有账号？立即<b>登录</b></Btn></div>
                            </Hammer>
                        </WingBlank>
                    </List>
                </div>
            </form>
        );
    }
}


Myform.propTypes = {
};

function mapStateToProps(state) {
    return {
        regData: state.user.reg,
    };
}

export default connect(mapStateToProps)(createForm()(Myform));
