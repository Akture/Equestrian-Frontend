import BarnAccessGate from '@/components/BarnAccessGate';

export default function SelectBarnLayout({ children }) {
  return <BarnAccessGate>{children}</BarnAccessGate>;
}
