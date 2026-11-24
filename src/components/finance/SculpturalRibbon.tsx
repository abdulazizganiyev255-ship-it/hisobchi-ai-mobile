import Svg, {Defs, Ellipse, G, LinearGradient, Path, Stop} from 'react-native-svg';

/**
 * Decorative signature ribbon for the approved plum/ivory Home direction.
 * Pure SVG: no remote images, no extra runtime dependencies, no touch capture.
 * Financial copy always sits above this layer.
 */
export function SculpturalRibbon() {
  return (
    <Svg
      width={206}
      height={188}
      viewBox="0 0 206 188"
      pointerEvents="none"
      accessible={false}
      importantForAccessibility="no-hide-descendants"
    >
      <Defs>
        <LinearGradient id="ribbonRear" x1="0%" y1="15%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#E4B9C2" stopOpacity="0.82"/>
          <Stop offset="42%" stopColor="#9E647C" stopOpacity="0.94"/>
          <Stop offset="100%" stopColor="#603048" stopOpacity="0.95"/>
        </LinearGradient>
        <LinearGradient id="ribbonFront" x1="12%" y1="0%" x2="88%" y2="100%">
          <Stop offset="0%" stopColor="#F7DEE2" stopOpacity="0.90"/>
          <Stop offset="36%" stopColor="#CA90A4" stopOpacity="0.96"/>
          <Stop offset="80%" stopColor="#99516F" stopOpacity="0.90"/>
          <Stop offset="100%" stopColor="#6F3853" stopOpacity="0.76"/>
        </LinearGradient>
        <LinearGradient id="ribbonGlint" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#FFF7F5" stopOpacity="0.68"/>
          <Stop offset="100%" stopColor="#FFF7F5" stopOpacity="0.02"/>
        </LinearGradient>
      </Defs>
      <G id="floating-shadow">
        <Ellipse cx="119" cy="146" rx="79" ry="21" fill="#260E1C" opacity="0.12"/>
      </G>
      <G id="rear-ribbon-underpass">
        <Path
          d="M32 157 C67 172 124 158 150 127 C159 116 168 102 170 90"
          fill="none" stroke="url(#ribbonRear)"
          strokeWidth={31} strokeLinecap="round"
        />
        <Path
          d="M171 56 C163 46 149 44 136 43 C100 31 64 42 55 72"
          fill="none" stroke="url(#ribbonRear)"
          strokeWidth={31} strokeLinecap="round"
        />
      </G>
      <G id="foreground-ribbon-overpass">
        <Path
          d="M55 68 C59 43 85 28 111 32 C145 37 161 64 150 84 C139 104 100 109 77 98 C51 85 43 63 51 47"
          fill="none" stroke="url(#ribbonFront)"
          strokeWidth={30} strokeLinecap="round"
        />
      </G>
      <G id="satin-highlights">
        <Path
          d="M52 51 C57 41 69 36 84 34 C109 30 135 46 144 66"
          fill="none" stroke="url(#ribbonGlint)"
          strokeWidth={6} strokeLinecap="round" opacity="0.88"
        />
        <Path
          d="M49 158 C86 164 132 145 152 113"
          fill="none" stroke="url(#ribbonGlint)"
          strokeWidth={5} strokeLinecap="round" opacity="0.40"
        />
      </G>
    </Svg>
  );
}
