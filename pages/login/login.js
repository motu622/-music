import request from '../../utils/request.js'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        phone: '',
        password: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    // 表单项事件的回调
    handleInput(event) {
        let type = event.currentTarget.id
        this.setData({
            [type]: event.detail.value
        })
    },

    // 登录的回调
    async login() {
        let {
            phone,
            password
        } = this.data
        if (!phone) {
            wx.showToast({
                title: '手机号不能为空',
                icon: 'error'
            })
            return;
        }
        let phoneReg = /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/

        if (!phoneReg.test(phone)) {
            wx.showToast({
                title: '手机号格式错误',
                icon: 'error'
            })
            return;
        }
        if (!password) {
            wx.showToast({
                title: '密码不能为空',
                icon: 'error'
            })
            return;
        }


        // 后端验证
        let result = await request('/login/cellphone', {
            phone,
            password,
            isLogin: true
        })
        if (result.code === 200) {

            wx.showToast({
                title: '登陆成功',
            })
            // 将用户信息存入至本地
            wx.setStorageSync('userInfo', result.profile)

            // 跳转至个人中心
            wx.reLaunch({
                url: '/pages/personal/personal',
            })

        } else if (result.code == 400) {
            wx.showToast({
                title: '手机号错误',
                icon: "error"
            })
        } else if (result.code === 502) {
            wx.showToast({
                title: '密码错误',
                icon: 'error'
            })
        } else {
            wx.showToast({
                title: '登录失败，请重新登录',
                icon: 'none'
            })
        }

    },


    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})