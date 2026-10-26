/** 颗粒噪点 + 暗角：让屏幕像一张有点旧的深色桌面 */
export default function Atmosphere() {
  return (
    <div className="atmosphere" aria-hidden="true">
      <div className="atmosphere__vignette" />
      <div className="atmosphere__grain" />
    </div>
  )
}