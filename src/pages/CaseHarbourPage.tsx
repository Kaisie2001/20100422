import PartitionCasePage from '../components/PartitionCasePage';
import { partitionCases } from '../data/partitionCaseData';

export default function CaseHarbourPage() {
  return <PartitionCasePage data={partitionCases.harbour} />;
}