import Svg, {Circle, Defs, G, LinearGradient, Path, Stop} from 'react-native-svg';

/**
 * Original visual signature: abstract orbit and folded light.
 * It carries no data, cannot receive touches and is hidden from accessibility.
 */
export function MidnightOrbit() {
  return (
    <Svg
      width={218}
      height={202}
      viewBox="0 0 218 202"
      pointerEvents="none"
      accessible={false}
      importantForAccessibility="no-hide-descendants"
    >
      <Defs>
        <LinearGradient id="orbitOuter" x1="0%" y1="0%" x2="95%" y2="100%">
          <Stop offset="0%" stopColor="#DFFD92" stopOpacity="0.98"/>
          <Stop offset="46%" stopColor="#A7E545" stopOpacity="0.86"/>
          <Stop offset="100%" stopColor="#2B715B" stopOpacity="0.56"/>
        </LinearGradient>
        <LinearGradient id="orbitInner" x1="15%" y1="0%" x2="95%" y2="100%">
          <Stop offset="0%" stopColor="#FAFFDE" stopOpacity="0.91"/>
          <Stop offset="55%" stopColor="#C6FB5A" stopOpacity="0.88"/>
          <Stop offset="100%" stopColor="#335D46" stopOpacity="0.12"/>
        </LinearGradient>
      </Defs>
      <G id="orbital-surface">
        <Circle cx="122" cy="94" r="65" fill="#C7FB58" opacity="0.055"/>
        <Path
          d="M 28 135 C 54 76 109 26 166 34
             C 205 41 211 73 186 104
             C 163 134 106 147 68 139"
          fill="none" stroke="url(#orbitOuter)"
          strokeWidth={25} strokeLinecap="round"
        />
        <Path
          d="M 54 120 C 85 88 116 76 151 80
             C 180 83 188 96 166 116"
          fill="none" stroke="url(#orbitInner)"
          strokeWidth={12} strokeLinecap="round" opacity="0.79"
        />
      </G>
      <G id="fine-orbit-guides">
        <Path d="M 48 165 C 98 181 161 150 196 107"
          fill="none" stroke="#D8FC8A" strokeWidth={1.5}
          strokeLinecap="round" opacity="0.27"/>
        <Circle cx="192" cy="109" r={3} fill="#D8FC8A" opacity="0.75"/>
      </G>
    </Svg>
  );
}
