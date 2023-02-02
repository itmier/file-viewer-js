var r = Object.defineProperty;
var d = (l, e, t) => e in l ? r(l, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : l[e] = t;
var i = (l, e, t) => (d(l, typeof e != "symbol" ? e + "" : e, t), t);
import { ElLoading as h } from "element-plus";
class E {
  constructor({ files: e, showUrl: t }) {
    // 当前页码/总页码, dom元素
    i(this, "fileViewDescElement", null);
    // 工具面板参数
    i(this, "toolPanelParams", {
      scale: 1,
      rotate: 0
    });
    // 显示工具栏
    i(this, "needTools", !0);
    // loading实例
    i(this, "loadingInstance", null);
    // 遮罩层
    i(this, "maskElement", null);
    // 展示层
    i(this, "showElement", null);
    // 遮罩层点击是否关闭
    i(this, "maskEnableClick", !1);
    // 点击的 文件在fils的 index
    i(this, "currentIndex", 0);
    // 文件集合
    i(this, "files");
    this.files = e, this.currentIndex = this.files.findIndex((s) => s.url === t), this.initMask(), this.addCLoseIcon(), this.initArrow(), this.initTools(), this.showFile(this.files[this.currentIndex]), this.initFileName();
  }
  // 初始化遮罩层
  initMask() {
    this.maskElement = document.createElement("div"), this.maskElement.classList.add("file-view-mask");
    const { innerWidth: e, innerHeight: t } = window;
    this.maskElement.style.width = e + "px", this.maskElement.style.height = t + "px", document.body.appendChild(this.maskElement), this.maskElement.addEventListener("click", (s) => {
      this.maskEnableClick || s.stopPropagation();
    });
  }
  // 初始化工具栏
  initTools() {
    const e = document.createElement("div");
    e.classList.add("file-view-tools");
    const t = document.createElement("div");
    t.className = "enlarge-btn tool-btn", t.addEventListener("click", () => {
      this.handleTool("enlarge");
    });
    const s = document.createElement("div");
    s.className = "narrow-btn tool-btn", s.addEventListener("click", () => {
      this.handleTool("narrow");
    });
    const n = document.createElement("div");
    n.className = "reset-btn tool-btn", n.addEventListener("click", () => {
      this.handleTool("reset");
    });
    const a = document.createElement("div");
    a.className = "left-rotate-btn tool-btn", a.addEventListener("click", () => {
      this.handleTool("left-rotate");
    });
    const o = document.createElement("div");
    o.className = "right-rotate-btn tool-btn", o.addEventListener("click", () => {
      this.handleTool("right-rotate");
    }), this.maskElement && (e.appendChild(t), e.appendChild(s), e.appendChild(n), e.appendChild(a), e.appendChild(o), this.maskElement.appendChild(e));
  }
  // 添加关闭图标
  addCLoseIcon() {
    const e = document.createElement("div");
    e.classList.add("file-view-close"), e.addEventListener("click", () => {
      this.close();
    }), this.maskElement && this.maskElement.appendChild(e);
  }
  // 初始化左右箭头
  initArrow() {
    if (this.maskElement) {
      const e = document.createElement("div");
      e.classList.add("left-arrow"), e.id = "left-arrow", e.addEventListener("click", () => {
        if (this.currentIndex > 0) {
          const s = this.currentIndex - 1;
          this.jumpSwitch(s);
        }
      }), this.maskElement.appendChild(e);
      const t = document.createElement("div");
      t.classList.add("right-arrow"), t.id = "right-arrow", t.addEventListener("click", () => {
        if (this.currentIndex < this.files.length - 1) {
          const s = this.currentIndex + 1;
          this.jumpSwitch(s);
        }
      }), this.maskElement.appendChild(t), this.arrowIsActive();
    }
  }
  // 图片加载
  loadImage(e) {
    this.maskElement && !this.showElement && (this.showElement = document.createElement("div"), this.showElement.setAttribute("id", "show-element"), this.showElement.classList.add("show-element"), this.maskElement.appendChild(this.showElement)), this.clearShowContent();
    const t = new Image();
    t.src = e, t.id = "img-box", t.addEventListener("load", () => {
      this.showElement && (this.showElement.appendChild(t), this.showElement.addEventListener("wheel", (s) => {
        s.deltaY < 0 ? this.handleTool("enlarge") : this.handleTool("narrow");
      }));
    }), t.addEventListener("error", (s) => {
      console.log("图片加载失败"), console.log(s), this.handleImgLoadError();
    });
  }
  // 文件加载错误处理
  handleImgLoadError() {
    if (!this.showElement)
      return;
    const e = document.createElement("div");
    e.classList.add("error-tips-text"), e.innerHTML = "文件类型不支持预览, 请自行下载后预览";
    const t = document.createElement("div");
    t.classList.add("to-download"), t.innerHTML = "点击下载", t.addEventListener("click", () => {
      const { url: n } = this.files[this.currentIndex], a = document.createElement("a");
      a.href = n, a.click();
    });
    const s = document.createElement("div");
    s.classList.add("error-tips"), s.appendChild(e), s.appendChild(t), this.showElement.appendChild(s);
  }
  // 加载PDF
  loadPDF(e) {
    this.maskElement && !this.showElement && (this.showElement = document.createElement("div"), this.showElement.setAttribute("id", "show-element"), this.showElement.classList.add("show-element"), this.maskElement.appendChild(this.showElement)), this.clearShowContent();
    const t = document.createElement("div");
    t.classList.add("pdf-box"), t.innerHTML = "点击预览PDF文件", t.addEventListener("click", () => {
      this.previewPDF(e);
    }), this.showElement && this.showElement.appendChild(t);
  }
  // 清除画布内容
  clearShowContent() {
    this.showElement && (this.showElement.innerHTML = "");
  }
  // 获取文件类型
  getFileType(e) {
    let t = "img";
    const s = e.split("."), n = s[s.length - 1].toLowerCase();
    return n === "pdf" && (t = n), t;
  }
  // 文件展示逻辑
  showFile(e) {
    !e || !e.url || this.getFileType(e.originName) === "pdf" || this.loadImage(e.url);
  }
  open() {
  }
  // 关闭方法
  close() {
    this.maskElement && (this.maskElement.parentElement && this.maskElement.parentElement.removeChild(this.maskElement), this.maskElement = null);
  }
  // 图片跳转方法
  jumpSwitch(e) {
    var s;
    this.initToolPanelParams(), ((s = this.files[e]) == null ? void 0 : s.url) && (this.currentIndex = e, this.showFile(this.files[this.currentIndex]), this.setFilePageName(), this.arrowIsActive());
  }
  // 加载 Loading
  showLoading() {
    this.loadingInstance = h.service({ fullscreen: !0, target: this.showElement });
  }
  // 关闭 Loading
  closeLoading() {
    this.loadingInstance.close();
  }
  // PDF 预览
  async previewPDF(e) {
  }
  // 获取 FileBlob 生成URL
  async getBlobFile(e) {
  }
  // 初始化 工具栏参数
  initToolPanelParams() {
    this.toolPanelParams = {
      scale: 1,
      rotate: 0
    };
  }
  // 操作图片
  handleImg() {
    const e = document.getElementById("img-box");
    e && (e.style.transform = `scale(${this.toolPanelParams.scale}) rotate(${this.toolPanelParams.rotate}deg)`, e.style.transition = "all 0.12s");
  }
  // handleTool
  handleTool(e) {
    let t = this.toolPanelParams.scale, s = this.toolPanelParams.rotate;
    switch (e) {
      case "enlarge":
        t += 0.1, t >= 5 && (t = 5), this.toolPanelParams.scale = t, this.handleImg();
        break;
      case "narrow":
        t -= 0.1, t <= 0.1 && (t = 0.1), this.toolPanelParams.scale = t, this.handleImg();
        break;
      case "reset":
        this.initToolPanelParams(), this.handleImg();
        break;
      case "left-rotate":
        s = s - 90, this.toolPanelParams.rotate = s, this.handleImg();
        break;
      case "right-rotate":
        s = s + 90, this.toolPanelParams.rotate = s, this.handleImg();
        break;
    }
  }
  // 箭头是否处于激活状态
  arrowIsActive() {
    const e = document.getElementById("left-arrow"), t = document.getElementById("right-arrow");
    if (this.currentIndex === this.files.length - 1) {
      e && e.classList.remove("deactive"), t && t.classList.add("deactive");
      return;
    } else if (this.currentIndex === 0) {
      t && t.classList.remove("deactive"), e && e.classList.add("deactive");
      return;
    }
    t && t.classList.remove("deactive"), e && e.classList.remove("deactive");
  }
  // initFileName
  initFileName() {
    this.maskElement && (this.fileViewDescElement = document.createElement("div"), this.fileViewDescElement.classList.add("file-view-desc"), this.fileViewDescElement.id = "file-view-desc", this.maskElement.appendChild(this.fileViewDescElement), this.setFilePageName());
  }
  // 设置页码内容
  setFilePageName() {
    if (this.fileViewDescElement) {
      const e = `${this.currentIndex + 1}/${this.files.length}`;
      this.fileViewDescElement.innerHTML = e;
    }
  }
}
export {
  E as default
};
