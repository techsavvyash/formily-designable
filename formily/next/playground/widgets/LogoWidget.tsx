import React from 'react'
import { useTheme } from '@designable/react'

const BHASAI = '../../assets/BHASAI_Logo.png'

const logo = {
  dark: BHASAI,
  light: BHASAI,
}

// const logo = {
//   dark: '//img.alicdn.com/imgextra/i2/O1CN01NTUDi81fHLQvZCPnc_!!6000000003981-55-tps-1141-150.svg',
//   light:
//     '//img.alicdn.com/imgextra/i2/O1CN01Kq3OHU1fph6LGqjIz_!!6000000004056-55-tps-1141-150.svg',
// }

export const LogoWidget: React.FC = () => {
  const url = logo[useTheme()]
  return (
    <div style={{ display: 'flex', alignItems: 'center', fontSize: 20 }}>
      <img
        src={url}
        style={{ height: 20, width: 'auto', scale: 1.2, marginLeft: 10 }}
      />
    </div>
  )
}
