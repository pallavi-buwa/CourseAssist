/** Official Claro wordmark (black background + light type + red dot) — `public/claro-logo.png`. */
const LOGO_SRC = '/claro-logo.png'

export function ClaroLogoMark({ size = 32, className = '' }) {
  return (
    <img
      src={LOGO_SRC}
      alt="Claro"
      className={`block object-contain object-center ${className}`}
      style={{ height: size, width: 'auto', maxWidth: 'min(100%, 320px)' }}
      loading="lazy"
      decoding="async"
    />
  )
}
