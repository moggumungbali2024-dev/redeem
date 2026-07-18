const fs = require('fs');
let code = fs.readFileSync('src/views/UserApp.tsx', 'utf-8');

const oldScanView = `function ScanView({ user, updateUser, partners }: { user: User, updateUser: (updates: Partial<User>) => Promise<void>, partners: Partner[] }) {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [scanned, setScanned] = useState(false);

  const handleScan = async (text: string) => {
    if (scanned) return;
    setScanned(true);
    // Mock QR code logic
    alert('Scanned! Earned 500 points for checking in.');
    await updateUser({ points: user.points + 500 });
    navigate(-1);
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="flex flex-col h-full bg-black text-white relative">
      <div className="absolute top-5 left-5 z-20">`;

const newScanView = `function ScanView({ user, updateUser, partners }: { user: User, updateUser: (updates: Partial<User>) => Promise<void>, partners: Partner[] }) {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [scanned, setScanned] = useState(false);
  const [pointAnim, setPointAnim] = useState<{amount: number, type: 'earn'|'spend'} | null>(null);

  const handleScan = async (text: string) => {
    if (scanned) return;
    setScanned(true);
    setPointAnim({ amount: 500, type: 'earn' });
    await updateUser({ points: user.points + 500 });
    setTimeout(() => navigate(-1), 2000);
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="flex flex-col h-full bg-black text-white relative">
      {pointAnim && <PointAnimation amount={pointAnim.amount} type={pointAnim.type} onComplete={() => setPointAnim(null)} />}
      <div className="absolute top-5 left-5 z-20">`;

code = code.replace(oldScanView, newScanView);
fs.writeFileSync('src/views/UserApp.tsx', code);
