<template>
  <div class="netWorkError">
    <img src="@/assets/netWord_errror_images/yun0.png" class="yun0" alt="">
    <img src="@/assets/netWord_errror_images/yun1.png" class="yun1" alt="">
    <img src="@/assets/netWord_errror_images/yun2.png" class="yun2" alt="">
    <img src="@/assets/netWord_errror_images/bird.png" class="bird" alt="">
    <img src="@/assets/netWord_errror_images/san.png" class="san" alt="">
    <div class="tipInfo">
      <div class="in">
        <h2> 请稍后访问</h2>
        <p>系统正在维护中 <span @click="$router.go(-1)">重试</span></p>
      </div>
    </div>
  </div>
</template>
<style scoped lang='scss'>
  .netWorkError {
    height: 100vh;
    background: #d2f5f1;
    margin: 0 auto;
    position: relative;
    overflow: hidden;
    img {
      position: absolute;
    }
    .yun0 {
      right: -140px;
      top: 30px;
      animation: cloudLarge 105s infinite;
    }
    .yun1 {
      left: 5%;
      top: 48%;
      animation: cloudSmall 105s infinite;
    }
    .yun2 {
      left: 16%;
      top: 35%;
      animation: cloudMedium 105s infinite;
    }
    .bird {
      left: 27%;
      top: 15%;
      animation: flying 3s infinite;
    }
    .san {
      left: 10%;
      top: 20%;
      animation: dn400 3s 0s ease both;
    }
    .tipInfo {
      position: absolute;
      z-index: 99;
      margin-left: 150px;
      border: 4px solid #c0ece7;
      border-color: #c0ede8;
      border-radius: 5px;
      background: #c0ede8;
      width: 360px;
      left: 45%;
      top: 35%;
      .in {
        background: #fff;
        padding: 0 10%;
        box-sizing: border-box;
        h2 {
          line-height: 50px;
          font-size: 30px;
          color: #e94c3c;
          border-bottom: 1px dashed #aacdd5;
          padding: 18px 0;
          box-sizing: border-box;
          margin: 0;
        }
        p {
          padding: 30px 0 50px;
          box-sizing: border-box;
          color: #289575;
          margin: 0;
          span {
            margin-left: 20px;
            color: #e94c3c;
            cursor: pointer;
          }
        }
      }
    }
  }
  @keyframes cloudLarge {
    0% {
      right: -140px;
    }
    100% {
      right: 118%;
    }
  }
  @keyframes cloudSmall {
    0% {
      left: 5%;
    }
    100% {
      left: 105%;
    }
  }
  @keyframes cloudMedium {
    0% {
      left: 16%;
    }
    100% {
      left: -18%;
    }
  }
  @keyframes flying {
    0% {
      margin-top: 0
    }
    50% {
      margin-top: 6px;
    }
    100% {
      margin-top: 0
    }
  }
  @keyframes cloudMedium {
    0% {
      opacity: 0;
      transform: translateY(-400px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
</style>
