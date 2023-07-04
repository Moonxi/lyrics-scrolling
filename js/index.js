;(async () => {
  // 拿到歌词原始数据
  const data = await getLrc()
  console.log(data)
  // 处理数据
  // 歌词内容数组
  const lyrics = data
    .replace(/\s/g, '')
    .split('[')
    .filter(item => item)
    .map(item => item.substring(item.indexOf(']') + 1))
  // 歌词对象数组
  let lrcObjs = []
  // 歌词时间数组
  const lrcTimes = data
    .split('[')
    .filter(item => item.includes('.'))
    .map(item => {
      const temp = item.substring(0, item.indexOf(']')).split(':')
      return temp[0] * 60 + +temp[1]
    })
  console.log(lrcTimes)
  // 获取需要操作的dom元素
  const lyricContainer = document.querySelector('.lyric-container')
  const lyricAudio = document.querySelector('.lyric-audio')
  // 定义初始化函数
  const init = function () {
    // 初始化歌词
    initLyrics()
    // 初始化事件
    initEvents()
    // 加载音乐
    lyricAudio.src = './public/music.mp3'
  }
  // 定义初始化歌词函数
  function initLyrics() {
    lyricContainer.innerHTML = ''
    lrcObjs = []
    lyrics.forEach(item => {
      const li = document.createElement('li')
      li.className = 'lyric-item'
      li.innerHTML = item
      lyricContainer.append(li)
      lrcObjs.push(li)
    })
  }
  // 定义事件处理函数
  const eventHandlers = {
    // 初始化音乐播放器控件
    initAudio(e) {
      this.volume = 0.1
      this.controls = true
    },
    // 音乐播放事件
    audioPlaying(e) {
      setLyrics(this.currentTime)
    },
    // 歌词点击事件
    clickLyric(e) {
      if (e.target.className !== 'lyric-item') {
        return
      }
      const index = Array.from(this.children).indexOf(e.target)
      lyricAudio.currentTime = lrcTimes[index]
      setLyrics(lyricAudio.currentTime)
      lyricAudio.play()
    }
  }
  // 定义初始化事件函数
  function initEvents() {
    lyricAudio.addEventListener('loadeddata', eventHandlers.initAudio)
    lyricAudio.addEventListener('timeupdate', eventHandlers.audioPlaying)
    lyricContainer.addEventListener('click', eventHandlers.clickLyric)
  }
  // 定义根据当前播放时间设置歌词状态函数
  function setLyrics(curTime) {
    if (!lrcObjs.length || lrcObjs.length <= 0) {
      return
    }
    let index = 0
    lrcTimes.find((item, i) => {
      index = i - 1
      return curTime <= item - 0.2
    })
    // 根据index设置样式
    if (index < 0) {
      return
    }
    lrcObjs.forEach(item => item.classList.remove('active'))
    lrcObjs[index].classList.add('active')
    // 根据index设置滚动位置
    let scrollTop = (lyricContainer.scrollHeight / lrcObjs.length) * (index + 0.5) - lyricContainer.offsetHeight / 2
    scrollTop = scrollTop <= 0 ? 0 : scrollTop
    lyricContainer.scrollTo({ top: scrollTop, behavior: 'smooth' })
  }

  init()
})()
