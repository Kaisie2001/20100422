import type { UserClaimReadiness } from './userProjects';

export const HK_LOCALIZATION_ASSUMPTIONS = {
  transport: {
    hongKong: 1.02,
    mainlandChina: 1.05,
    asiaRegional: 1.08,
    europe: 1.14,
    america: 1.18,
    unknown: 1.2,
    default: 1.12,
  },
  dataQuality: {
    fullEvidence: 1.0,
    epdOnly: 1.08,
    noEpd: 1.18,
  },
  circular: {
    dryOrDemountable: 0.97,
    reusableLogic: 0.96,
    fixed: 1.0,
  },
} as const;

export interface LocalizationInput {
  originCountry: string;
  epdAvailable: 'yes' | 'no';
  supplierDocsAvailable: 'yes' | 'no';
  shipmentOriginKnown: 'yes' | 'no';
  connection: string;
  reusableLogic: string;
}

export interface LocalizationResult {
  claimReadiness: UserClaimReadiness;
  hkLocalizationStatus: 'HK verified' | 'International EPD + HK CAT check required' | 'Screening only';
  transportFactor: number;
  dataQualityFactor: number;
  circularFactor: number;
  hkAdjustedIntensityKgM2: number;
  hkCheckLogic: string;
}

export function evaluateHongKongLocalization(
  baseIntensityKgM2: number,
  input: LocalizationInput
): LocalizationResult {
  const transportFactor = getTransportFactor(input.originCountry);
  const dataQualityFactor = getDataQualityFactor(
    input.epdAvailable,
    input.supplierDocsAvailable,
    input.shipmentOriginKnown
  );
  const circularFactor = getCircularFactor(input.connection, input.reusableLogic);
  const hkAdjustedIntensityKgM2 = Number(
    (baseIntensityKgM2 * transportFactor * dataQualityFactor * circularFactor).toFixed(2)
  );

  const claimReadiness = getClaimReadiness(
    input.epdAvailable,
    input.supplierDocsAvailable,
    input.shipmentOriginKnown
  );
  const hkLocalizationStatus =
    claimReadiness === 'claim-ready'
      ? 'HK verified'
      : claimReadiness === 'local-check'
      ? 'International EPD + HK CAT check required'
      : 'Screening only';

  return {
    claimReadiness,
    hkLocalizationStatus,
    transportFactor,
    dataQualityFactor,
    circularFactor,
    hkAdjustedIntensityKgM2,
    hkCheckLogic: `HK adjusted intensity = base × transport(${transportFactor}) × dataQuality(${dataQualityFactor}) × circular(${circularFactor}).`,
  };
}

function getTransportFactor(originCountryRaw: string): number {
  const originCountry = originCountryRaw.toLowerCase();
  if (!originCountry || originCountry.includes('unknown')) return HK_LOCALIZATION_ASSUMPTIONS.transport.unknown;
  if (originCountry.includes('hong kong') || originCountry === 'hk') return HK_LOCALIZATION_ASSUMPTIONS.transport.hongKong;
  if (
    originCountry.includes('china') ||
    originCountry.includes('mainland') ||
    originCountry.includes('guangdong')
  ) {
    return HK_LOCALIZATION_ASSUMPTIONS.transport.mainlandChina;
  }
  if (
    originCountry.includes('japan') ||
    originCountry.includes('korea') ||
    originCountry.includes('singapore') ||
    originCountry.includes('taiwan') ||
    originCountry.includes('thailand') ||
    originCountry.includes('asia')
  ) {
    return HK_LOCALIZATION_ASSUMPTIONS.transport.asiaRegional;
  }
  if (
    originCountry.includes('uk') ||
    originCountry.includes('germany') ||
    originCountry.includes('france') ||
    originCountry.includes('italy') ||
    originCountry.includes('europe')
  ) {
    return HK_LOCALIZATION_ASSUMPTIONS.transport.europe;
  }
  if (originCountry.includes('usa') || originCountry.includes('canada') || originCountry.includes('america')) {
    return HK_LOCALIZATION_ASSUMPTIONS.transport.america;
  }
  return HK_LOCALIZATION_ASSUMPTIONS.transport.default;
}

function getDataQualityFactor(
  epdAvailable: 'yes' | 'no',
  supplierDocsAvailable: 'yes' | 'no',
  shipmentOriginKnown: 'yes' | 'no'
): number {
  if (epdAvailable === 'yes' && supplierDocsAvailable === 'yes' && shipmentOriginKnown === 'yes') {
    return HK_LOCALIZATION_ASSUMPTIONS.dataQuality.fullEvidence;
  }
  if (epdAvailable === 'yes') return HK_LOCALIZATION_ASSUMPTIONS.dataQuality.epdOnly;
  return HK_LOCALIZATION_ASSUMPTIONS.dataQuality.noEpd;
}

function getCircularFactor(connectionRaw: string, reusableLogicRaw: string): number {
  const connection = connectionRaw.toLowerCase();
  const reusableLogic = reusableLogicRaw.toLowerCase();
  if (connection.includes('dry') || connection.includes('demountable')) return HK_LOCALIZATION_ASSUMPTIONS.circular.dryOrDemountable;
  if (reusableLogic.includes('reuse') || reusableLogic.includes('reusable')) return HK_LOCALIZATION_ASSUMPTIONS.circular.reusableLogic;
  return HK_LOCALIZATION_ASSUMPTIONS.circular.fixed;
}

function getClaimReadiness(
  epdAvailable: 'yes' | 'no',
  supplierDocsAvailable: 'yes' | 'no',
  shipmentOriginKnown: 'yes' | 'no'
): UserClaimReadiness {
  if (epdAvailable === 'yes' && supplierDocsAvailable === 'yes' && shipmentOriginKnown === 'yes') {
    return 'claim-ready';
  }
  if (epdAvailable === 'yes') return 'local-check';
  return 'screening';
}
