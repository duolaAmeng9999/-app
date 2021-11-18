  <template>
  <view class="wrap">
    <view class="content"><view class="title">欢迎登陆硅谷团购平台</view></view>
    <view class="buttom">
      <view class="loginType">
        <!-- 对于按钮需要进行禁用判断，以防止多次点击 -->
        <button @click="getUserMsg" class="loginBtn" :disabled="isLogin">
          <view class="wechat item">
            <view class="icon"
              ><u-icon
                size="200"
                name="weixin-fill"
                color="rgb(83,194,64)"
              ></u-icon
            ></view>
            微信登陆
          </view>
        </button>
      </view>
      <view class="hint">
        登录代表同意
        <text class="link">硅谷团购平台用户协议、隐私政策，</text>
        并授权使用您的硅谷团购平台账号信息（如昵称、头像、收获地址）以便您统一管理
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      // 防止按钮多次点击的布尔值
      isLogin: false,
    };
  },
  methods: {
    // 获取用户信息
    getUserMsg() {
      // 点击登录时只能点击一次; 使点击按钮禁用
      this.isLogin = true;
      uni.getUserProfile({
        desc: "获取用户信息",
        success: (res) => {
          // 获取到用户的基本信息
          const photoUrl = res.userInfo.avatarUrl;
          const nickName = res.userInfo.nickName;
          const sex = res.userInfo.gender;
          // 将用户的基本信息存储于本地
          uni.setStorageSync("userInfo", { photoUrl, nickName, sex });
          // 获取到用户的详细登录信息
          uni.login({
            success: async (res) => {
              // 目的时为了拿到用户的 code 码
              // 发送请求; 需要用户的 code 参数
              const result = await this.$u.api.getWxLogin({ res });
              // 将后台返回的 token 存放微信小程序 storage 中
              uni.setStorage({
                key: "token",
                data: result.token,
                success: async () => {
                  // 需要更新用户信息; 调用接口, 传入用户基本信息
                  await this.$u.api.postUpdateUser({
                    photoUrl,
                    nickName,
                    sex,
                  });
                  // 登录成功返回首页
                  uni.reLaunch({
                    url: "/pages/index/index",
                  });
                },
              });
            },
          });
        },
        // 错误处理
        fail: (error) => {
          console.log(error);
        },
        // 接口调用结束时的回调函数
        complete: () => {
          // 数据请求完毕按钮恢复可点击状态
          this.isLogin = false;
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.wrap {
  font-size: 28rpx;
  .content {
    width: 600rpx;
    margin: 80rpx auto 0;
    .title {
      text-align: left;
      font-size: 60rpx;
      font-weight: 500;
      margin-bottom: 100rpx;
    }
  }
  .buttom {
    .loginType {
      display: flex;
      justify-content: center;
      padding: 100rpx;
      .loginBtn {
        background: transparent;
      }
      .loginBtn::after {
        border: none;
      }
      .item {
        display: flex;
        flex-direction: column;
        align-items: center;
        color: $u-content-color;
        font-size: 28rpx;
      }
    }
    .hint {
      padding: 20rpx 40rpx;
      font-size: 24rpx;
      color: $u-tips-color;
      .link {
        color: $u-type-warning;
      }
    }
  }
}
</style>