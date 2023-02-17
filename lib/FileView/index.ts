/*
 * @Author: 王云飞
 * @Date: 2023-02-01 09:28:38
 * @LastEditTime: 2023-02-17 16:51:02
 * @LastEditors: 王云飞
 * @Description:
 *
 */
import { ElLoading } from 'element-plus'
import { rafThrottle, getContainWH } from './util'
interface ToolPanelParams {
  scale: number
  rotate: number
  offsetX: number
  offsetY: number
  initX: number
  initY: number
}
interface CustomFiles {
  url: string
  originName: string
}
type ConstructorParams = {
  files: CustomFiles[]
  showUrl: string
}
class FileView {
  // 当前页码/总页码, dom元素
  public fileViewDescElement: HTMLElement | null = null
  // 工具面板参数
  public toolPanelParams: ToolPanelParams = {
    scale: 1,
    rotate: 0,
    offsetX: 0,
    offsetY: 0,
    initX: 0,
    initY: 0
  }
  // 显示工具栏
  public needTools: boolean = true
  // loading实例
  private loadingInstance: any = null
  // 遮罩层
  public maskElement: HTMLElement | null = null
  // 展示层
  public showElement: HTMLElement | null = null
  // 遮罩层点击是否关闭
  public maskEnableClick: boolean = false
  // 点击的 文件在fils的 index
  private currentIndex: number = 0
  // 文件集合
  private files: CustomFiles[]
  constructor({ files, showUrl }: ConstructorParams) {
    this.files = files
    this.currentIndex = this.files.findIndex((item) => item.url === showUrl)
    this.initMask()
    this.addCLoseIcon()
    this.initArrow()
    this.initTools()
    this.showFile(this.files[this.currentIndex])
    this.initFileName()
  }
  // 初始化遮罩层
  initMask() {
    this.maskElement = document.createElement('div')
    this.maskElement.classList.add('file-view-mask')
    // 获取浏览器视窗宽高并赋值
    const { innerWidth, innerHeight } = window
    this.maskElement.style.width = innerWidth + 'px'
    this.maskElement.style.height = innerHeight + 'px'
    document.body.appendChild(this.maskElement)
    this.maskElement.addEventListener('click', (event) => {
      if (!this.maskEnableClick) event.stopPropagation()
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
  // 添加关闭图标
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
      const leftArrow: HTMLElement = document.createElement('div')
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
  // 图片加载
  loadImage(url: string) {
    if (this.maskElement && !this.showElement) {
      // 创建展示图层
      this.showElement = document.createElement('div')
      this.showElement.setAttribute('id', 'show-element')
      this.showElement.classList.add('show-element')
      this.maskElement.appendChild(this.showElement)
    }
    this.showElement?.classList.remove('pdf-center')
    this.clearShowContent()
    // 展示图片
    const imgBox = new Image()
    imgBox.src = url
    imgBox.id = 'img-box'
    imgBox.addEventListener('load', () => {
      if (!this.showElement) return
      const tempWidth = imgBox.width
      const imgHeight = imgBox.height
      const offsetWidth = this.showElement.offsetWidth
      const offsetHeight = this.showElement.offsetHeight
      const { width, height } = getContainWH(
        {
          width: offsetWidth,
          height: offsetHeight
        },
        {
          width: tempWidth,
          height: imgHeight
        }
      )!
      imgBox.style.width = width + 'px'
      imgBox.style.height = height + 'px'
      const offsetX = (offsetWidth - width) / 2
      const offsetY = (offsetHeight - height) / 2
      this.toolPanelParams.initX = offsetX
      this.toolPanelParams.initY = offsetY
      this.toolPanelParams.offsetX = offsetX
      this.toolPanelParams.offsetY = offsetY
      imgBox.style.left = offsetX + 'px'
      imgBox.style.top = offsetY + 'px'
      this.showElement.appendChild(imgBox)
      // this._handleMouseWheel = this.rafThrottleX((e: WheelEvent) => {
      //   const delta = e.deltaY
      //   if (delta < 0) {
      //     this.handleTool('enlarge')
      //   } else {
      //     this.handleTool('narrow')
      //   }
      // })
      this.showElement.addEventListener('wheel', this._handleMouseWheel)
      this.showElement.addEventListener('mousedown', (event) => {
        this.handleMouseDown(event)
      })
    })
    imgBox.addEventListener('error', (error) => {
      console.log('图片加载失败')
      console.log(error)
      this.handleImgLoadError()
    })
  }
  // 鼠标按下
  handleMouseDown(e: MouseEvent) {
    if (!this.showElement) return
    const { offsetX, offsetY } = this.toolPanelParams
    const startX = e.pageX
    const startY = e.pageY
    const handler = rafThrottle((ev: MouseEvent) => {
      this.toolPanelParams.offsetX = offsetX + ev.pageX - startX
      this.toolPanelParams.offsetY = offsetY + ev.pageY - startY
      this.handleImg()
    })
    this.showElement.addEventListener('mousemove', handler)
    this.showElement.addEventListener('mouseup', () => {
      this.showElement?.removeEventListener('mousemove', handler)
    })
    this.showElement.addEventListener('mouseleave', () => {
      this.showElement?.removeEventListener('mousemove', handler)
    })
    e.preventDefault()
  }
  // 监听的滚轮方法
  private _handleMouseWheel = rafThrottle((e: WheelEvent) => {
    const delta = e.deltaY
    if (delta < 0) {
      this.handleTool('enlarge')
    } else {
      this.handleTool('narrow')
    }
  })
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
  // 加载PDF
  loadPDF(fileId: string) {
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
    this.showElement && this.showElement.appendChild(pdfBox)
  }
  // 清除画布内容
  clearShowContent() {
    // 清除图片/pdf展示
    if (this.showElement) this.showElement.innerHTML = ''
  }
  // 获取文件类型
  getFileType(originName: string) {
    let fileType = 'img'
    const arr = originName.split('.')
    const type = arr[arr.length - 1].toLowerCase()
    if (type === 'pdf') {
      fileType = type
    }
    return fileType
  }
  // 文件展示逻辑
  showFile(item: CustomFiles) {
    if (!item || !item.url) return
    const type = this.getFileType(item.originName)
    if (type === 'pdf') {
      // this.loadPDF(item.fileId)
      return
    }
    this.loadImage(item.url)
  }
  open() {}
  // 移除监听
  uninstallListener() {
    this.showElement && this.showElement.removeEventListener('wheel', this._handleMouseWheel)
  }
  // 关闭方法
  close() {
    if (this.maskElement) {
      this.uninstallListener()
      this.maskElement.parentElement && this.maskElement.parentElement.removeChild(this.maskElement)
      this.maskElement = null
    }
  }
  // 图片跳转方法
  jumpSwitch(pageIndex: number) {
    // 切换时初始化操作工具
    this.toolPanelParams.initX = 0
    this.toolPanelParams.initY = 0
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
  // 加载 Loading
  showLoading() {
    this.loadingInstance = ElLoading.service({
      fullscreen: true,
      target: this.showElement!
    })
  }
  // 关闭 Loading
  closeLoading() {
    this.loadingInstance.close()
  }
  // PDF 预览
  async previewPDF(fileId: string) {
    // const url = await this.getBlobFile(fileId)
    // const iframe: HTMLIFrameElement = document.createElement('iframe')
    // iframe.src = url
    // iframe.width = '100%'
    // iframe.height = '100%'
    // this.clearShowContent()
    // this.showElement.appendChild(iframe)
    // // 1. 打开子窗口预览
    // // const iLeft = (window.screen.width - 1200) / 2
    // // const iTop = (window.screen.height - 600) / 2
    // // const windowFeatures = `menubar=0,scrollbars=1,resizable=1,status=1,titlebar=0,toolbar=0,location=1,innerWidth=1200,innerHeight=600,top=${iTop},left=${iLeft}`
    // // window.open(generateURL, 'PDF预览', windowFeatures)
  }
  // 获取 FileBlob 生成URL
  async getBlobFile(fileId: string) {
    // this.showLoading()
    // const pdfResult = await apiGetFile(fileId)
    // this.closeLoading()
    // const finalBlob = new Blob([pdfResult], { type: 'application/pdf' })
    // const generateURL = URL.createObjectURL(finalBlob)
    // return generateURL
  }
  // 初始化 工具栏参数
  initToolPanelParams() {
    this.toolPanelParams.scale = 1
    this.toolPanelParams.rotate = 0
    this.toolPanelParams.offsetX = 0
    this.toolPanelParams.offsetY = 0
  }
  // 操作图片
  handleImg() {
    const imgBox = document.getElementById('img-box')
    if (imgBox) {
      imgBox.style[
        'transform'
      ] = `scale(${this.toolPanelParams.scale}) rotate(${this.toolPanelParams.rotate}deg)`
      imgBox.style['transition'] = `all 0.12s`
      imgBox.style.left = this.toolPanelParams.offsetX + 'px'
      imgBox.style.top = this.toolPanelParams.offsetY + 'px'
    }
  }
  // handleTool
  handleTool(type: string) {
    let scale = this.toolPanelParams.scale
    let rotate = this.toolPanelParams.rotate
    switch (type) {
      case 'enlarge':
        scale += 0.05
        if (scale >= 5) {
          scale = 5
        }
        this.toolPanelParams.scale = scale
        this.handleImg()
        break
      case 'narrow':
        scale -= 0.05
        if (scale <= 0.1) {
          scale = 0.1
        }
        this.toolPanelParams.scale = scale
        this.handleImg()
        break
      case 'reset':
        this.initToolPanelParams()
        if (this.toolPanelParams.initX !== 0 || this.toolPanelParams.initY !== 0) {
          this.toolPanelParams.offsetX = this.toolPanelParams.initX
          this.toolPanelParams.offsetY = this.toolPanelParams.initY
        }
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
  // 箭头是否处于激活状态
  arrowIsActive() {
    const leftArrowEle: HTMLElement | null = document.getElementById('left-arrow')
    const rightArrowEle: HTMLElement | null = document.getElementById('right-arrow')
    // 最后一张图了
    if (this.currentIndex === this.files.length - 1) {
      leftArrowEle && leftArrowEle.classList.remove('deactive')
      rightArrowEle && rightArrowEle.classList.add('deactive')
      return
    } else if (this.currentIndex === 0) {
      // 是第一张图
      rightArrowEle && rightArrowEle.classList.remove('deactive')
      leftArrowEle && leftArrowEle.classList.add('deactive')
      return
    }
    rightArrowEle && rightArrowEle.classList.remove('deactive')
    leftArrowEle && leftArrowEle.classList.remove('deactive')
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
  // 设置页码内容
  setFilePageName() {
    if (this.fileViewDescElement) {
      const pageContent = `${this.currentIndex + 1}/${this.files.length}`
      this.fileViewDescElement.innerHTML = pageContent
    }
  }
}

export default FileView
