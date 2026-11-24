import Svg, {Defs, LinearGradient, Path, Stop} from 'react-native-svg';

/**
 * Decorative ribbon for the plum balance card.
 * It is intentionally non-interactive and does not carry financial data.
 */
export function BalanceRibbon() {
  return <Svg
    width={196}
    height={214}
    viewBox="0 0 196 214"
    accessible={false}
  >
    <Defs>
      <LinearGradient id="ribbonFront" x1="0" y1="0" x2="1" y2="1">
        <Stop offset="0" stopColor="#F8D4C6" stopOpacity="0.92"/>
        <Stop offset="0.44" stopColor="#DB91AD" stopOpacity="0.9"/>
        <Stop offset="1" stopColor="#9E4F76" stopOpacity="0.86"/>
      </LinearGradient>
      <LinearGradient id="ribbonBack" x1="0" y1="0" x2="1" y2="1">
        <Stop offset="0" stopColor="#DDA4B5" stopOpacity="0.8"/>
        <Stop offset="1" stopColor="#713351" stopOpacity="0.7"/>
      </LinearGradient>
    </Defs>
    <Path d="M158 -18 C65 20 209 71 108 127 C49 160 114 214 190 233" stroke="url(#ribbonBack)" strokeWidth="41" fill="none" strokeLinecap="round"/>
    <Path d="M192 -6 C102 28 199 71 100 126 C41 158 112 214 175 229" stroke="url(#ribbonFront)" strokeWidth="31" fill="none" strokeLinecap="round"/>
    <Path d="M190 0 C109 33 200 79 107 125 C56 152 107 199 165 213" stroke="#FFE5D8" strokeOpacity="0.30" strokeWidth="4" fill="none" strokeLinecap="round"/>
  </Svg>;
}
