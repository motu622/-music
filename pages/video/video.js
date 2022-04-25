import request from '../../utils/request'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        videoGroupList: [], //
        navId: '',
        videoList: [], //视频列表数据
        videoId: '', //video标识
        videoUpdataTime: [], //记录实时播放的时长
        isTriggered: false, //标识下拉刷新是否被触发
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getVideoGroupList()
    },

    // 获取导航标签数据的功能函数
    async getVideoGroupList() {
        let result = await request('/video/group/list')
        if (result.code === 200) {
            this.setData({
                videoGroupList: result.data.slice(0, 14),
                navId: result.data[0].id
            })
        }
        this.getVideoList(this.data.navId)
    },
    // 获取视频数据列表的数据
    async getVideoList(navId) {
        let videoListData = await request('/video/group', {
            id: navId
        })
        if (!videoListData.datas) {
            return
        }
        let index = 0

        let videoList = videoListData.datas.map(item => {
            item.id = index++;
            return item
        })
        this.setData({
            videoList,
            isTriggered: false
        })
        wx.hideLoading()
    },

    // 点击导航切换的回调
    changeNav(event) {
        let navId = event.currentTarget.id
        this.setData({
            navId: navId >>> 0,
            videoList: []
        })
        wx.showLoading({
            title: '正在加载',
        })
        // 获取最新的视频列表数据
        this.getVideoList(navId)
    },
    // 点击播放/继续
    handlePlay(event) {
        let vid = event.currentTarget.id
        // this.videoContext && this.vid !== vid && this.videoContext.stop()
        // this.vid = vid
        this.videoContext = wx.createVideoContext(vid)
        // 将当前点击的vid更新至data中的vedioId
        this.setData({
            videoId: vid
        })
        // 判断当前是否有播放事件记录
        let {
            videoUpdataTime
        } = this.data
        let videoItem = videoUpdataTime.find(item => item.vid === vid)
        if (videoItem) {
            // 跳转至指定位置播放
            this.videoContext.seek(videoItem.currentTime)
        }
        // 播放当前视频
        this.videoContext.play()
    },

    // 视频播放进度实时变化的回调
    handleTimeUpdate(event) {
        let videoTimeObj = {
            vid: event.currentTarget.id,
            currentTime: event.detail.currentTime
        }
        let {
            videoUpdataTime
        } = this.data
        let videoItem = videoUpdataTime.find(item =>
            item.vid === event.currentTarget.id
        )
        if (videoItem) {
            videoItem.currentTime = event.detail.currentTime
        } else {
            videoUpdataTime.push(videoTimeObj)
        }

        this.setData({
            videoUpdataTime
        })

    },
    // 监听视频播放结束的事件
    handleEnded(event) {
        // 将当前视频的播放记录从 videoUpdataTime 中移除
        let {
            videoUpdataTime
        } = this.data

        videoUpdataTime.splice(videoUpdataTime.findIndex(item => item.vid === event.currentTarget.id), 1)
    },
    // 下拉刷新的回调
    handleRefresher() {
        this.getVideoList(this.data.navId)
    },
    // scroll-view 上拉触底的回调
    handeToLower() {
        console.log(1);
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
    onShareAppMessage: function ({
        from
    }) {
        if (from === 'button') {
            return {

                title: '来自button的转发',
                page: '/pages/video/video',
                imageUrl: "/static/images/nvsheng.jpg"
            }
        } else {
            return {

                title: '来自menu的转发',
                page: '/pages/video/video',
                imageUrl: "/static/images/nvsheng.jpg"
            }
        }

    }
})