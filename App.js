import React, { useMemo, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
  useWindowDimensions,
} from 'react-native';
import {
  Menu,
  Bell,
  Settings,
  Search,
  Scan,
  Truck,
  Nut,
  Stethoscope,
  Tv,
  FileSpreadsheet,
  ClipboardList,
  FileText,
  Clock,
  Camera,
  MapPin,
  Brain,
  Handshake,
  Bot,
  BarChart3,
  Network,
  Cloud,
  Bluetooth,
  Home,
  Wrench,
  MoreHorizontal,
  Link as LinkIcon,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react-native';

const ORANGE = '#ff6a00';
const GREEN = '#39df4a';
const BG = '#050607';
const CARD = '#101417';
const CARD2 = '#0c1013';
const LINE = '#263039';
const TEXT = '#f4f6f8';
const MUTED = '#9aa3ad';

const tools = [
  { key: 'vin', label: 'VIN LOOKUP', sub: 'Decode VIN, ESN, CPL & more', icon: Truck },
  { key: 'parts', label: 'OEM PARTS', sub: 'OEM parts, diagrams & cross refs', icon: Nut },
  { key: 'fault', label: 'FAULT DOCTOR', sub: 'AI powered fault diagnostics', icon: Stethoscope },
  { key: 'repair', label: 'REPAIR HUD', sub: 'Step-by-step repair guidance', icon: Tv },
  { key: 'quotes', label: 'SMART QUOTES', sub: 'Create estimates & quotes', icon: FileSpreadsheet },
  { key: 'wo', label: 'WORK ORDERS', sub: 'Create, manage & track jobs', icon: ClipboardList },
  { key: 'invoices', label: 'INVOICES', sub: 'Create invoices & send', icon: FileText },
  { key: 'clock', label: 'TIME CLOCK', sub: 'Track time, labor & money', icon: Clock },
  { key: 'camera', label: 'CAMERA / OCR', sub: 'Scan codes, parts & documents', icon: Camera },
  { key: 'gps', label: 'DOT / GPS', sub: 'GPS, routes, ELD & location', icon: MapPin },
  { key: 'memory', label: 'REPAIR MEMORY', sub: 'Saved repairs, history & notes', icon: Brain },
  { key: 'suppliers', label: 'SUPPLIERS', sub: 'Parts suppliers & contacts', icon: Handshake },
  { key: 'assistant', label: 'AI ASSISTANT', sub: 'Ask AI for help & advice', icon: Bot },
  { key: 'reports', label: 'REPORTS', sub: 'Analytics & performance', icon: BarChart3 },
  { key: 'settings', label: 'SETTINGS', sub: 'App settings & preferences', icon: Settings },
];

export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const compact = width < 420;
  const columns = compact ? 3 : 5;
  const tileGap = 8;
  const tileWidth = useMemo(() => {
    const pagePad = 24;
    return (width - pagePad - tileGap * (columns - 1)) / columns;
  }, [width, columns]);

  const [clockedIn, setClockedIn] = useState(true);
  const [query, setQuery] = useState('');

  const handleToolPress = (tool) => {
    console.log(`Open module: ${tool.label}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={BG} />

      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} activeOpacity={0.75}>
          <Menu color={TEXT} size={25} />
        </TouchableOpacity>

        <View style={styles.brandWrap}>
          <View style={styles.logoMark}>
            <Wrench color={ORANGE} size={21} />
          </View>
          <View>
            <Text style={styles.logoTextMain}>
              ROLLING <Text style={styles.logoTextSub}>WRENCH</Text> AI
            </Text>
            <Text style={styles.logoSubtext}>DIESEL DIAGNOSTICS & REPAIR PLATFORM</Text>
          </View>
        </View>

        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconBadgeContainer} activeOpacity={0.75}>
            <Bell color={TEXT} size={23} />
            <View style={styles.badge}><Text style={styles.badgeText}>3</Text></View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerSpacer} activeOpacity={0.75}>
            <Settings color={MUTED} size={24} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
        <View style={styles.connectionBar}>
          <View style={styles.connectionLeft}>
            <View style={styles.greenDot} />
            <Text style={styles.connectionTextBold}>ACTIVE TRUCK</Text>
            <View style={styles.divider} />
            <Text style={styles.connectionText}>CUMMINS X15</Text>
            <View style={styles.divider} />
            <Text style={styles.connectionTextSubtle}>VIN: 1XP4D49X8KD123456</Text>
          </View>
          <View style={styles.connectionRight}>
            <LinkIcon color={MUTED} size={14} />
            <Text style={styles.connectedText}>CONNECTED</Text>
          </View>
        </View>

        <View style={[styles.topCardsRow, compact && styles.topCardsStack]}>
          <View style={styles.topCard}>
            <Text style={styles.cardHeaderTitle}>TIME CLOCK</Text>
            <View style={styles.statusRow}>
              <View style={styles.greenDot} />
              <Text style={styles.statusTextGreen}>{clockedIn ? 'ON THE CLOCK' : 'CLOCKED OUT'}</Text>
            </View>
            <View style={styles.clockLine}>
              <View>
                <Text style={styles.timeClockTimer}>02:47:33</Text>
                <Text style={styles.earningsLabel}>Today’s Earnings</Text>
                <Text style={styles.earningsValue}>$642.75</Text>
                <Text style={styles.rollingText}>{clockedIn ? 'Rolling' : 'Stopped'}</Text>
              </View>
              <View style={styles.clockIconRing}>
                <Clock color={ORANGE} size={34} />
              </View>
            </View>
            <TouchableOpacity style={styles.cardButton} onPress={() => setClockedIn(!clockedIn)} activeOpacity={0.8}>
              <Text style={styles.cardButtonText}>{clockedIn ? 'CLOCK OUT' : 'CLOCK IN'}</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.topCard, styles.truckCard]}>
            <Text style={styles.cardHeaderTitleOrng}>ACTIVE TRUCK</Text>
            <View style={styles.truckContent}>
              <View style={styles.truckPhoto}>
                <Truck color={TEXT} size={46} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.truckTitle}>2020 FREIGHTLINER CASCADIA 126</Text>
                <Text style={styles.truckDetails}>VIN: 1XP4D49X8KD123456</Text>
                <Text style={styles.truckDetails}>Engine: CUMMINS X15</Text>
                <Text style={styles.truckDetails}>CPL: 4342</Text>
                <Text style={styles.truckDetails}>Odometer: 453,218 mi</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.cardButton} activeOpacity={0.8}>
              <Text style={styles.cardButtonText}>TRUCK PROFILE</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.topCard}>
            <Text style={styles.cardHeaderTitle}>SYSTEM STATUS</Text>
            <View style={styles.progressCircleContainer}>
              <Text style={styles.progressPercentage}>98%</Text>
              <Text style={styles.progressLabel}>HEALTH</Text>
            </View>
            <View style={styles.systemNormalRow}>
              <Text style={styles.statusTextGreenCenter}>All Systems Normal</Text>
              <CheckCircle color={GREEN} size={15} />
            </View>
            <TouchableOpacity style={styles.cardButton} activeOpacity={0.8}>
              <Text style={styles.cardButtonText}>VIEW DETAILS</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.searchBar}>
          <Search color={TEXT} size={22} />
          <View style={styles.searchTextWrap}>
            <Text style={styles.searchTitle}>MASTER SEARCH</Text>
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search VIN, Part #, Symptoms, Fault Codes, Repair..."
              placeholderTextColor="#777f88"
              style={styles.searchInput}
            />
          </View>
          <TouchableOpacity activeOpacity={0.75}>
            <Scan color={TEXT} size={23} />
          </TouchableOpacity>
        </View>

        <View style={[styles.gridContainer, { gap: tileGap }]}>
          {tools.map((item) => {
            const Icon = item.icon;
            return (
              <TouchableOpacity
                key={item.key}
                style={[styles.gridItem, { width: tileWidth }]}
                onPress={() => handleToolPress(item)}
                activeOpacity={0.78}
              >
                <Icon color={ORANGE} size={compact ? 28 : 34} strokeWidth={2.2} />
                <Text style={styles.gridLabel}>{item.label}</Text>
                <Text style={styles.gridSubLabel} numberOfLines={2}>{item.sub}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={[styles.bottomWidgetsRow, compact && styles.bottomWidgetsStack]}>
          <View style={styles.bottomWidget}>
            <View style={styles.widgetHeaderRow}>
              <AlertTriangle color={ORANGE} size={16} />
              <Text style={styles.widgetHeader}>TOP FAULTS TODAY</Text>
              <Text style={styles.viewAll}>View All</Text>
            </View>
            {[
              ['P2009', 'DPF Differential Pressure', '4'],
              ['SPN 157', 'EGR Position Sensor', '3'],
              ['SPN 111 FMI 5', 'Coolant Temperature High', '2'],
              ['U0101', 'Lost Comm w/ ECM', '1'],
            ].map(([code, label, count]) => (
              <View style={styles.faultRow} key={code}>
                <View>
                  <Text style={styles.faultCode}>{code}</Text>
                  <Text style={styles.faultDesc}>{label}</Text>
                </View>
                <View style={styles.badgeCount}><Text style={styles.badgeCountText}>{count}</Text></View>
              </View>
            ))}
          </View>

          <View style={styles.bottomWidget}>
            <View style={styles.widgetHeaderRow}>
              <Text style={styles.widgetHeader}>RECENT WORK ORDERS</Text>
              <Text style={styles.viewAll}>View All</Text>
            </View>
            {[
              ['WO-10045', 'DPF Cleaning', 'IN PROGRESS'],
              ['WO-10044', 'EGR Valve Replacement', 'COMPLETE'],
              ['WO-10043', 'Coolant Temp Sensor', 'COMPLETE'],
              ['WO-10042', 'Air Leak Inspection', 'COMPLETE'],
            ].map(([id, label, status]) => (
              <View style={styles.orderRow} key={id}>
                <View>
                  <Text style={styles.orderId}>{id}</Text>
                  <Text style={styles.faultDesc}>{label}</Text>
                </View>
                <Text style={status === 'IN PROGRESS' ? styles.statusInProg : styles.statusDone}>{status}</Text>
              </View>
            ))}
          </View>

          <View style={styles.bottomWidget}>
            <View style={styles.widgetHeaderRow}>
              <Text style={styles.widgetHeader}>EARNINGS SUMMARY</Text>
              <Text style={styles.periodPill}>This Week</Text>
            </View>
            <Text style={styles.earningsTotal}>$3,842.50</Text>
            <Text style={styles.earningsLabel}>Total Earnings</Text>
            <View style={styles.chartContainer}>
              {[44, 70, 52, 76, 88, 100, 38].map((height, i) => (
                <View key={i} style={styles.chartColumn}>
                  <View style={[styles.chartBar, { height: height * 0.52 }]} />
                  <Text style={styles.chartLabel}>{['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}</Text>
                </View>
              ))}
            </View>
            <TouchableOpacity style={styles.cardButton} activeOpacity={0.8}>
              <Text style={styles.cardButtonText}>VIEW REPORTS</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.infraBar}>
          {[
            [Network, 'GATEWAY', 'CONNECTED'],
            [Brain, 'AI SYSTEM', 'ONLINE'],
            [Cloud, 'SUPABASE', 'SYNCED'],
            [Bluetooth, 'BLUETOOTH', 'CONNECTED'],
          ].map(([Icon, title, status]) => (
            <View style={styles.infraItem} key={title}>
              <Icon color={GREEN} size={20} />
              <View>
                <Text style={styles.infraText}>{title}</Text>
                <Text style={styles.infraStatus}>{status}</Text>
              </View>
              <View style={styles.infraDot} />
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.bottomNav}>
        {[
          [Home, 'HOME', true],
          [Stethoscope, 'DOCTOR', false],
          [Nut, 'PARTS', false],
          [Wrench, 'REPAIR', false],
          [MoreHorizontal, 'MORE', false],
        ].map(([Icon, label, active]) => (
          <TouchableOpacity key={label} style={[styles.navItem, active && styles.activeNavItem]} activeOpacity={0.75}>
            <Icon color={active ? ORANGE : MUTED} size={25} />
            <Text style={[styles.navText, active && styles.activeNavText]}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const shadow = {
  shadowColor: '#000',
  shadowOpacity: 0.45,
  shadowRadius: 14,
  shadowOffset: { width: 0, height: 7 },
  elevation: 8,
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },
  scrollContainer: { paddingHorizontal: 12, paddingBottom: 112 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 12,
    backgroundColor: BG,
  },
  headerButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#11161a',
    borderWidth: 1,
    borderColor: LINE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandWrap: { flexDirection: 'row', alignItems: 'center', gap: 10, flexShrink: 1 },
  logoMark: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: ORANGE,
    backgroundColor: '#15191d',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoTextMain: { color: TEXT, fontSize: 23, fontWeight: '900', letterSpacing: 0.8 },
  logoTextSub: { color: ORANGE },
  logoSubtext: { color: '#8a8f96', fontSize: 9, fontWeight: '800', marginTop: 2, letterSpacing: 1.2 },
  headerIcons: { flexDirection: 'row', alignItems: 'center' },
  headerSpacer: { marginLeft: 15 },
  iconBadgeContainer: { position: 'relative' },
  badge: {
    position: 'absolute',
    right: -7,
    top: -8,
    backgroundColor: ORANGE,
    borderRadius: 9,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: '900' },

  connectionBar: {
    minHeight: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: LINE,
    backgroundColor: '#10151a',
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...shadow,
  },
  connectionLeft: { flexDirection: 'row', alignItems: 'center', flexShrink: 1 },
  greenDot: { width: 9, height: 9, borderRadius: 6, backgroundColor: GREEN, marginRight: 8 },
  divider: { height: 20, width: 1, backgroundColor: '#38434d', marginHorizontal: 12 },
  connectionTextBold: { color: TEXT, fontSize: 12, fontWeight: '900', letterSpacing: 0.7 },
  connectionText: { color: '#d4d7da', fontSize: 12, fontWeight: '800', letterSpacing: 0.8 },
  connectionTextSubtle: { color: '#a0a7af', fontSize: 12, fontWeight: '700' },
  connectionRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  connectedText: { color: GREEN, fontSize: 12, fontWeight: '900' },

  topCardsRow: { flexDirection: 'row', gap: 10, marginTop: 12 },
  topCardsStack: { flexDirection: 'column' },
  topCard: {
    flex: 1,
    minHeight: 192,
    backgroundColor: CARD,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: LINE,
    justifyContent: 'space-between',
    ...shadow,
  },
  truckCard: { flex: 1.42 },
  cardHeaderTitle: { color: '#e3e7eb', fontSize: 13, fontWeight: '900', letterSpacing: 0.7 },
  cardHeaderTitleOrng: { color: ORANGE, fontSize: 13, fontWeight: '900', letterSpacing: 0.7 },
  statusRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  statusTextGreen: { color: GREEN, fontSize: 11, fontWeight: '900' },
  clockLine: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  timeClockTimer: { color: TEXT, fontSize: 26, fontWeight: '900', marginTop: 8 },
  earningsLabel: { color: MUTED, fontSize: 12, marginTop: 8 },
  earningsValue: { color: GREEN, fontSize: 25, fontWeight: '900', marginTop: 2 },
  rollingText: { color: GREEN, fontSize: 12, fontWeight: '800', marginTop: 3 },
  clockIconRing: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 3,
    borderColor: ORANGE,
    backgroundColor: '#24170d',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardButton: {
    borderWidth: 1.5,
    borderColor: ORANGE,
    borderRadius: 9,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 12,
    backgroundColor: '#14100c',
  },
  cardButtonText: { color: ORANGE, fontSize: 12, fontWeight: '900', letterSpacing: 0.6 },
  truckContent: { flexDirection: 'row', gap: 12, alignItems: 'center', marginVertical: 10 },
  truckPhoto: {
    width: 92,
    height: 78,
    borderRadius: 12,
    backgroundColor: '#0a0d10',
    borderWidth: 1,
    borderColor: '#202831',
    alignItems: 'center',
    justifyContent: 'center',
  },
  truckTitle: { color: TEXT, fontSize: 14, fontWeight: '900', lineHeight: 20 },
  truckDetails: { color: MUTED, fontSize: 11, marginTop: 4, fontWeight: '600' },
  progressCircleContainer: {
    alignSelf: 'center',
    width: 118,
    height: 118,
    borderRadius: 59,
    borderWidth: 9,
    borderColor: GREEN,
    borderRightColor: '#3a4147',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
  },
  progressPercentage: { color: TEXT, fontSize: 31, fontWeight: '900' },
  progressLabel: { color: MUTED, fontSize: 13, fontWeight: '800' },
  systemNormalRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  statusTextGreenCenter: { color: GREEN, fontSize: 13, fontWeight: '800' },

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CARD,
    marginTop: 12,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: LINE,
    ...shadow,
  },
  searchTextWrap: { flex: 1, marginLeft: 12 },
  searchTitle: { color: TEXT, fontSize: 13, fontWeight: '900', letterSpacing: 0.7 },
  searchInput: { color: TEXT, fontSize: 13, padding: 0, marginTop: 3 },

  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 },
  gridItem: {
    minHeight: 128,
    backgroundColor: CARD2,
    borderRadius: 13,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: LINE,
    ...shadow,
  },
  gridLabel: { color: TEXT, fontSize: 11, fontWeight: '900', marginTop: 10, textAlign: 'center', letterSpacing: 0.2 },
  gridSubLabel: { color: MUTED, fontSize: 10, marginTop: 5, textAlign: 'center', lineHeight: 14 },

  bottomWidgetsRow: { flexDirection: 'row', gap: 10, marginTop: 14 },
  bottomWidgetsStack: { flexDirection: 'column' },
  bottomWidget: {
    flex: 1,
    backgroundColor: CARD,
    borderRadius: 14,
    padding: 13,
    borderWidth: 1,
    borderColor: LINE,
    minHeight: 184,
    ...shadow,
  },
  widgetHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 8 },
  widgetHeader: { color: TEXT, fontSize: 12, fontWeight: '900', letterSpacing: 0.4, flex: 1 },
  viewAll: { color: ORANGE, fontSize: 10, fontWeight: '900' },
  faultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#1d242a',
    paddingVertical: 8,
  },
  faultCode: { color: TEXT, fontSize: 13, fontWeight: '800' },
  faultDesc: { color: MUTED, fontSize: 10, marginTop: 2 },
  badgeCount: {
    backgroundColor: '#3a210f',
    borderRadius: 8,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeCountText: { color: ORANGE, fontSize: 12, fontWeight: '900' },
  orderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#1d242a',
    paddingVertical: 8,
  },
  orderId: { color: TEXT, fontSize: 13, fontWeight: '900' },
  statusInProg: { color: ORANGE, fontSize: 10, fontWeight: '900', alignSelf: 'center' },
  statusDone: { color: GREEN, fontSize: 10, fontWeight: '900', alignSelf: 'center' },
  periodPill: {
    color: MUTED,
    fontSize: 10,
    borderWidth: 1,
    borderColor: LINE,
    borderRadius: 7,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  earningsTotal: { color: GREEN, fontSize: 24, fontWeight: '900' },
  chartContainer: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 12, height: 72 },
  chartColumn: { alignItems: 'center', justifyContent: 'flex-end', flex: 1 },
  chartBar: { width: 13, backgroundColor: ORANGE, borderRadius: 3 },
  chartLabel: { color: MUTED, fontSize: 10, marginTop: 5, fontWeight: '800' },

  infraBar: { flexDirection: 'row', gap: 8, marginTop: 12 },
  infraItem: {
    flex: 1,
    minHeight: 52,
    borderRadius: 12,
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: LINE,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    gap: 8,
  },
  infraText: { color: TEXT, fontSize: 9, fontWeight: '900' },
  infraStatus: { color: GREEN, fontSize: 9, fontWeight: '900', marginTop: 2 },
  infraDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: GREEN, marginLeft: 'auto' },

  bottomNav: {
    position: 'absolute',
    bottom: 8,
    left: 12,
    right: 12,
    height: 72,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#090c0f',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: LINE,
    overflow: 'hidden',
    ...shadow,
  },
  navItem: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  activeNavItem: {
    borderTopWidth: 2,
    borderTopColor: ORANGE,
    backgroundColor: '#15100c',
  },
  navText: { color: MUTED, fontSize: 10, marginTop: 5, fontWeight: '900' },
  activeNavText: { color: ORANGE },
});
