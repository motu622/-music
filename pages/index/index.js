import request from '../../utils/request.js'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        banners: [], //轮播图的数据
        recommendList: [], //推荐歌曲
        topList: [] //排行榜
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getInitData()
    },

    // 获取初始化数据
    async getInitData() {

        // 获取banners数据
        let result = await request('/banner', {
            type: 2
        })
        this.setData({
            banners: result.banners
        })
        // 获取推荐歌曲数据
        result = await request('/personalized')
        this.setData({
            recommendList: result.result
        })
        // 获取排行榜数据

        let index = 0;
        let resultArr = [];
        while (index < 5) {
            let topListData = await request('/top/list', {
                idx: index++
            });

            let topListItem = {
                name: topListData.playlist.name,
                tracks: topListData.playlist.tracks.slice(0, 3)
            };
            resultArr.push(topListItem);
            // 不需要等待五次请求全部结束才更新，用户体验较好，但是渲染次数会多一些
            this.setData({
                topList: resultArr
            })
        }


    },

    // 跳转至recommendSong
    toRemmendSong() {
        wx.navigateTo({
            url: '/songPackage/pages/recommendSong/recommendSong',
        })
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