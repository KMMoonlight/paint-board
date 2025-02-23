import OpacityIcon from '@/components/icons/opacity.svg?react'
import { rgbaToHex } from '@/utils/common/color'
import useBoardStore from '@/store/board'
import { debounce } from 'lodash'
import { paintBoard } from '@/utils/paintBoard'
import { useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

const boardConfig = () => {
  const {
    backgroundColor,
    backgroundOpacity,
    updateBackgroundColor,
    updateBackgroundOpacity,
    initBackground,
    isObjectCaching,
    updateCacheState
  } = useBoardStore()
  const { t } = useTranslation()

  // save steps by debounce
  const saveHistory = useCallback(
    debounce(() => {
      paintBoard.render()
    }, 500),
    []
  )

  useEffect(() => {
    if (paintBoard.canvas) {
      initBackground()
    }
  }, [])

  useEffect(() => {
    paintBoard.addHookFn(initBackground)
    return () => {
      paintBoard.removeHookFn(initBackground)
    }
  }, [initBackground])

  return (
    <>
      <div className="form-control mt-3">
        <div className="font-bold font-fredokaOne">Background</div>
        <div className="mt-1 flex items-center w-full">
          <div className="w-8 h-8">
            <input
              type="color"
              value={rgbaToHex(backgroundColor || '')}
              onChange={(e) => {
                updateBackgroundColor(e.target.value)
                saveHistory()
              }}
              className="colorInput"
            />
          </div>
          <div className="divider divider-horizontal mx-3"></div>
          <OpacityIcon className="mr-2" />
          <input
            className="range range-primary range-xs"
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={String(backgroundOpacity)}
            onChange={(e) => {
              updateBackgroundOpacity(Number(e.target.value))
              saveHistory()
            }}
          />
        </div>
      </div>
      <div className="form-control mt-3">
        <div className="font-bold font-fredokaOne">Cache</div>
        <div className="mt-1 flex items-start w-full">
          <input
            type="checkbox"
            className="toggle toggle-success"
            checked={isObjectCaching}
            onChange={updateCacheState}
          />
          <div className="text-xs w-56 ml-3">{t('boardConfig.cacheTip')}</div>
        </div>
      </div>
    </>
  )
}

export default boardConfig
