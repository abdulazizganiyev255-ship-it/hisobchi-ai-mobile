import Svg, {Defs, G, LinearGradient, Path, Stop} from 'react-native-svg';

/**
 * Original folded satin mark — decorative, not an interactive/financial UI.
 * One continuous S-shaped fabric with a back fold and light-catching front.
 * No stock image, remote fetch, timers, or overlay touch interception.
 */
export function SculpturalRibbon() {
  return (
    <Svg
      width={218}
      height={183}
      viewBox="0 0 240 200"
      pointerEvents="none"
      accessible={false}
      importantForAccessibility="no-hide-descendants"
    >
      <Defs>
        <LinearGradient id="satinBack" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#C18AA1"/>
          <Stop offset="45%" stopColor="#864963"/>
          <Stop offset="100%" stopColor="#4E263A"/>
        </LinearGradient>
        <LinearGradient id="satinFront" x1="15%" y1="5%" x2="95%" y2="88%">
          <Stop offset="0%" stopColor="#F8E8EA"/>
          <Stop offset="22%" stopColor="#E6BAC9"/>
          <Stop offset="58%" stopColor="#B57896"/>
          <Stop offset="100%" stopColor="#743850"/>
        </LinearGradient>
        <LinearGradient id="satinHighlight" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.84"/>
          <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="0"/>
        </LinearGradient>
      </Defs>
      <G id="fabric-back-fold">
        <Path
          d="M 23 170 C 67 185 123 159 166 133 C 217 102 233 48 202 26
             C 214 65 181 92 142 110 C 104 126 56 138 23 149
             C 13 152 13 166 23 170 Z"
          fill="url(#satinBack)"
        />
      </G>
      <G id="fabric-front-loop">
        <Path
          d="M 38 128 C 66 75 94 33 140 24 C 176 17 207 38 213 70
             C 193 49 168 52 143 72 C 115 95 94 144 66 154
             C 40 164 26 149 38 128 Z"
          fill="url(#satinFront)"
        />
        <Path
          d="M 66 154 C 95 144 115 95 143 72 C 168 52 193 49 213 70
             C 212 90 197 102 168 113 C 127 128 103 155 82 163
             C 71 167 64 162 66 154 Z"
          fill="url(#satinBack)" opacity="0.75"
        />
      </G>
      <G id="fabric-specular-light">
        <Path d="M 42 128 C 75 75 106 40 142 35 C 163 31 180 38 195 50"
          fill="none" stroke="url(#satinHighlight)" strokeWidth={5}
          strokeLinecap="round" opacity={0.68}/>
        <Path d="M 31 159 C 71 171 125 146 175 121"
          fill="none" stroke="url(#satinHighlight)" strokeWidth={3}
          strokeLinecap="round" opacity={0.38}/>
      </G>
    </Svg>
  );
}
