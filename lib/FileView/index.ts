/*
 * @Author: 王云飞
 * @Date: 2023-02-01 09:28:38
 * @LastEditTime: 2023-02-01 17:27:12
 * @LastEditors: 王云飞
 * @Description: 
 * 
 */
/*
 * @Author: 王云飞
 * @Date: 2022-07-22 16:07:20
 * @LastEditTime: 2023-02-01 15:17:01
 * @LastEditors: 王云飞
 * @Description: 文件查看
 *
 */
/* eslint-disable */ 
import { ElLoading } from 'element-plus';
// import { apiGetFile } from '@/api/file.js'
/* eslint-enable */
type Params = {
  files: any[],
  showUrl: string
}
class FileView {
  // 文件页面 文件名等
  fileViewDescElement: HTMLElement | null = null
  // 工具面板参数
  toolPanelParams = {
    scale: 1,
    rotate: 0
  }
  // 显示工具栏
  needTools: boolean = true
  // loading实例
  loadingInstance = null
  // 遮罩层
  maskElement = null
  // 展示层
  showElement = null
  // 遮罩层点击是否关闭
  maskEnableClick = false
  // 点击的 文件在fils的 index
  currentIndex = 0
  files: any[]
  constructor({ files, showUrl }: Params) {
    this.files = files
    this.currentIndex = this.files.findIndex(item => item.url === showUrl)
    this.initMask()
    this.addCLoseIcon()
    this.initArrow()
    this.initTools()
    this.showFile(this.files[this.currentIndex])
    this.initFileName()
  }
  initMask() {
    this.maskElement = document.createElement('div')
    this.maskElement.classList.add('file-view-mask')
    // 获取浏览器视窗宽高并赋值
    const { innerWidth, innerHeight } = window
    this.maskElement.style.width = innerWidth + 'px'
    this.maskElement.style.height = innerHeight + 'px'
    document.body.appendChild(this.maskElement)
    this.maskElement.addEventListener('click', (event) => {
      // if (!this.maskDisableClick)event.stopPropagation()
    })
  }
  // 初始化工具栏
  initTools() {
    const toolsElement = document.createElement('div')
    toolsElement.classList.add('file-view-tools')
    // 添加放大按钮
    const enlargeBtn = document.createElement('div')
    enlargeBtn.className = 'enlarge-btn tool-btn'
    enlargeBtn.addEventListener('click', () => {
      this.handleTool('enlarge')
    })
    // 添加缩小按钮
    const narrowBtn = document.createElement('div')
    narrowBtn.className = 'narrow-btn tool-btn'
    narrowBtn.addEventListener('click', () => {
      this.handleTool('narrow')
    })
    // 添加重置按钮
    const resetBtn = document.createElement('div')
    resetBtn.className = 'reset-btn tool-btn'
    resetBtn.addEventListener('click', () => {
      this.handleTool('reset')
    })
    // 添加左旋按钮
    const leftRotateBtn = document.createElement('div')
    leftRotateBtn.className = 'left-rotate-btn tool-btn'
    leftRotateBtn.addEventListener('click', () => {
      this.handleTool('left-rotate')
    })
    // 添加右旋按钮
    const rightRotateBtn = document.createElement('div')
    rightRotateBtn.className = 'right-rotate-btn tool-btn'
    rightRotateBtn.addEventListener('click', () => {
      this.handleTool('right-rotate')
    })
    if (this.maskElement) {
      toolsElement.appendChild(enlargeBtn)
      toolsElement.appendChild(narrowBtn)
      toolsElement.appendChild(resetBtn)
      toolsElement.appendChild(leftRotateBtn)
      toolsElement.appendChild(rightRotateBtn)
      this.maskElement.appendChild(toolsElement)
    }
  }
  addCLoseIcon() {
    const closeIcon = document.createElement('div')
    closeIcon.classList.add('file-view-close')
    closeIcon.addEventListener('click', () => {
      this.close()
    })
    if (this.maskElement) {
      this.maskElement.appendChild(closeIcon)
    }
  }
  // 初始化左右箭头
  initArrow() {
    if (this.maskElement) {
      const leftArrow = document.createElement('div')
      leftArrow.classList.add('left-arrow')
      leftArrow.id = 'left-arrow'
      leftArrow.addEventListener('click', () => {
        if (this.currentIndex > 0) {
          const index = this.currentIndex - 1
          this.jumpSwitch(index)
        }
      })
      this.maskElement.appendChild(leftArrow)
      const rightArrow = document.createElement('div')
      rightArrow.classList.add('right-arrow')
      rightArrow.id = 'right-arrow'
      rightArrow.addEventListener('click', () => {
        if (this.currentIndex < this.files.length - 1) {
          const index = this.currentIndex + 1
          this.jumpSwitch(index)
        }
      })
      this.maskElement.appendChild(rightArrow)
      // 检测边界
      this.arrowIsActive()
    }
  }
  loadImage(url) {
    if (this.maskElement && !this.showElement) {
      // 创建展示图层
      this.showElement = document.createElement('div')
      this.showElement.setAttribute('id', 'show-element')
      this.showElement.classList.add('show-element')
      this.maskElement.appendChild(this.showElement)
    }
    this.clearShowContent()
    // 展示图片
    const imgBox = new Image()
    imgBox.src = url
    imgBox.id = 'img-box'
    imgBox.addEventListener('load', () => {
      this.showElement.appendChild(imgBox)
      this.showElement.addEventListener('mousewheel', (e) => {
        const delta = e.wheelDelta
        if (delta > 0) {
          this.handleTool('enlarge')
        } else {
          this.handleTool('narrow')
        }
      })
    })
    imgBox.addEventListener('error', (error) => {
      console.log('图片加载失败')
      console.log(error)
      this.handleImgLoadError()
    })
  }
  // 文件加载错误处理
  handleImgLoadError() {
    if (!this.showElement) return
    const tipsElement = document.createElement('div')
    tipsElement.classList.add('error-tips-text')
    tipsElement.innerHTML = '文件类型不支持预览, 请自行下载后预览'
    const downElement = document.createElement('div')
    downElement.classList.add('to-download')
    downElement.innerHTML = '点击下载'
    downElement.addEventListener('click', () => {
      const { url } = this.files[this.currentIndex]
      const a = document.createElement('a')
      a.href = url
      a.click()
    })
    const errorElement = document.createElement('div')
    errorElement.classList.add('error-tips')
    errorElement.appendChild(tipsElement)
    errorElement.appendChild(downElement)
    this.showElement.appendChild(errorElement)
  }
  loadPDF(fileId) {
    if (this.maskElement && !this.showElement) {
      // 创建pdf展示图层
      this.showElement = document.createElement('div')
      this.showElement.setAttribute('id', 'show-element')
      this.showElement.classList.add('show-element')
      this.maskElement.appendChild(this.showElement)
    }
    this.clearShowContent()
    const pdfBox = document.createElement('div')
    pdfBox.classList.add('pdf-box')
    pdfBox.innerHTML = '点击预览PDF文件'
    pdfBox.addEventListener('click', () => {
      this.previewPDF(fileId)
    })
    this.showElement.appendChild(pdfBox)
  }
  // 清除画布内容
  clearShowContent() {
    // 清除图片/pdf展示
    if (this.showElement) this.showElement.innerHTML = ''
  }
  getFileType(originName) {
    let fileType = 'img'
    const arr = originName.split('.')
    const type = arr[arr.length - 1].toLowerCase()
    if (type === 'pdf') {
      fileType = type
    }
    return fileType
  }
  showFile(item) {
    if (!item || !item.url) return
    const type = this.getFileType(item.originName)
    if (type === 'pdf') {
      // this.loadPDF(item.fileId)
      return
    }
    this.loadImage(item.url)
  }
  open() {

  }
  close() {
    this.maskElement.parentElement.removeChild(this.maskElement)
    this.maskElement = null
  }
  jumpSwitch(pageIndex) {
    // 切换时初始化操作工具
    this.initToolPanelParams()

    const url = this.files[pageIndex]?.url
    if (url) {
      this.currentIndex = pageIndex
      this.showFile(this.files[this.currentIndex])
      // 改变文件名
      this.setFilePageName()
      // 箭头是否是到了边界
      this.arrowIsActive()
    }
  }
  showLoading() {
    this.loadingInstance = ElLoading.service({ fullscreen: true, target: this.showElement })
  }
  closeLoading() {
    this.loadingInstance.close()
  }
  async previewPDF(fileId) {
    const url = await this.getBlobFile(fileId)
    const iframe = document.createElement('iframe')
    iframe.src = url
    iframe.width = '100%'
    iframe.height = '100%'
    this.clearShowContent()
    this.showElement.appendChild(iframe)
    // 1. 打开子窗口预览
    // const iLeft = (window.screen.width - 1200) / 2
    // const iTop = (window.screen.height - 600) / 2
    // const windowFeatures = `menubar=0,scrollbars=1,resizable=1,status=1,titlebar=0,toolbar=0,location=1,innerWidth=1200,innerHeight=600,top=${iTop},left=${iLeft}`
    // window.open(generateURL, 'PDF预览', windowFeatures)
  }
  async getBlobFile(fileId) {
    this.showLoading()
    const pdfResult = await apiGetFile(fileId)
    this.closeLoading()
    const finalBlob = new Blob([pdfResult], { type: 'application/pdf' })
    const generateURL = URL.createObjectURL(finalBlob)
    // 1. 打开子窗口预览
    // const iLeft = (window.screen.width - 1200) / 2
    // const iTop = (window.screen.height - 600) / 2
    // const windowFeatures = `menubar=0,scrollbars=1,resizable=1,status=1,titlebar=0,toolbar=0,location=1,innerWidth=1200,innerHeight=600,top=${iTop},left=${iLeft}`
    // window.open(generateURL, 'PDF预览')
    return generateURL
  }
  initToolPanelParams() {
    this.toolPanelParams = {
      scale: 1,
      rotate: 0
    }
  }
  // 操作图片
  handleImg() {
    const imgBox = document.getElementById('img-box')
    if (imgBox) {
      imgBox.style['transform'] = `scale(${this.toolPanelParams.scale}) rotate(${this.toolPanelParams.rotate}deg)`
      imgBox.style['transition'] = `all 0.12s`
    }
  }
  // handleTool
  handleTool(type) {
    let scale = this.toolPanelParams.scale
    let rotate = this.toolPanelParams.rotate
    switch (type) {
      case 'enlarge':
        scale += 0.1
        if (scale >= 5) {
          scale = 5
        }
        this.toolPanelParams.scale = scale
        this.handleImg()
        break
      case 'narrow':
        scale -= 0.1
        if (scale <= 0.1) {
          scale = 0.1
        }
        this.toolPanelParams.scale = scale
        this.handleImg()
        break
      case 'reset':
        this.initToolPanelParams()
        this.handleImg()
        break
      case 'left-rotate':
        rotate = rotate - 90
        this.toolPanelParams.rotate = rotate
        this.handleImg()
        // TODO 会有动画问题 先干掉
        // if (rotate <= -360) {
        //   rotate = 0
        //   this.toolPanelParams.rotate = rotate
        // }
        break
      case 'right-rotate':
        rotate = rotate + 90
        this.toolPanelParams.rotate = rotate
        this.handleImg()
        break

      default:
        break
    }
  }
  // 箭头是否是激活的
  arrowIsActive() {
    const leftArrowEle = document.getElementById('left-arrow')
    const rightArrowEle = document.getElementById('right-arrow')
    // 最后一张图了
    if (this.currentIndex === (this.files.length - 1)) {
      leftArrowEle.classList.remove('deactive')
      rightArrowEle.classList.add('deactive')
      return
    } else if (this.currentIndex === 0) { // 是第一张图
      rightArrowEle.classList.remove('deactive')
      leftArrowEle.classList.add('deactive')
      return
    }
    rightArrowEle.classList.remove('deactive')
    leftArrowEle.classList.remove('deactive')
  }
  // initFileName
  initFileName() {
    if (this.maskElement) {
      this.fileViewDescElement = document.createElement('div')
      this.fileViewDescElement.classList.add('file-view-desc')
      this.fileViewDescElement.id = 'file-view-desc'
      this.maskElement.appendChild(this.fileViewDescElement)
      this.setFilePageName()
    }
  }
  setFilePageName() {
    if (this.fileViewDescElement) {
      const pageContent = `${this.currentIndex + 1}/${this.files.length}`
      this.fileViewDescElement.innerHTML = pageContent
    }
  }
}
export default FileView
