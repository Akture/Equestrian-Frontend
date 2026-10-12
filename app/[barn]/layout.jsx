import BarnAccessGate from '@/components/BarnAccessGate';

export default function BarnLayout({ children }) {
  return <BarnAccessGate>{children}</BarnAccessGate>;
}
