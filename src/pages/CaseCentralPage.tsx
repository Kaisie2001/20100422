import PartitionCasePage from '../components/PartitionCasePage';
import { partitionCases } from '../data/partitionCaseData';

export default function CaseCentralPage() {
  return <PartitionCasePage data={partitionCases.central} />;
}