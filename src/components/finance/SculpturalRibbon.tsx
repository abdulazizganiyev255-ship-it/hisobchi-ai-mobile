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
      <G id="shadow-depth">
        <Ellipse cx="143" cy="155" rx="68" ry="13" fill="#260E1C" opacity="0.09"/>
      </G>
      <G id="rear-fold">
        <Path
          d="M22 148 C69 132 108 117 146 105 C169 96 184 83 187 66
             L187 100 C179 133 155 151 122 165 C87 179 56 178 22 163
             C17 159 17 153 22 148 Z"
          fill="url(#ribbonRear)"
        />
      </G>
      <G id="satin-main-body">
        <Path
          d="M17 112 C46 65 82 27 123 28 C157 29 184 49 190 81
             C174 69 153 69 137 76 C113 87 89 114 67 141
             C43 157 27 148 17 130 C12 126 12 116 17 112 Z"
          fill="url(#ribbonFront)"
        />
      </G>
      <G id="fold-overlap">
        <Path
          d="M67 141 C90 113 113 87 137 76 C153 69 174 69 190 81
             C185 100 169 109 148 116 C115 128 98 148 75 157 C66 158 61 149 67 141 Z"
          fill="url(#ribbonRear)" opacity="0.88"
        />
      </G>
      <G id="fabric-highlights">
        <Path
          d="M28 112 C61 69 88 40 124 40 C147 40 163 53 174 67"
          fill="none" stroke="url(#ribbonGlint)" strokeWidth={5}
          strokeLinecap="round" opacity="0.45"
        />
        <Path
          d="M80 154 C105 133 135 120 161 108"
          fill="none" stroke="url(#ribbonGlint)" strokeWidth={3}
          strokeLinecap="round" opacity="0.32"
        />
      </G>
    </Svg>
  );
}
