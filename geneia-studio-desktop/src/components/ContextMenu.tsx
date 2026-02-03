import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

export interface ContextMenuItem {
  id: string
  label: string
  icon?: React.ReactNode
  shortcut?: string
  disabled?: boolean
  danger?: boolean
  divider?: boolean
  onClick?: () => void
}

interface ContextMenuProps {
  x: number
  y: number
  items: ContextMenuItem[]
  onClose: () => void
}

export function ContextMenu({ x, y, items, onClose }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)

  // Adjust position to keep menu in viewport
  useEffect(() => {
    if (menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect()
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight

      let adjustedX = x
      let adjustedY = y

      if (x + rect.width > viewportWidth) {
        adjustedX = viewportWidth - rect.width - 8
      }
      if (y + rect.height > viewportHeight) {
        adjustedY = viewportHeight - rect.height - 8
      }

      menuRef.current.style.left = `${adjustedX}px`
      menuRef.current.style.top = `${adjustedY}px`
    }
  }, [x, y])

  // Close on escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return createPortal(
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-[99990]" 
        onClick={onClose}
        onContextMenu={(e) => { e.preventDefault(); onClose() }}
      />
      {/* Menu */}
      <div
        ref={menuRef}
        className="fixed z-[99991] bg-[var(--bg-primary)] border border-theme rounded-lg shadow-2xl py-1 min-w-[200px] max-w-[300px]"
        style={{ left: x, top: y }}
      >
        {items.map((item, index) => {
          if (item.divider) {
            return <div key={`divider-${index}`} className="border-t border-theme my-1" />
          }

          return (
            <button
              key={item.id}
              onClick={() => {
                if (!item.disabled && item.onClick) {
                  item.onClick()
                  onClose()
                }
              }}
              disabled={item.disabled}
              className={`w-full px-3 py-1.5 text-left text-sm flex items-center gap-2 transition-colors ${
                item.disabled
                  ? 'text-theme-muted cursor-not-allowed'
                  : item.danger
                  ? 'text-red-400 hover:bg-red-500/10'
                  : 'text-theme-secondary hover:bg-white/5'
              }`}
            >
              {item.icon && <span className="w-4 h-4 flex items-center justify-center">{item.icon}</span>}
              <span className="flex-1">{item.label}</span>
              {item.shortcut && (
                <span className="text-xs text-theme-muted ml-4">{item.shortcut}</span>
              )}
            </button>
          )
        })}
      </div>
    </>,
    document.body
  )
}

// Hook to manage context menu state
export function useContextMenu() {
  const [menu, setMenu] = useState<{ x: number; y: number; items: ContextMenuItem[] } | null>(null)

  const showMenu = (e: React.MouseEvent, items: ContextMenuItem[]) => {
    e.preventDefault()
    e.stopPropagation()
    setMenu({ x: e.clientX, y: e.clientY, items })
  }

  const hideMenu = () => setMenu(null)

  return { menu, showMenu, hideMenu }
}
