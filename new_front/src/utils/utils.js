// 生成二维码链接
export const generateQRCode = (url) => {
  // 使用环境变量中的 URL
  const appUrl = import.meta.env.VITE_APP_URL || window.location.origin
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(appUrl)}`
}

// 获取当前页面完整URL
export const getCurrentUrl = () => {
  return window.location.href.split('#')[0]
}
