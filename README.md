# VideoCap - Screen Recorder / 屏幕录制程序

A lightweight screen recording application built with Electron. / 基于 Electron 构建的轻量级屏幕录制应用。

---

## Features / 功能特性

- **One-click Recording** - 一键录制屏幕
- **Global Shortcuts** - 全局快捷键控制
- **Auto Minimize** - 录制时自动最小化窗口
- **Save Dialog** - 录制完成后选择保存位置
- **Desktop Notification** - 录制完成桌面通知
- **Cross-platform** - 支持 macOS / Windows / Linux

---

## Installation / 安装

### Prerequisites / 前置要求

- Node.js >= 16
- npm >= 8

### Steps / 步骤

```bash
# Clone or download the project / 克隆或下载项目
cd videocap

# Install dependencies (uses China mirror) / 安装依赖（使用国内镜像）
ELECTRON_MIRROR=https://npmmirror.com/mirrors/electron/ npm install

# Or use the startup script / 或使用启动脚本
./start.sh
```

---

## Usage / 使用方法

### Start the App / 启动应用

```bash
npm start
```

### Keyboard Shortcuts / 快捷键

| Shortcut / 快捷键 | Action / 功能 |
|---|---|
| `⌘ + ⇧ + R` / `Ctrl + Shift + R` | Start / Stop Recording / 开始/停止录制 |
| `⌘ + ⇧ + S` / `Ctrl + Shift + S` | Stop Recording / 停止录制 |

### Recording Flow / 录制流程

1. Launch the app / 启动应用
2. Click the record button or press `⌘ + ⇧ + R` / 点击录制按钮或按快捷键
3. The app will minimize automatically / 程序将自动最小化
4. Press `⌘ + ⇧ + R` again to stop / 再次按快捷键停止录制
5. Choose a save location in the dialog / 在弹出的对话框中选择保存位置
6. Video will be saved as WebM format / 视频将以 WebM 格式保存

---

## Project Structure / 项目结构

```
videocap/
├── main.js          # Main process / 主进程
├── renderer.js      # Renderer process / 渲染进程
├── index.html       # UI template / 界面模板
├── style.css        # Styles / 样式文件
├── package.json     # Project config / 项目配置
├── .npmrc           # npm mirror config / npm 镜像配置
└── start.sh         # Startup script / 启动脚本
```

---

## Build / 打包

```bash
npm run build
```

---

## Permissions / 权限

### macOS

The app requires **Screen Recording** permission. / 应用需要**屏幕录制**权限。

Go to: **System Settings > Privacy & Security > Screen Recording** / 前往：**系统设置 > 隐私与安全性 > 屏幕录制**

Enable VideoCap in the list. / 在列表中启用 VideoCap。

---

## Tech Stack / 技术栈

- **Electron** - Cross-platform desktop app framework / 跨平台桌面应用框架
- **desktopCapturer** - Electron screen capture API / Electron 屏幕捕获 API
- **MediaRecorder** - Browser recording API / 浏览器录制 API
- **WebM/VP9** - Video format / 视频格式

---

## License / 许可证

MIT
