// 检查是否在微信环境中
export const isWechatBrowser = () => {
  const ua = navigator.userAgent.toLowerCase()
  return ua.indexOf('micromessenger') !== -1
}

// 生成二维码链接
export const generateQRCode = (url) => {
  // 使用环境变量中的 URL
  const appUrl = import.meta.env.VITE_APP_URL || window.location.origin
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(appUrl)}`
}