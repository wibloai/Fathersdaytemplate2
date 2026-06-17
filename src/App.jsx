import { useState, useEffect, useRef } from 'react'
import './App.css'

// ─── Data (mirrors sites.custom_data schema) ───────────────────────────────
const DATA = {
  theme_style: 'retro',
  content: {
    dad_name: 'Arvind Sharma',
    hero_tagline: 'Special Delivery for',
    custom_letter:
      'Dear Dad,\n\nThank you for everything you gave without ever being asked. For the early mornings, the late nights, and the quiet sacrifices that shaped everything I am.\n\nI see your hands in every problem I solve, your patience in every moment I hold my temper, and your laugh in the way I forget myself and just feel happy.\n\nYou taught me that love is a verb — something you do every single day, not something you say once. I watched you live that truth for as long as I can remember.\n\nThank you for the bike rides and the road trips. For the long drives where we talked about nothing and everything. For showing up, always — without fail, without question.\n\nYou are my first hero, my compass, and my favourite human. I would choose you a hundred times over.\n\nHappy Father\'s Day, Dad. I love you more than I\'ll ever say right.\n\nAlways yours,',
    music_source_url: '/song.mp3',
    memory_photos: [
      {
        url: 'https://images.unsplash.com/photo-1529073526757-c0a9e0bc64e5?w=480&q=80',
        year: '2005',
        caption: 'Teaching me to ride a bike.',
      },
      {
        url: 'https://images.unsplash.com/photo-1591474200742-8e512e6f98f8?w=480&q=80',
        year: '2010',
        caption: 'That summer road trip.',
      },
      {
        url: 'https://images.unsplash.com/photo-1529697216570-9a2ea1f58a68?w=480&q=80',
        year: '2016',
        caption: 'Graduation day. You cried first.',
      },
      {
        url: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=480&q=80',
        year: '2022',
        caption: 'Always just a call away.',
      },
    ],
  },
}

// ─── Phase 1: The Delivery (Envelope) ──────────────────────────────────────
// animPhase: 'idle' → 'opening' (flap lifts + letter rises) → 'out' (fade away)
function PhaseEnvelope({ onOpen }) {
  const [typed, setTyped]       = useState('')
  const [ready, setReady]       = useState(false)
  const [animPhase, setAnimPhase] = useState('idle') // idle | opening | out
  const fullText = `${DATA.content.hero_tagline} ${DATA.content.dad_name}`

  useEffect(() => {
    let i = 0
    const start = setTimeout(() => {
      const iv = setInterval(() => {
        i++
        setTyped(fullText.slice(0, i))
        if (i >= fullText.length) {
          clearInterval(iv)
          setTimeout(() => setReady(true), 400)
        }
      }, 58)
      return () => clearInterval(iv)
    }, 500)
    return () => clearTimeout(start)
  }, [fullText])

  const handleTap = () => {
    if (!ready || animPhase !== 'idle') return
    setAnimPhase('opening')
    setTimeout(() => setAnimPhase('out'), 1000)
    setTimeout(onOpen, 1550)
  }

  return (
    <div className="phase phase-1">
      <p className="p1-tagline">
        {typed}
        <span className="blink-cursor" aria-hidden="true">|</span>
      </p>

      {/* Envelope scene — perspective wrapper */}
      <div
        className={`env-scene env-scene--${animPhase} ${ready ? 'env-scene--ready' : ''}`}
        onClick={handleTap}
        role="button"
        aria-label="Tap to open envelope"
        tabIndex={0}
        onKeyDown={e => e.key === 'Enter' && handleTap()}
      >
        {/* Letter that peeks out as flap opens */}
        <div className="env-letter-peek">
          <div className="env-letter-line" />
          <div className="env-letter-line" />
          <div className="env-letter-line env-letter-line--short" />
          <p className="env-letter-text">with love ♡</p>
        </div>

        {/* Envelope body SVG — static (no top flap path) */}
        <svg className="env-body-svg" viewBox="0 0 280 190" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="3" width="274" height="184" rx="8" fill="#EDE0C4" stroke="#C8A87A" strokeWidth="2.5"/>
          <path d="M3 3 L3 187 L100 100Z"       fill="#DFD0B0" stroke="#C8A87A" strokeWidth="1.5"/>
          <path d="M277 3 L277 187 L180 100Z"    fill="#DFD0B0" stroke="#C8A87A" strokeWidth="1.5"/>
          <path d="M3 187 L140 92 L277 187Z"     fill="#D9C99A" stroke="#C8A87A" strokeWidth="1.5"/>
          <circle cx="140" cy="130" r="18" fill="#B24030" opacity="0.9"/>
          <circle cx="140" cy="130" r="14" fill="#C4553A" opacity="0.85"/>
          <text x="140" y="135" textAnchor="middle" fill="#FAE8E0" fontSize="14" fontFamily="Georgia,serif">♥</text>
          <rect x="226" y="14" width="38" height="48" rx="2" fill="#F0E8D0" stroke="#C8A87A" strokeWidth="1" strokeDasharray="3 2"/>
          <rect x="230" y="18" width="30" height="32" rx="1" fill="#D4B896"/>
          <text x="245" y="36" textAnchor="middle" fill="#7A5A3A" fontSize="9" fontFamily="monospace">♡</text>
          <text x="245" y="48" textAnchor="middle" fill="#7A5A3A" fontSize="5" fontFamily="monospace">DAD</text>
        </svg>

        {/* Animated flap — triangle clip, rotates back on open */}
        <div className="env-flap" aria-hidden="true" />

        {ready && animPhase === 'idle' && (
          <div className="tap-hint-wrap">
            <span className="tap-hint">Tap to Open</span>
            <span className="tap-hint-arrow">↓</span>
          </div>
        )}
      </div>

      <p className="p1-footer">✉ A message, sealed with love</p>
    </div>
  )
}

// ─── Phase 2: The Polaroid Stack ────────────────────────────────────────────
// Rotation and positional offsets for the stacked look
const CARD_ROTATIONS  = ['-4deg', '3.5deg', '-2deg', '4.5deg', '-3deg', '2deg']
const CARD_STACK_TOP  = ['0px', '-8px', '-16px', '-24px', '-32px']
const CARD_STACK_LEFT = ['0px', '6px',  '-5px',  '8px',   '-7px']

function PhasePolaroids({ onDone }) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const [swipedSet, setSwipedSet] = useState(new Set())
  // 'entering' = cards fly out of envelope centre → 'ready' = interactive swipe
  const [stackPhase, setStackPhase] = useState('entering')
  const photos = DATA.content.memory_photos

  // Stagger each card's entrance, then unlock interaction
  useEffect(() => {
    const totalDelay = 300 + photos.length * 140 + 400
    const t = setTimeout(() => setStackPhase('ready'), totalDelay)
    return () => clearTimeout(t)
  }, [photos.length])

  const handleTap = () => {
    if (stackPhase !== 'ready' || swipedSet.has(currentPhotoIndex)) return

    const next = new Set(swipedSet)
    next.add(currentPhotoIndex)
    setSwipedSet(next)

    setTimeout(() => {
      const nextIdx = currentPhotoIndex + 1
      if (nextIdx >= photos.length) {
        setTimeout(onDone, 300)
      } else {
        setCurrentPhotoIndex(nextIdx)
      }
    }, 520)
  }

  return (
    <div className="phase phase-2">
      <p className={`p2-header ${stackPhase === 'ready' ? 'p2-header--visible' : ''}`}>
        Swipe through the memories
      </p>

      {/* Fixed-size area where all polaroids are stacked */}
      <div className="polaroid-stage">
        {photos.map((photo, i) => {
          const isSwiped = swipedSet.has(i)
          const isTop    = i === currentPhotoIndex && !isSwiped
          const rot      = CARD_ROTATIONS[i % CARD_ROTATIONS.length]
          const stackTop  = CARD_STACK_TOP[Math.min(i, CARD_STACK_TOP.length - 1)]
          const stackLeft = CARD_STACK_LEFT[Math.min(i, CARD_STACK_LEFT.length - 1)]

          return (
            <div
              key={i}
              className={`polaroid
                ${isSwiped       ? 'polaroid--swiped'   : ''}
                ${isTop          ? 'polaroid--top'       : ''}
                ${stackPhase === 'entering' ? 'polaroid--entering' : 'polaroid--landed'}
              `}
              style={{
                zIndex: photos.length - i,
                '--rot':   isSwiped ? '14deg' : rot,
                '--top':   stackTop,
                '--left':  stackLeft,
                '--enter-delay': `${300 + i * 140}ms`,
              }}
              onClick={isTop && stackPhase === 'ready' ? handleTap : undefined}
            >
              <div className="polaroid-photo">
                <img src={photo.url} alt={photo.caption} className="polaroid-img" />
              </div>
              <div className="polaroid-label">
                <span className="polaroid-caption">{photo.caption}</span>
                <span className="polaroid-year">{photo.year}</span>
              </div>

              {isTop && stackPhase === 'ready' && (
                <span className="swipe-nudge" aria-hidden="true">tap to swipe →</span>
              )}
            </div>
          )
        })}
      </div>

      <p className="p2-counter">
        {Math.min(currentPhotoIndex + 1, photos.length)} / {photos.length}
      </p>
    </div>
  )
}

// ─── Phase 3: The Folded Note ───────────────────────────────────────────────
function PhaseLetter({ onPlay }) {
  const [unfolded, setUnfolded] = useState(false)
  const [showCTA, setShowCTA]   = useState(false)
  const scrollRef = useRef(null)

  const handleUnfold = () => {
    setUnfolded(true)
    setTimeout(() => setShowCTA(true), 2200)
  }

  const paragraphs = DATA.content.custom_letter.split('\n\n').filter(Boolean)

  return (
    <div className="phase phase-3">
      <div className={`paper ${unfolded ? 'paper--open' : 'paper--folded'}`}>

        {/* Folded state face */}
        {!unfolded && (
          <div className="paper-closed-face">
            <div className="fold-crease fold-crease-1" />
            <div className="fold-crease fold-crease-2" />
            <p className="paper-closed-text">A letter, just for you.</p>
            <button className="unfold-btn" onClick={handleUnfold}>
              Unfold your letter ↓
            </button>
          </div>
        )}

        {/* Unfolded content */}
        {unfolded && (
          <div className="paper-open-face" ref={scrollRef}>
            <div className="paper-ruling" aria-hidden="true" />
            <div className="letter-inner">
              <p className="letter-salutation">Dear {DATA.content.dad_name},</p>
              {paragraphs.map((para, i) => (
                <p key={i} className="letter-para">{para}</p>
              ))}
              <p className="letter-sign">Always yours, ♡</p>
            </div>

            {showCTA && (
              <div className="cassette-cta">
                <CassetteGraphic spinning={false} size={160} />
                <button className="play-btn" onClick={onPlay}>
                  ▶ Press Play
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Cassette SVG Graphic ───────────────────────────────────────────────────
function CassetteGraphic({ spinning, size = 200 }) {
  return (
    <svg
      className={`cassette ${spinning ? 'cassette--spinning' : ''}`}
      width={size}
      height={Math.round(size * 0.6)}
      viewBox="0 0 240 144"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Body */}
      <rect x="2" y="2" width="236" height="140" rx="10" fill="#1E1E1E" stroke="#3A3A3A" strokeWidth="2"/>
      <rect x="10" y="10" width="220" height="124" rx="7" fill="#252525" stroke="#3A3A3A" strokeWidth="1"/>

      {/* Label */}
      <rect x="28" y="14" width="184" height="58" rx="5" fill="#E8C97A" stroke="#BF9A4A" strokeWidth="1.5"/>
      <text x="120" y="33" textAnchor="middle" fill="#1A1100" fontSize="10" fontFamily="'Special Elite', monospace" letterSpacing="2">♪ MEMORIES ♪</text>
      <text x="120" y="48" textAnchor="middle" fill="#3A2800" fontSize="7.5" fontFamily="monospace">FATHER'S DAY MIX — SIDE A</text>
      <line x1="40" y1="57" x2="200" y2="57" stroke="#BF9A4A" strokeWidth="0.8" opacity="0.5"/>
      <text x="120" y="68" textAnchor="middle" fill="#5A4010" fontSize="6" fontFamily="monospace">All the songs. Always.</text>

      {/* Window / tape cavity */}
      <path d="M38 90 Q120 115 202 90" fill="none" stroke="#444" strokeWidth="1"/>
      <rect x="35" y="75" width="170" height="48" rx="4" fill="#141414" stroke="#3A3A3A" strokeWidth="1"/>

      {/* Left reel */}
      <circle cx="82" cy="99" r="20" fill="#1A1A1A" stroke="#555" strokeWidth="1.5"/>
      <circle cx="82" cy="99" r="13" fill="#252525" stroke="#444" strokeWidth="1"/>
      <line x1="82" y1="79" x2="82" y2="119" stroke="#666" strokeWidth="1.2"/>
      <line x1="63" y1="89" x2="101" y2="109" stroke="#666" strokeWidth="1.2"/>
      <line x1="63" y1="109" x2="101" y2="89" stroke="#666" strokeWidth="1.2"/>
      <circle cx="82" cy="99" r="4.5" fill="#3A3A3A" stroke="#555" strokeWidth="1"/>

      {/* Right reel */}
      <circle cx="158" cy="99" r="20" fill="#1A1A1A" stroke="#555" strokeWidth="1.5"/>
      <circle cx="158" cy="99" r="13" fill="#252525" stroke="#444" strokeWidth="1"/>
      <line x1="158" y1="79" x2="158" y2="119" stroke="#666" strokeWidth="1.2"/>
      <line x1="139" y1="89" x2="177" y2="109" stroke="#666" strokeWidth="1.2"/>
      <line x1="139" y1="109" x2="177" y2="89" stroke="#666" strokeWidth="1.2"/>
      <circle cx="158" cy="99" r="4.5" fill="#3A3A3A" stroke="#555" strokeWidth="1"/>

      {/* Corner screws */}
      <circle cx="16" cy="16" r="4.5" fill="#2A2A2A" stroke="#555" strokeWidth="1"/>
      <circle cx="224" cy="16" r="4.5" fill="#2A2A2A" stroke="#555" strokeWidth="1"/>
      <circle cx="16" cy="128" r="4.5" fill="#2A2A2A" stroke="#555" strokeWidth="1"/>
      <circle cx="224" cy="128" r="4.5" fill="#2A2A2A" stroke="#555" strokeWidth="1"/>
    </svg>
  )
}

// ─── Phase 4: Cassette Climax ───────────────────────────────────────────────
// 8 positions — strict edge hugging, wide gap around the centre panel
const SCATTER_POSITIONS = [
  { top: '2%',    left: '1%',    rotate: '-11deg' },  // top-left
  { top: '1%',    right: '1%',   rotate: '9deg'   },  // top-right
  { top: '30%',   left: '-1%',   rotate: '-6deg'  },  // mid-left
  { top: '30%',   right: '-1%',  rotate: '7deg'   },  // mid-right
  { bottom: '1%', left: '2%',    rotate: '5deg'   },  // bottom-left
  { bottom: '1%', right: '2%',   rotate: '-9deg'  },  // bottom-right
  { top: '3%',    left: '22%',   rotate: '4deg'   },  // top inner-left
  { top: '3%',    right: '22%',  rotate: '-7deg'  },  // top inner-right
]

function PhaseClimax() {
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const photos = DATA.content.memory_photos

  const handlePlay = () => {
    if (audioRef.current && DATA.content.music_source_url) {
      audioRef.current.play().catch(() => {})
    }
    setPlaying(true)
  }

  return (
    <div className="phase phase-4">
      {/* Scatter all 8 positions — cycle through photos */}
      {SCATTER_POSITIONS.map((pos, i) => {
        const photo = photos[i % photos.length]
        const { rotate, ...placement } = pos
        return (
          <div
            key={i}
            className={`scatter-card ${playing ? 'scatter-card--visible' : ''}`}
            style={{
              ...placement,
              transform: `rotate(${rotate})`,
              transitionDelay: `${i * 0.1}s`,
            }}
          >
            <div className="scatter-photo">
              <img src={photo.url} alt={photo.caption} />
            </div>
            <p className="scatter-caption">{photo.caption}</p>
          </div>
        )
      })}

      {/* Centrepiece */}
      <div className="climax-centre">
        <p className="climax-label">
          {playing ? '♪ Now Playing — A Song Just for You ♪' : 'One last thing…'}
        </p>

        <CassetteGraphic spinning={playing} size={220} />

        {!playing && (
          <button className="play-btn play-btn--lg" onClick={handlePlay}>
            ▶ Press Play
          </button>
        )}

        {playing && (
          <p className="climax-dedication">
            Happy Father's Day,&nbsp;
            <span className="climax-name">{DATA.content.dad_name}</span>. ♡
          </p>
        )}
      </div>

      <audio
        ref={audioRef}
        src={DATA.content.music_source_url || ''}
        loop
      />
    </div>
  )
}

// ─── Root — State Machine ───────────────────────────────────────────────────
export default function App() {
  const [currentPhase, setCurrentPhase] = useState(1)

  return (
    <div className="scrapbook-root">
      {currentPhase === 1 && (
        <PhaseEnvelope onOpen={() => setCurrentPhase(2)} />
      )}
      {currentPhase === 2 && (
        <PhasePolaroids onDone={() => setCurrentPhase(3)} />
      )}
      {currentPhase === 3 && (
        <PhaseLetter onPlay={() => setCurrentPhase(4)} />
      )}
      {currentPhase === 4 && (
        <PhaseClimax />
      )}
    </div>
  )
}
